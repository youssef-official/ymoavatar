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
      // Dynamic import to handle dependencies properly
      // We import THREE explicitly to ensure it's available
      // @ts-ignore
      const THREE = await import("https://esm.sh/three@0.160.0");
      // @ts-ignore
      window.THREE = THREE; // MindAR expects global THREE sometimes, or we use it for VideoTexture

      // @ts-ignore
      const { MindARThree } = await import("https://esm.sh/mind-ar@1.2.5/dist/mindar-image-three.prod.js?deps=three@0.160.0");

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

      const mindarThree = new MindARThree({
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

        const texture = new THREE.VideoTexture(video);
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const plane = new THREE.Mesh(geometry, material);

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
              This AR experience is still being processed. It might take a moment.
              Please refresh the page or try again in a few minutes.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">Refresh Page</Button>
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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Ready to Scan</h1>
            <p className="text-muted-foreground">
              Point your camera at the trigger image to see the AR video.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Instructions:
              </h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Click the "Start Camera" button below.</li>
                <li>Allow camera access if prompted.</li>
                <li>Point your camera at the image shown below.</li>
                <li>The video will appear automatically!</li>
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
                  Scan this image
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
            Start Camera
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
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-colors duration-300 ${
          isTracking 
            ? 'bg-green-500/80 border-green-500/50 text-white'
            : 'bg-black/40 border-white/20 text-white/80'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isTracking ? 'bg-white animate-pulse' : 'bg-red-500'
          }`} />
          <span className="text-sm font-medium">
            {isTracking ? 'Target Found!' : 'Looking for target...'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 pointer-events-auto z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full h-10 w-10"
          onClick={handleStop}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {showInfo && !isTracking && (
        <div className="absolute bottom-24 left-4 right-4 pointer-events-none z-10">
          <Card className="p-4 bg-black/60 backdrop-blur-md border-white/10 text-white text-center animate-in fade-in slide-in-from-bottom-4">
            <p className="text-sm">
              Point your camera at the marker image to start playing the video.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ARViewer;
