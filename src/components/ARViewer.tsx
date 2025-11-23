import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Camera, X, Info } from "lucide-react";

interface ARViewerProps {
  markerUrl?: string;
  contentType?: string;
  contentUrl?: string;
  projectId?: string;
}

const ARViewer = ({ markerUrl, contentType, contentUrl, projectId }: ARViewerProps) => {
  const [isARActive, setIsARActive] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isARActive) {
      startAR();
    }
    return () => {
      stopAR();
    };
  }, [isARActive]);

  const startAR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Increment view count
      if (projectId) {
        const { incrementViewCount } = await import("@/lib/supabase-helpers");
        incrementViewCount(projectId);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopAR = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleStart = () => {
    setIsARActive(true);
    setShowInfo(false);
    setIsContentVisible(false);
  };

  const handleStop = () => {
    setIsARActive(false);
    setIsContentVisible(false);
    stopAR();
  };

  if (!isARActive) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <Card className="max-w-lg w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Camera className="h-10 w-10 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">WebAR Viewer</h1>
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
                <li>Keep the marker in view for tracking</li>
                <li>Watch the AR content appear!</li>
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

      {/* AR Overlay Content */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex items-center justify-center">
          <div className="text-white text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm">Scanning for markers...</span>
            </div>
          </div>
        </div>

        {contentType === "3d" && contentUrl && isContentVisible && (
          <div className="absolute bottom-32 right-8 opacity-70 animate-pulse">
            <div className="w-32 h-32 bg-primary/20 backdrop-blur-sm rounded-lg border border-primary/30 flex items-center justify-center">
              <span className="text-xs text-white">3D Model</span>
            </div>
          </div>
        )}

        {contentType === "video" && contentUrl && isContentVisible && (
          <div className="absolute bottom-32 left-8 opacity-70">
            <div className="w-48 h-32 bg-black/50 backdrop-blur-sm rounded-lg border border-primary/30 overflow-hidden">
              <video
                src={contentUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          onClick={handleStop}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content visibility control */}
      {contentType === "video" && contentUrl && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-auto">
          <Button
            variant="secondary"
            className="px-6"
            onClick={() => setIsContentVisible((prev) => !prev)}
          >
            {isContentVisible ? "Hide AR content" : "Show AR content"}
          </Button>
        </div>
      )}

      {showInfo && (
        <div className="absolute bottom-24 left-4 right-4 pointer-events-auto">
          <Card className="p-4 bg-black/70 backdrop-blur-md border-white/20 text-white">
            <p className="text-sm">
              <strong>Tip:</strong> Keep the marker image fully visible and well-lit for best tracking.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ARViewer;
