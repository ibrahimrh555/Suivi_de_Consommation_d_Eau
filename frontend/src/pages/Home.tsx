import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  AquaWatchFooter,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  ImpactBand,
  LandingNavbar,
  LoginModal,
  ResultsSection,
  TestimonialsSection,
  WaterCtaSection,
} from "@/components/landing";

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = async (numPolice: string, password: string) => {
    try {
      const { data } = await api.post("/login/", {
        numPolice,
        mot_de_passe: password,
      });
      const abonne = data.abonne;
      login({
        id: abonne.id,
        numPolice: abonne.numPolice,
        email: abonne.email,
        nom: abonne.nom,
        prenom: abonne.prenom,
        telephone: abonne.telephone,
        adresse: abonne.adresse,
      });
      toast.success("Connexion réussie");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.mot_de_passe ||
          error.response?.data?.numPolice ||
          "Identifiants incorrects",
      );
      throw error;
    }
  };

  return (
    <div className="min-w-0 w-full flex-1 min-h-screen overflow-x-hidden bg-white font-sans text-[#14183e]">
      <LandingNavbar onLogin={() => setIsLoginOpen(true)} onNavigate={scrollTo} />
      <main>
        <HeroSection onLogin={() => setIsLoginOpen(true)} onNavigate={scrollTo} />
        <FeaturesSection />
        <ResultsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <ImpactBand />
        <WaterCtaSection onLogin={() => setIsLoginOpen(true)} />
      </main>
      <AquaWatchFooter onNavigate={scrollTo} />
      <LoginModal
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSubmit={handleLogin}
      />
    </div>
  );
};

export default Home;
