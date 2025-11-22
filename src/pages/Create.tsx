import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, Upload, Image, Video, Box } from "lucide-react";
import { uploadFile, createARProject } from "@/lib/supabase-helpers";
import { generateQRCode, uploadQRCode } from "@/lib/qr-generator";
import { supabase } from "@/integrations/supabase/client";
import Model3DPreview from "@/components/Model3DPreview";

const Create = () => {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [triggerImage, setTriggerImage] = useState<File | null>(null);
  const [triggerImagePreview, setTriggerImagePreview] = useState<string>("");
  const [contentType, setContentType] = useState<"image" | "video" | "3d">("3d");
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [contentPreview, setContentPreview] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTriggerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTriggerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setTriggerImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleContentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContentFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setContentPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!projectName || !triggerImage) {
      toast({ title: "Missing Information", description: "Please provide a project name and trigger image.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Authentication Required", description: "Please log in to create AR projects.", variant: "destructive" });
        navigate("/auth");
        return;
      }

      const triggerPath = `${user.id}/markers/${Date.now()}-${triggerImage.name}`;
      const { data: triggerData, error: triggerError } = await uploadFile("ar-content", triggerPath, triggerImage);
      if (triggerError || !triggerData) throw new Error("Failed to upload trigger image");

      let contentUrl = null;
      if (contentFile) {
        const contentPath = `${user.id}/content/${Date.now()}-${contentFile.name}`;
        const { data: contentData, error: contentError } = await uploadFile("ar-content", contentPath, contentFile);
        if (contentError || !contentData) throw new Error("Failed to upload content file");
        contentUrl = contentData.publicUrl;
      }

      const project = await createARProject({
        name: projectName,
        marker_image_url: triggerData.publicUrl,
        content_type: contentType,
        content_url: contentUrl,
      });

      const viewerUrl = `${window.location.origin}/viewer/${project.id}`;
      const qrDataUrl = await generateQRCode(viewerUrl);
      const qrPublicUrl = await uploadQRCode(qrDataUrl, project.id);

      await supabase.from("ar_projects").update({ qr_code_url: qrPublicUrl }).eq("id", project.id);

      toast({ title: "AR Experience Created!", description: "Your AR project has been generated successfully." });
      navigate("/dashboard");
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to create AR project", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create AR Experience</h1>
        
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-2 rounded-full flex-1 ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {step === 1 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Project Name</h2>
            <Label htmlFor="name">Name your AR project</Label>
            <Input id="name" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="My AR Project" />
            <Button onClick={() => setStep(2)} disabled={!projectName} className="w-full">
              <ArrowRight className="mr-2 h-4 w-4" />Continue
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Upload Trigger Image</h2>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input type="file" id="trigger" className="hidden" accept="image/*" onChange={handleTriggerImageUpload} />
              <label htmlFor="trigger" className="cursor-pointer">
                {triggerImagePreview ? (
                  <img src={triggerImagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                ) : (
                  <><Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><p>Click to upload</p></>
                )}
              </label>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
              <Button onClick={() => setStep(3)} disabled={!triggerImage} className="flex-1">Continue</Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Choose Content Type</h2>
            <Tabs value={contentType} onValueChange={(v) => setContentType(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="image"><Image className="h-4 w-4 mr-2" />Image</TabsTrigger>
                <TabsTrigger value="video"><Video className="h-4 w-4 mr-2" />Video</TabsTrigger>
                <TabsTrigger value="3d"><Box className="h-4 w-4 mr-2" />3D</TabsTrigger>
              </TabsList>
              <TabsContent value="image"><input type="file" accept="image/*" onChange={handleContentUpload} className="w-full" /></TabsContent>
              <TabsContent value="video"><input type="file" accept="video/*" onChange={handleContentUpload} className="w-full" /></TabsContent>
              <TabsContent value="3d"><Model3DPreview /></TabsContent>
            </Tabs>
            <div className="flex gap-2">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1">Back</Button>
              <Button onClick={() => setStep(4)} className="flex-1">Continue</Button>
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Review & Generate</h2>
            <div className="bg-muted p-4 rounded space-y-2">
              <p><strong>Project:</strong> {projectName}</p>
              <p><strong>Type:</strong> {contentType}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setStep(3)} variant="outline" className="flex-1">Back</Button>
              <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
                <Check className="mr-2 h-4 w-4" />{isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Create;
