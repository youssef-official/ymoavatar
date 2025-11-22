import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Video, Box, CheckCircle2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import avatarDemo from "@/assets/avatar-demo.jpg";

const Create = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [triggerImage, setTriggerImage] = useState<File | null>(null);
  const [contentType, setContentType] = useState<"video" | "avatar">("avatar");

  const handleTriggerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTriggerImage(file);
      toast({
        title: "Image Uploaded",
        description: "Trigger image successfully uploaded",
      });
    }
  };

  const handleGenerate = () => {
    if (!projectName || !triggerImage) {
      toast({
        title: "Missing Information",
        description: "Please complete all steps",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "AR Experience Created!",
      description: "Your project has been generated successfully",
    });
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-24 pt-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create AR Experience</h1>
          <p className="text-muted-foreground">Build your immersive AR avatar in a few simple steps</p>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step ? "w-12 bg-primary" : "w-8 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Project Name */}
        {step === 1 && (
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </span>
              Project Details
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="My AR Avatar Experience"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button
                className="w-full"
                disabled={!projectName}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Upload Trigger Image */}
        {step === 2 && (
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </span>
              Upload Trigger Image
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This image will be used as the AR marker. Choose a clear, high-contrast image for best results.
              </p>
              
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="triggerImage"
                  accept="image/*"
                  onChange={handleTriggerImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="triggerImage"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {triggerImage ? (
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    ) : (
                      <Upload className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {triggerImage ? triggerImage.name : "Click to upload image"}
                    </p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={!triggerImage}
                  onClick={() => setStep(3)}
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Choose Content */}
        {step === 3 && (
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </span>
              Choose AR Content
            </h2>
            
            <Tabs value={contentType} onValueChange={(v) => setContentType(v as "video" | "avatar")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="avatar" className="gap-2">
                  <Box className="h-4 w-4" />
                  3D Avatar
                </TabsTrigger>
                <TabsTrigger value="video" className="gap-2">
                  <Video className="h-4 w-4" />
                  Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="avatar" className="space-y-4 mt-6">
                <p className="text-muted-foreground">
                  Select a 3D avatar from our library or upload your own
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="border-2 border-primary rounded-lg p-4 cursor-pointer hover:bg-primary/5 transition-colors">
                    <img src={avatarDemo} alt="Avatar" className="w-full aspect-square object-cover rounded mb-2" />
                    <p className="text-sm font-medium text-center">Holographic Avatar</p>
                  </div>
                  <div className="border-2 border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="w-full aspect-square bg-muted rounded flex items-center justify-center mb-2">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-center text-muted-foreground">More Soon</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4 mt-6">
                <p className="text-muted-foreground">
                  Upload a video file (MP4, WebM) to overlay on your trigger image
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium">Click to upload video</p>
                  <p className="text-sm text-muted-foreground">MP4, WebM up to 50MB</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(4)}>
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Generate */}
        {step === 4 && (
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                4
              </span>
              Review & Generate
            </h2>
            
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Project Name</p>
                  <p className="font-medium">{projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Trigger Image</p>
                  <p className="font-medium">{triggerImage?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Content Type</p>
                  <p className="font-medium capitalize">{contentType}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                  onClick={handleGenerate}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Generate AR Experience
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Create;
