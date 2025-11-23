import { supabase } from "@/integrations/supabase/client";

export async function generateTargetFile(imageFile: File): Promise<Blob | null> {
  try {
    console.log("Loading MindAR Compiler...");
    // Dynamic import from esm.sh to handle module resolution and dependencies
    // @ts-ignore
    const { Compiler } = await import("https://esm.sh/mind-ar@1.2.5/dist/mindar-image.prod.js");

    if (!Compiler) {
      throw new Error("MindAR Compiler not found in module export");
    }

    const compiler = new Compiler();
    
    // Create Image object from File
    const loadImage = (file: File): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    };

    const img = await loadImage(imageFile);

    console.log("Starting MindAR compilation...");
    await compiler.compileImageTargets([img], (progress: number) => {
      console.log("Compilation progress:", progress);
    });

    const exportedBuffer = await compiler.exportData();
    return new Blob([exportedBuffer]);

  } catch (error) {
    console.error('Error generating target file:', error);
    return null;
  }
}

export async function uploadTargetFile(blob: Blob, projectId: string): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const targetPath = `${user.id}/targets/${projectId}.mind`;
    
    const { data, error } = await supabase.storage
      .from('ar-content')
      .upload(targetPath, blob, {
        contentType: 'application/octet-stream',
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('ar-content')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading target file:', error);
    return null;
  }
}
