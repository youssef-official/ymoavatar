import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Camera, X, Info } from "lucide-react";

interface ARViewerProps {
  markerUrl?: string;
  contentType?: string;
  contentUrl?: string;
  projectId?: string;
  targetFileUrl?: string;
}

const ARViewer = ({ markerUrl, contentType, contentUrl, projectId, targetFileUrl }: ARViewerProps) => {
  const [isARActive, setIsARActive] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mindARRef = useRef<any>(null);

  useEffect(() => {
    if (isARActive && targetFileUrl) {
      startMindAR();
    }
    return () => {
      stopAR();
    };
  }, [isARActive, targetFileUrl]);

  const startMindAR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
      }

      // Load MindAR library dynamically
      if (!(window as any).MINDAR) {
        await loadMindARScript();
      }

      // Initialize MindAR
      const MindAR = (window as any).MINDAR.IMAGE;
      const mindarThree = new MindAR.MindARThree({
        container: containerRef.current,
        imageTargetSrc: targetFileUrl,
      });

      mindARRef.current = mindarThree;

      const { renderer, scene, camera } = mindarThree;

      // Add content based on type
      if (contentType === "video" && contentUrl) {
        const video = document.createElement("video");
        video.src = contentUrl;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        const texture = new (window as any).THREE.VideoTexture(video);
        const geometry = new (window as any).THREE.PlaneGeometry(1, 1);
        const material = new (window as any).THREE.MeshBasicMaterial({ map: texture });
        const plane = new (window as any).THREE.Mesh(geometry, material);

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(plane);

        anchor.onTargetFound = () => {
          setIsTracking(true);
          video.play();
        };
        
        anchor.onTargetLost = () => {
          setIsTracking(false);
          video.pause();
        };
      }

      // Increment view count
      if (projectId) {
        const { incrementViewCount } = await import("@/lib/supabase-helpers");
        incrementViewCount(projectId);
      }

      await mindarThree.start();
      
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });

    } catch (error) {
      console.error("Error starting MindAR:", error);
    }
  };

  const loadMindARScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Load Three.js first
      const threeScript = document.createElement("script");
      threeScript.src = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
      threeScript.async = true;
      
      threeScript.onload = () => {
        // Then load MindAR
        const mindScript = document.createElement("script");
        mindScript.src = "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";
        mindScript.async = true;
        mindScript.onload = () => resolve();
        mindScript.onerror = reject;
        document.head.appendChild(mindScript);
      };
      
      threeScript.onerror = reject;
      document.head.appendChild(threeScript);
    });
  };

  const stopAR = () => {
    if (mindARRef.current) {
      mindARRef.current.stop();
      mindARRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsTracking(false);
  };

  const handleStart = () => {
    setIsARActive(true);
    setShowInfo(false);
  };

  const handleStop = () => {
    setIsARActive(false);
    stopAR();
  };

  if (!targetFileUrl) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <Card className="max-w-lg w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <X className="h-10 w-10 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Target Not Ready</h1>
            <p className="text-muted-foreground">
              This AR experience is still being processed. Please try again later.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isARActive) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <Card className="max-w-lg w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Camera className="h-10 w-10 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">MindAR Viewer</h1>
            <p className="text-muted-foreground">
              Point your camera at the trigger image to see AR content
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                How to use:
              </h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Allow camera access when prompted</li>
                <li>Point camera at the marker image</li>
                <li>The AR content will appear automatically when detected!</li>
                <li>Move away to hide the content</li>
              </ol>
            </div>

            {markerUrl && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={markerUrl}
                  alt="AR Marker"
                  className="w-full h-48 object-contain bg-muted/30"
                />
                <div className="bg-muted/50 p-2 text-xs text-center text-muted-foreground">
                  Point your camera at this image
                </div>
              </div>
            )}
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleStart}
          >
            <Camera className="mr-2 h-5 w-5" />
            Start AR Experience
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-black">
      <div ref={containerRef} className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Tracking indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${
          isTracking 
            ? 'bg-green-500/20 border-green-500/30' 
            : 'bg-primary/20 border-primary/30'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isTracking ? 'bg-green-500' : 'bg-primary'
          }`} />
          <span className="text-sm text-white">
            {isTracking ? 'Target Locked!' : 'Scanning...'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          onClick={handleStop}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {showInfo && (
        <div className="absolute bottom-24 left-4 right-4 pointer-events-auto">
          <Card className="p-4 bg-black/70 backdrop-blur-md border-white/20 text-white">
            <p className="text-sm">
              <strong>Real AR Tracking:</strong> The content will appear automatically when you point at the marker!
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ARViewer;
