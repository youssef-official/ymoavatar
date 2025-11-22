import BottomNav from "@/components/BottomNav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";

const Index = () => {
  return (
    <div className="min-h-screen pb-20">
      <Hero />
      <HowItWorks />
      <Features />
      <UseCases />
      <BottomNav />
    </div>
  );
};

export default Index;
