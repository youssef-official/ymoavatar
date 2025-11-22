import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Info, X } from "lucide-react";
import avatarDemo from "@/assets/avatar-demo.jpg";
import scanDemo from "@/assets/scan-demo.jpg";

const Viewer = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const startCamera = () => {
    setCameraActive(true);
    setShowInfo(false);
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Camera view */}
      <div className="relative h-screen">
        {!cameraActive ? (
          // Instructions screen
          <div className="h-full flex items-center justify-center px-4">
            <Card className="max-w-lg w-full p-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Camera className="h-10 w-10 text-primary" />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">AR Viewer</h1>
                <p className="text-muted-foreground">
                  Point your camera at a trigger image to see the AR experience
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
                    <li>Point your camera at the AR trigger image</li>
                    <li>Keep the image in view for tracking</li>
                    <li>Watch the AR content appear!</li>
                  </ol>
                </div>

                <div className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={scanDemo}
                    alt="Example trigger"
                    className="w-full h-40 object-cover"
                  />
                  <div className="bg-muted/50 p-2 text-xs text-center text-muted-foreground">
                    Example trigger image
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-secondary"
                onClick={startCamera}
              >
                <Camera className="mr-2 h-5 w-5" />
                Start Camera
              </Button>
            </Card>
          </div>
        ) : (
          // Camera active view
          <div className="relative h-full bg-black">
            {/* Mock camera view */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                <div className="w-64 h-64 border-4 border-primary/50 rounded-lg flex items-center justify-center backdrop-blur-sm bg-black/20">
                  <div className="text-sm">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Camera View</p>
                    <p className="text-xs text-white/70 mt-1">Point at trigger image</p>
                  </div>
                </div>
                
                {/* Scanning overlay */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm">Scanning for markers...</span>
                  </div>
                </div>
              </div>

              {/* Mock AR overlay when detected */}
              <div className="absolute bottom-32 right-8 opacity-30">
                <img
                  src={avatarDemo}
                  alt="AR overlay"
                  className="w-32 h-32 object-contain animate-pulse"
                />
              </div>
            </div>

            {/* Controls overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
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
                onClick={() => setCameraActive(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Info panel */}
            {showInfo && (
              <div className="absolute bottom-24 left-4 right-4">
                <Card className="p-4 bg-black/70 backdrop-blur-md border-white/20 text-white">
                  <p className="text-sm">
                    <strong>Tip:</strong> Keep the trigger image fully visible and well-lit for best tracking results.
                  </p>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Viewer;
