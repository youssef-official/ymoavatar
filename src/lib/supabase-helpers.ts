import { supabase } from "@/integrations/supabase/client";

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ data: { publicUrl: string } | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { data: { publicUrl }, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function createARProject(project: {
  name: string;
  marker_image_url: string;
  content_type: string;
  content_url: string | null;
  qr_code_url?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("ar_projects")
    .insert({
      ...project,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserARProjects() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("ar_projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteARProject(id: string) {
  const { error } = await supabase
    .from("ar_projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function incrementViewCount(id: string) {
  const { data } = await supabase
    .from("ar_projects")
    .select("view_count")
    .eq("id", id)
    .single();

  await supabase
    .from("ar_projects")
    .update({ view_count: (data?.view_count || 0) + 1 })
    .eq("id", id);
}
