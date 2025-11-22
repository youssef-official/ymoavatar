import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import ARViewer from "@/components/ARViewer";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const Viewer = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Tables<"ar_projects"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from("ar_projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading AR experience...</p>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="relative h-screen">
        <ARViewer
          markerUrl={project?.marker_image_url}
          contentType={project?.content_type}
          contentUrl={project?.content_url || undefined}
          projectId={project?.id}
        />
      </div>
      <BottomNav />
    </div>
  );
};

export default Viewer;
