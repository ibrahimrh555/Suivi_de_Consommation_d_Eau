import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bell,
  CheckCircle2,
  Droplets,
  Eye,
  EyeOff,
  Gauge,
  History,
  Leaf,
  LockKeyhole,
  LogIn,
  Menu,
  Radio,
  ShieldCheck,
  Target,
  UserRound,
  Waves,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const services = [
  { icon: Radio, title: "Capteur connecté", text: "L’ESP32 collecte automatiquement les données du débitmètre." },
  { icon: Activity, title: "Mesure en direct", text: "Le débit et le volume consommé sont actualisés régulièrement." },
  { icon: Bell, title: "Alertes rapides", text: "Une anomalie ou une fuite déclenche une alerte claire et immédiate." },
  { icon: Target, title: "Objectifs adaptés", text: "Définissez une limite quotidienne, hebdomadaire ou mensuelle." },
];

const insights = [
  { icon: Droplets, value: "128 L", label: "Consommation du jour", note: "−12 % par rapport à hier" },
  { icon: Gauge, value: "2,4 L/min", label: "Débit actuel", note: "Fonctionnement normal" },
  { icon: ShieldCheck, value: "Sécurisé", label: "État de l’installation", note: "Aucune fuite détectée" },
];

const Home = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [numPolice, setNumPolice] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#121826]">
      <header className="relative z-50 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo - Copie.png" alt="AquaWatch" className="h-11 w-11 object-contain" />
            <div>
              <p className="text-xl font-bold tracking-tight">AquaWatch</p>
              <p className="text-xs text-[#98a0b3]">Smart Water Monitoring</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#525a6d] md:flex">
            <button onClick={() => scrollTo("services")} className="transition hover:text-[#0869f7]">Fonctionnalités</button>
            <button onClick={() => scrollTo("solution")} className="transition hover:text-[#0869f7]">Solution</button>
            <button onClick={() => scrollTo("fonctionnement")} className="transition hover:text-[#0869f7]">Fonctionnement</button>
            <button onClick={() => scrollTo("connexion")} className="transition hover:text-[#0869f7]">Connexion</button>
          </nav>
          <button onClick={() => scrollTo("connexion")} className="hidden h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-[#1f2937] px-5 text-sm font-semibold transition hover:border-[#0869f7] hover:text-[#0869f7] md:flex">
            <LogIn className="h-4 w-4" /> Espace abonné
          </button>
          <button onClick={() => setIsMenuOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-lg border border-[#e3e6ec] md:hidden" aria-label="Menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {isMenuOpen && (
          <nav className="border-t border-[#edf0f5] bg-white px-5 py-4 md:hidden">
            {[
              ["services", "Fonctionnalités"],
              ["solution", "Solution"],
              ["fonctionnement", "Fonctionnement"],
              ["connexion", "Connexion"],
            ].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-[#f6f7fb]">
                {label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-5 pb-20 pt-10 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:pt-4">
          <div className="relative z-10">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-[#0869f7]">Maîtrisez votre consommation d’eau</p>
            <h1 className="max-w-2xl text-5xl font-bold leading-[1.04] tracking-[-0.045em] md:text-7xl">
              Surveillez, comprenez et <span className="text-[#0869f7]">économisez l’eau.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#6f7789]">
              AquaWatch relie votre compteur à un tableau de bord intelligent pour suivre chaque litre, détecter les fuites et atteindre vos objectifs.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <button onClick={() => scrollTo("connexion")} className="h-13 rounded-xl bg-[#0869f7] px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(8,105,247,0.18)] transition hover:bg-[#075bd5]">
                Commencer maintenant
              </button>
              <button onClick={() => scrollTo("fonctionnement")} className="flex items-center gap-3 text-sm font-semibold text-[#596174]">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#17181a] text-white shadow-lg"><Activity className="h-5 w-5" /></span>
                Voir le fonctionnement
              </button>
            </div>
          </div>

          <div className="relative min-h-[570px]">
            <div className="absolute inset-x-4 bottom-8 top-6 rounded-[48px_160px_48px_48px] bg-[#eaf2ff]" />
            <div className="absolute right-3 top-8 rounded-2xl bg-white p-5 shadow-xl md:right-0">
              <p className="text-xs text-[#9299aa]">Consommation aujourd’hui</p>
              <p className="mt-1 text-2xl font-bold">128 L</p>
              <p className="mt-2 text-xs font-semibold text-[#11ad72]">−12 % depuis hier</p>
            </div>
            <img src="/1.png" alt="Illustration AquaWatch et préservation de l’eau" className="absolute bottom-0 left-1/2 w-[540px] max-w-[95%] -translate-x-1/2 object-contain" />
            <div className="absolute bottom-12 left-2 rounded-2xl bg-[#17181a] p-5 text-white shadow-xl md:left-0">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0869f7]"><ShieldCheck className="h-5 w-5" /></span><div><p className="text-sm font-semibold">Installation sécurisée</p><p className="mt-1 text-xs text-zinc-400">Aucune fuite détectée</p></div></div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-5 py-24 text-center md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7f8798]">Fonctionnalités</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] md:text-5xl">Tout ce qu’il faut pour mieux consommer</h2>
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className={`relative rounded-[28px] bg-white px-6 py-10 transition hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(30,45,75,0.10)] ${index === 1 ? "shadow-[0_30px_70px_rgba(30,45,75,0.10)]" : ""}`}>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eaf2ff] text-[#0869f7]"><Icon className="h-7 w-7" /></div>
                <h3 className="mt-7 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#737b8d]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="solution" className="bg-[#f7f8fb] py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7f8798]">Vue d’ensemble</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] md:text-5xl">Vos données les plus importantes</h2>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {insights.map(({ icon: Icon, value, label, note }) => (
                <article key={label} className="overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_rgba(30,45,75,0.08)]">
                  <div className="flex h-44 items-center justify-center bg-[#17181a]">
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-[#0869f7] text-white"><Icon className="h-9 w-9" /></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3"><div><p className="text-sm text-[#868e9f]">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div><CheckCircle2 className="h-5 w-5 text-[#11ad72]" /></div>
                    <p className="mt-5 border-t border-[#edf0f4] pt-4 text-xs font-medium text-[#7b8394]">{note}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="fonctionnement" className="mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7f8798]">Simple et rapide</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-[-0.03em] md:text-5xl">Suivez votre eau en trois étapes</h2>
            <div className="mt-10 space-y-8">
              {[
                [Radio, "Connectez le capteur", "Le débitmètre YF-S201 et l’ESP32 transmettent les mesures."],
                [BarChart3, "Consultez le dashboard", "Vos données sont organisées en graphiques et indicateurs clairs."],
                [Bell, "Agissez au bon moment", "Recevez une alerte et ajustez rapidement votre consommation."],
              ].map(([Icon, title, text], index) => {
                const StepIcon = Icon as typeof Radio;
                return (
                  <div key={title as string} className="flex gap-5">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0869f7] text-white"><StepIcon className="h-5 w-5" /></div>
                    <div><p className="text-xs font-bold text-[#0869f7]">ÉTAPE {index + 1}</p><h3 className="mt-1 font-semibold">{title as string}</h3><p className="mt-1 text-sm leading-6 text-[#747c8e]">{text as string}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(30,45,75,0.14)]">
            <div className="flex items-center justify-between"><div><p className="text-xs text-[#8e96a7]">AquaWatch</p><h3 className="mt-1 text-lg font-semibold">Consommation en direct</h3></div><span className="grid h-11 w-11 place-items-center rounded-full bg-[#eaf2ff] text-[#0869f7]"><Waves className="h-5 w-5" /></span></div>
            <div className="mt-7 rounded-2xl bg-[#f7f8fb] p-5"><div className="flex items-center justify-between"><span className="text-sm text-[#7d8597]">Objectif quotidien</span><strong>80 %</strong></div><div className="mt-4 h-2 rounded-full bg-[#dce5f3]"><div className="h-2 w-4/5 rounded-full bg-[#0869f7]" /></div><p className="mt-3 text-xs text-[#9299aa]">128 L consommés sur 160 L</p></div>
            <div className="mt-5 grid grid-cols-2 gap-4"><div className="rounded-2xl border border-[#edf0f4] p-4"><History className="h-5 w-5 text-[#0869f7]" /><p className="mt-5 text-xl font-bold">−12 %</p><p className="mt-1 text-xs text-[#8c94a5]">Depuis hier</p></div><div className="rounded-2xl border border-[#edf0f4] p-4"><Leaf className="h-5 w-5 text-[#11ad72]" /><p className="mt-5 text-xl font-bold">32 L</p><p className="mt-1 text-xs text-[#8c94a5]">Économisés</p></div></div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7f8798]">Confiance au quotidien</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] md:text-5xl">Une information claire pour agir.</h2></div>
          <blockquote className="rounded-3xl bg-white p-8 shadow-[0_25px_70px_rgba(30,45,75,0.10)] md:p-10">
            <p className="text-lg leading-8 text-[#596174]">“Avec AquaWatch, je vois immédiatement les périodes où je consomme le plus. Les alertes rendent la surveillance simple et rassurante.”</p>
            <div className="mt-7 flex items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-full bg-[#17181a] text-white"><UserRound className="h-5 w-5" /></div><div><p className="font-semibold">Utilisateur AquaWatch</p><p className="text-sm text-[#9299aa]">Suivi résidentiel</p></div></div>
          </blockquote>
        </section>

        <section id="connexion" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="grid overflow-hidden rounded-[32px] bg-[#eef4ff] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 md:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0869f7]">Espace abonné</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] md:text-4xl">Accédez à votre consommation en temps réel.</h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-[#6f7789]">Utilisez votre numéro de police et votre mot de passe pour ouvrir votre tableau de bord personnel.</p>
              <div className="mt-9 flex items-center gap-3 text-sm font-medium"><ShieldCheck className="h-5 w-5 text-[#11ad72]" /> Connexion sécurisée</div>
            </div>
            <form onSubmit={handleLogin} className="m-4 rounded-3xl bg-white p-7 shadow-sm md:m-6 md:p-9">
              <label className="block"><span className="mb-2 block text-sm font-medium">Numéro de police</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[#e1e5ec] px-4 focus-within:border-[#0869f7] focus-within:ring-2 focus-within:ring-blue-100"><UserRound className="h-5 w-5 text-[#a0a7b6]" /><input type="text" inputMode="numeric" value={numPolice} onChange={(event) => setNumPolice(event.target.value)} placeholder="Ex. 235" required className="w-full bg-transparent text-sm outline-none" /></span></label>
              <label className="mt-5 block"><span className="mb-2 block text-sm font-medium">Mot de passe</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[#e1e5ec] px-4 focus-within:border-[#0869f7] focus-within:ring-2 focus-within:ring-blue-100"><LockKeyhole className="h-5 w-5 text-[#a0a7b6]" /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Votre mot de passe" required className="w-full bg-transparent text-sm outline-none" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>{showPassword ? <EyeOff className="h-5 w-5 text-[#8a92a3]" /> : <Eye className="h-5 w-5 text-[#8a92a3]" />}</button></span></label>
              <button type="submit" disabled={isLoading} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0869f7] text-sm font-semibold text-white transition hover:bg-[#075bd5] disabled:opacity-60">{isLoading ? "Connexion en cours…" : <><LogIn className="h-4 w-4" /> Se connecter</>}</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="mt-10 border-t border-[#edf0f4]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 text-sm md:grid-cols-3 md:px-8">
          <div><div className="flex items-center gap-3"><img src="/logo - Copie.png" alt="" className="h-10 w-10 object-contain" /><span className="text-xl font-bold">AquaWatch</span></div><p className="mt-4 max-w-sm leading-6 text-[#7e8699]">Suivi intelligent de la consommation d’eau domestique.</p></div>
          <div><p className="font-semibold">Navigation</p><div className="mt-4 space-y-2 text-[#7e8699]"><button onClick={() => scrollTo("services")} className="block">Fonctionnalités</button><button onClick={() => scrollTo("fonctionnement")} className="block">Fonctionnement</button><button onClick={() => scrollTo("connexion")} className="block">Connexion</button></div></div>
          <div><p className="font-semibold">Projet</p><p className="mt-4 leading-6 text-[#7e8699]">ESP32 · Django REST · React · MySQL</p><p className="mt-4 text-xs text-[#a0a7b5]">© {new Date().getFullYear()} Rahmani Ibrahim</p></div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
