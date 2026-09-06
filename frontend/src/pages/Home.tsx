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
  Leaf,
  LockKeyhole,
  LogIn,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  { icon: Activity, title: "Suivi en direct", text: "Consultez votre débit et votre volume d’eau en temps réel." },
  { icon: Bell, title: "Alertes intelligentes", text: "Détectez rapidement une fuite ou une consommation inhabituelle." },
  { icon: BarChart3, title: "Historique clair", text: "Comparez vos usages par jour, semaine et mois." },
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
    <div className="min-h-screen bg-[#f6f7fb] text-[#121826]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[88px] flex-col items-center bg-[#17181a] py-7 text-white lg:flex">
        <Link to="/" aria-label="AquaWatch">
          <img src="/logo - Copie.png" alt="AquaWatch" className="h-11 w-11 object-contain" />
        </Link>
        <div className="mt-12 flex flex-1 flex-col gap-4">
          <button onClick={() => scrollTo("accueil")} className="grid h-11 w-11 place-items-center rounded-lg bg-[#0869f7]" aria-label="Accueil">
            <Droplets className="h-5 w-5" />
          </button>
          <button onClick={() => scrollTo("fonctionnalites")} className="grid h-11 w-11 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white" aria-label="Fonctionnalités">
            <BarChart3 className="h-5 w-5" />
          </button>
          <button onClick={() => scrollTo("connexion")} className="grid h-11 w-11 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white" aria-label="Connexion">
            <UserRound className="h-5 w-5" />
          </button>
        </div>
        <ShieldCheck className="h-5 w-5 text-zinc-500" />
      </aside>

      <div className="lg:pl-[88px]">
        <header className="sticky top-0 z-40 border-b border-[#e9ebf1] bg-[#f6f7fb]/95 backdrop-blur">
          <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-10">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo - Copie.png" alt="" className="h-9 w-9 object-contain lg:hidden" />
              <div>
                <p className="text-lg font-bold tracking-tight">AquaWatch</p>
                <p className="text-xs text-[#98a0b3]">Smart Water Monitoring</p>
              </div>
            </Link>
            <nav className="hidden items-center gap-8 text-sm font-medium text-[#60677a] md:flex">
              <button onClick={() => scrollTo("accueil")} className="text-[#0869f7]">Accueil</button>
              <button onClick={() => scrollTo("fonctionnalites")} className="transition hover:text-[#121826]">Fonctionnalités</button>
              <button onClick={() => scrollTo("connexion")} className="transition hover:text-[#121826]">Connexion</button>
            </nav>
            <button onClick={() => scrollTo("connexion")} className="hidden h-11 items-center gap-2 rounded-lg bg-[#0869f7] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#075bd5] md:flex">
              <LogIn className="h-4 w-4" /> Se connecter
            </button>
            <button onClick={() => setIsMenuOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-lg bg-white shadow-sm md:hidden" aria-label="Menu">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {isMenuOpen && (
            <nav className="border-t border-[#e9ebf1] bg-white px-5 py-4 md:hidden">
              {["accueil", "fonctionnalites", "connexion"].map((item) => (
                <button key={item} onClick={() => scrollTo(item)} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-medium capitalize hover:bg-[#f6f7fb]">
                  {item === "fonctionnalites" ? "Fonctionnalités" : item}
                </button>
              ))}
            </nav>
          )}
        </header>

        <main>
          <section id="accueil" className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-14">
            <div className="flex flex-col justify-center rounded-2xl bg-white p-7 shadow-sm md:p-11">
              <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#eaf2ff] px-4 py-2 text-xs font-semibold text-[#0869f7]">
                <span className="h-2 w-2 rounded-full bg-[#0869f7]" /> Votre eau, sous contrôle
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] md:text-6xl">
                Comprenez chaque litre. <span className="text-[#0869f7]">Économisez simplement.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#70788c] md:text-lg">
                AquaWatch transforme les mesures de votre capteur ESP32 en informations simples, alertes utiles et objectifs faciles à suivre.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => scrollTo("connexion")} className="flex h-12 items-center gap-2 rounded-lg bg-[#0869f7] px-6 text-sm font-semibold text-white transition hover:bg-[#075bd5]">
                  Accéder à mon espace <LogIn className="h-4 w-4" />
                </button>
                <button onClick={() => scrollTo("fonctionnalites")} className="h-12 rounded-lg border border-[#e2e5ec] bg-white px-6 text-sm font-semibold text-[#424a5d] transition hover:bg-[#f6f7fb]">
                  Découvrir AquaWatch
                </button>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#edf0f5] pt-8">
                <div><p className="text-2xl font-bold">24/7</p><p className="mt-1 text-xs text-[#98a0b3]">Surveillance</p></div>
                <div><p className="text-2xl font-bold">5 min</p><p className="mt-1 text-xs text-[#98a0b3]">Mise à jour</p></div>
                <div><p className="text-2xl font-bold text-[#11ad72]">−15%</p><p className="mt-1 text-xs text-[#98a0b3]">Objectif moyen</p></div>
              </div>
            </div>

            <div className="relative min-h-[440px] overflow-hidden rounded-2xl bg-[#17181a] p-7 text-white shadow-sm md:p-9">
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div><p className="text-sm text-zinc-400">Consommation aujourd’hui</p><p className="mt-2 text-4xl font-bold">126,4 <span className="text-lg font-medium text-zinc-400">L</span></p></div>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#0869f7]"><Gauge className="h-6 w-6" /></div>
                </div>
                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between text-sm"><span className="text-zinc-400">Objectif journalier</span><span className="font-semibold">126 / 180 L</span></div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[70%] rounded-full bg-[#0869f7]" /></div>
                  <p className="mt-3 text-xs text-zinc-500">53,6 L disponibles aujourd’hui</p>
                </div>
              </div>
              <img src="/1.png" alt="Nature et gestion responsable de l’eau" className="absolute bottom-[-64px] right-[-24px] w-[330px] object-contain opacity-90" />
              <div className="absolute bottom-7 left-7 z-10 flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#121826] shadow-lg md:left-9">
                <CheckCircle2 className="h-5 w-5 text-[#11ad72]" /> Aucun incident détecté
              </div>
            </div>
          </section>

          <section id="fonctionnalites" className="mx-auto max-w-[1440px] px-5 pb-10 md:px-8 lg:px-10">
            <div className="mb-6 flex items-end justify-between">
              <div><p className="text-sm font-semibold text-[#0869f7]">Fonctionnalités</p><h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">L’essentiel sur un seul écran</h2></div>
              <p className="hidden max-w-md text-right text-sm leading-6 text-[#7e8699] md:block">Des données lisibles pour agir rapidement et réduire le gaspillage.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {features.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#eaf2ff] text-[#0869f7]"><Icon className="h-6 w-6" /></div>
                  <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#7e8699]">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="connexion" className="mx-auto grid max-w-[1440px] gap-5 px-5 pb-12 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
            <div className="rounded-2xl bg-[#0869f7] p-7 text-white shadow-sm md:p-10">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15"><Leaf className="h-6 w-6" /></div>
              <h2 className="mt-8 text-3xl font-bold leading-tight">Votre tableau de bord personnel vous attend.</h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-blue-100">Connectez-vous avec votre numéro de police pour consulter vos mesures, alertes et objectifs.</p>
              <div className="mt-9 space-y-4 text-sm">
                <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5" /> Données personnelles centralisées</div>
                <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5" /> Accès sécurisé</div>
                <div className="flex items-center gap-3"><Droplets className="h-5 w-5" /> Mesures faciles à comprendre</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm md:p-10">
              <div className="mb-8">
                <p className="text-sm font-semibold text-[#0869f7]">Espace abonné</p>
                <h2 className="mt-2 text-2xl font-bold">Connexion</h2>
                <p className="mt-2 text-sm text-[#8a92a5]">Saisissez vos identifiants pour continuer.</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#424a5d]">Numéro de police</span>
                  <span className="flex h-12 items-center gap-3 rounded-lg border border-[#e2e5ec] px-4 transition focus-within:border-[#0869f7] focus-within:ring-2 focus-within:ring-blue-100">
                    <UserRound className="h-5 w-5 text-[#a1a8b8]" />
                    <input type="text" inputMode="numeric" value={numPolice} onChange={(event) => setNumPolice(event.target.value)} required placeholder="Ex. 235" className="w-full bg-transparent text-sm outline-none placeholder:text-[#b4bac7]" />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#424a5d]">Mot de passe</span>
                  <span className="flex h-12 items-center gap-3 rounded-lg border border-[#e2e5ec] px-4 transition focus-within:border-[#0869f7] focus-within:ring-2 focus-within:ring-blue-100">
                    <LockKeyhole className="h-5 w-5 text-[#a1a8b8]" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Votre mot de passe" className="w-full bg-transparent text-sm outline-none placeholder:text-[#b4bac7]" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="text-[#8e96a8] hover:text-[#424a5d]">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </span>
                </label>
                <button type="submit" disabled={isLoading} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0869f7] text-sm font-semibold text-white transition hover:bg-[#075bd5] disabled:cursor-not-allowed disabled:opacity-60">
                  {isLoading ? "Connexion en cours…" : <><LogIn className="h-4 w-4" /> Se connecter</>}
                </button>
              </form>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#e4e7ee] bg-white">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-7 text-sm text-[#7e8699] md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
            <div className="flex items-center gap-2 font-semibold text-[#30384a]"><Droplets className="h-4 w-4 text-[#0869f7]" /> AquaWatch</div>
            <p>Projet de suivi intelligent de consommation d’eau.</p>
            <p>© {new Date().getFullYear()} Rahmani Ibrahim</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
