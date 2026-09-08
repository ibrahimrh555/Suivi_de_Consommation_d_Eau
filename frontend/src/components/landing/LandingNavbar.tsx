import { useState } from "react";
import { Menu, X } from "lucide-react";

type Props = {
  onLogin: () => void;
  onNavigate: (id: string) => void;
};

const links = [
  ["features", "Fonctionnalités"],
  ["results", "Résultats"],
  ["how-it-works", "Fonctionnement"],
  ["testimonials", "Témoignages"],
] as const;

export function LandingNavbar({ onLogin, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = (id: string) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <header className="relative z-50 bg-white">
      <div className="mx-auto flex h-[104px] max-w-[1248px] items-center justify-between px-5">
        <button onClick={() => navigate("home")} aria-label="Accueil AquaWatch">
          <img src="/figma-assets/aquawatch-logo.png" alt="AquaWatch" className="h-[58px] w-[175px] object-contain" />
        </button>
        <nav className="hidden items-center gap-8 text-[15px] font-medium text-[#212832] lg:flex">
          {links.map(([id, label]) => (
            <button key={id} onClick={() => navigate(id)} className="transition hover:text-[#0869f7]">
              {label}
            </button>
          ))}
          <button onClick={onLogin} className="transition hover:text-[#0869f7]">Connexion</button>
          <button onClick={onLogin} className="rounded-md border border-[#212832] px-5 py-2.5 transition hover:border-[#0869f7] hover:text-[#0869f7]">
            Commencer
          </button>
          <span className="text-sm">FR⌄</span>
        </nav>
        <button onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-lg border border-[#dfe3eb] lg:hidden" aria-label="Ouvrir le menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="absolute inset-x-0 top-full border-t bg-white px-5 py-4 shadow-xl lg:hidden">
          {links.map(([id, label]) => (
            <button key={id} onClick={() => navigate(id)} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-blue-50">
              {label}
            </button>
          ))}
          <button onClick={onLogin} className="mt-2 w-full rounded-lg bg-[#0869f7] px-4 py-3 text-sm font-semibold text-white">Connexion</button>
        </nav>
      )}
    </header>
  );
}
