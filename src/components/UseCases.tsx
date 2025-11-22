import { Briefcase, GraduationCap, Palette, Package, Mail, Users } from "lucide-react";

const UseCases = () => {
  const useCases = [
    {
      icon: Briefcase,
      title: "Business Cards",
      description: "Transform traditional business cards into interactive AR experiences with video introductions.",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Bring textbooks and learning materials to life with 3D models and explanations.",
    },
    {
      icon: Palette,
      title: "Art & Museums",
      description: "Add digital layers to artwork and exhibitions for enhanced storytelling.",
    },
    {
      icon: Package,
      title: "Product Packaging",
      description: "Enhance product packaging with AR demos, tutorials, and brand stories.",
    },
    {
      icon: Mail,
      title: "Marketing & Events",
      description: "Create memorable campaigns with AR-enabled posters, flyers, and invitations.",
    },
    {
      icon: Users,
      title: "Personal Projects",
      description: "Add AR magic to greeting cards, photo albums, and creative projects.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Endless Possibilities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From business to art, education to entertainment - AR transforms everything
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10"
            >
              <div className="mb-4">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
                  <useCase.icon className="h-7 w-7 text-secondary" />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
              <p className="text-muted-foreground">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
