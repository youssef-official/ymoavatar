import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ExternalLink, Trash2, Copy, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserARProjects, deleteARProject } from "@/lib/supabase-helpers";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const Dashboard = () => {
  const [projects, setProjects] = useState<Tables<"ar_projects">[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadProjects();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) navigate("/auth");
  };

  const loadProjects = async () => {
    try {
      const data = await getUserARProjects();
      setProjects(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load projects", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/viewer/${id}`);
    toast({ title: "Link Copied!", description: "AR viewer link copied to clipboard." });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteARProject(id);
      await loadProjects();
      toast({ title: "Deleted", description: "Project deleted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My AR Projects</h1>
          <Button onClick={() => navigate("/create")}><Plus className="mr-2 h-4 w-4" />New Project</Button>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="mb-4">No projects yet. Create your first AR experience!</p>
            <Button onClick={() => navigate("/create")}>Create Project</Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <img src={p.marker_image_url} alt={p.name} className="w-full h-48 object-cover" />
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyLink(p.id)}><Copy className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" asChild><Link to={`/viewer/${p.id}`}><ExternalLink className="h-4 w-4" /></Link></Button>
                    {p.qr_code_url && <Button size="sm" variant="outline" asChild><a href={p.qr_code_url} download><QrCode className="h-4 w-4" /></a></Button>}
                    <Button size="sm" variant="outline" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
