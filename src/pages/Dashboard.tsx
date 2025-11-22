import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Copy, Edit, Trash2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import scanDemo from "@/assets/scan-demo.jpg";

interface Project {
  id: string;
  name: string;
  triggerImage: string;
  contentType: "video" | "avatar";
  createdAt: string;
  viewerUrl: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Demo data - will be replaced with real data
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Demo AR Experience",
      triggerImage: scanDemo,
      contentType: "avatar",
      createdAt: "2024-01-15",
      viewerUrl: "/viewer?project=1",
    },
  ]);

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast({
      title: "Link Copied!",
      description: "AR viewer link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen pb-24 pt-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My AR Projects</h1>
          <p className="text-muted-foreground">Manage your AR experiences</p>
        </div>

        {/* Create button */}
        <Button
          size="lg"
          className="mb-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          onClick={() => navigate("/create")}
        >
          <Plus className="mr-2 h-5 w-5" />
          New AR Experience
        </Button>

        {/* Projects grid */}
        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first AR experience to get started
              </p>
              <Button onClick={() => navigate("/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                {/* Trigger image preview */}
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <img
                    src={project.triggerImage}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 rounded-full bg-background/90 text-xs font-medium">
                      {project.contentType === "video" ? "Video" : "Avatar"}
                    </span>
                  </div>
                </div>

                {/* Project info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyLink(project.viewerUrl)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Link
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(project.viewerUrl)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {}}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {}}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
