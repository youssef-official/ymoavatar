import { Smartphone, Globe, Zap, Share2, Lock, Sparkles } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: "No App Required",
      description: "Experience AR directly in your browser on any device. No downloads, no hassle.",
    },
    {
      icon: Globe,
      title: "WebAR Technology",
      description: "Powered by cutting-edge WebAR for seamless real-time image tracking.",
    },
    {
      icon: Zap,
      title: "Instant Creation",
      description: "Create and share AR experiences in minutes, not hours.",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Generate shareable links and QR codes for instant AR access.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your content is safely stored and only accessible through your links.",
    },
    {
      icon: Sparkles,
      title: "Rich Content",
      description: "Support for videos, 3D avatars, and animated characters.",
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create stunning AR experiences
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
              
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary p-0.5 mb-4">
                  <div className="w-full h-full bg-card rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
