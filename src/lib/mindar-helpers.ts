import { supabase } from "@/integrations/supabase/client";

// Helper to load script
const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    if (existingScript) {
      // If it's already loaded or loading, we can check its state if we tracked it,
      // but standard script tags don't expose 'loaded' state easily after the event.
      // However, for this simple case, we assume if it's there, we wait a tick or resolve.
      // A better way is to attach a new listener if it hasn't loaded, but that's complex.
      // We will assume that if the tag exists, the global MINDAR object will be available shortly or is already there.
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export async function generateTargetFile(imageFile: File): Promise<Blob | null> {
  try {
    // Load MindAR script
    await loadScript("https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.js");

    // @ts-ignore
    const MindAR = window.MINDAR || {};
    if (!MindAR.IMAGE || !MindAR.IMAGE.Compiler) {
      throw new Error("MindAR Compiler not found");
    }

    const compiler = new MindAR.IMAGE.Compiler();
    
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
