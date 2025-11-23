import { supabase } from "@/integrations/supabase/client";

export async function generateTargetFile(imageFile: File): Promise<Blob | null> {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(
      `https://eovdsfouwvgtvlhxmqya.supabase.co/functions/v1/generate-target`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate target file');
    }

    return await response.blob();
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
