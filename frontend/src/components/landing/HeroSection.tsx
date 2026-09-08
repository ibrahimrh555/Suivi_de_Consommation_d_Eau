import { Play } from "lucide-react";

type Props = {
  onLogin: () => void;
  onNavigate: (id: string) => void;
};

export function HeroSection({ onLogin, onNavigate }: Props) {
  return (
    <section id="home" className="relative isolate min-h-[690px] overflow-hidden bg-white">
      <div className="absolute -right-40 -top-60 h-[800px] w-[800px] rounded-full bg-[#d9f4ff]" />
      <div className="mx-auto grid max-w-[1248px] items-center gap-6 px-5 pb-14 pt-20 lg:grid-cols-[48%_52%] lg:pb-4 lg:pt-10">
        <div className="relative z-10">
          <p className="text-[15px] font-bold uppercase tracking-wide text-[#0869f7]">Suivi intelligent de votre eau</p>
          <h1 className="mt-6 max-w-[610px] text-[52px] font-bold leading-[1.02] tracking-[-0.04em] text-[#181e4b] sm:text-[66px] lg:text-[76px]">
            Maîtrisez votre consommation d’eau
          </h1>
          <p className="mt-7 max-w-[490px] text-base leading-7 text-[#5e6282]">
            Suivez vos usages en temps réel, détectez les anomalies et réduisez durablement votre facture grâce à un tableau de bord clair.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-7">
            <button onClick={onLogin} className="rounded-[10px] bg-[#0869f7] px-7 py-[18px] text-base font-medium text-white shadow-[0_18px_32px_rgba(8,105,247,0.22)] transition hover:bg-[#075bd5]">
              Voir le dashboard
            </button>
            <button onClick={() => onNavigate("features")} className="flex items-center gap-4 text-base font-medium text-[#686d77]">
              <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-[#0869f7] text-white shadow-lg"><Play className="ml-0.5 h-4 w-4 fill-current" /></span>
              En savoir plus
            </button>
          </div>
        </div>
        <div className="relative z-0 min-h-[520px] lg:-ml-44 lg:min-h-[580px]">
          <img src="/figma-assets/hero-water.png" alt="AquaWatch sur téléphone avec compteur d’eau connecté" className="absolute inset-0 h-full w-full object-contain object-center" />
        </div>
      </div>
    </section>
  );
}
