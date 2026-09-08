import { BarChart3, Gauge, Leaf } from "lucide-react";

const steps = [
  { icon: Gauge, title: "Connectez votre compteur", text: "Associez votre compteur AquaWatch à votre espace." },
  { icon: BarChart3, title: "Suivez votre consommation", text: "Consultez le débit, le volume et les tendances en temps réel." },
  { icon: Leaf, title: "Réduisez simplement", text: "Suivez les recommandations et mesurez vos économies." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-5 py-28">
      <div className="mx-auto grid max-w-[1080px] items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5e6282]">Comment ça marche</p>
          <h2 className="mt-5 text-4xl font-bold capitalize leading-[1.08] tracking-[-0.03em] text-[#14183e] md:text-[50px]">
            Trois étapes vers une consommation responsable
          </h2>
          <div className="mt-10 space-y-7">
            {steps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[13px] bg-[#0869f7] text-white"><Icon className="h-5 w-5" /></span>
                <div><h3 className="font-semibold text-[#14183e]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#5e6282]">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[485px] rounded-[28px] bg-[#f5f9ff] p-7 shadow-[0_28px_70px_rgba(30,35,90,0.10)]">
          <img src="/figma-assets/how-device.png" alt="Compteur connecté et application AquaWatch" className="h-[210px] w-full rounded-2xl object-cover" />
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-sm text-[#5e6282]">Consommation aujourd’hui</p><p className="mt-2 text-2xl font-bold">128 L</p></div><span className="rounded-full bg-[#e8f6ef] px-3 py-1 text-xs font-semibold text-[#0d9b62]">−18 %</span></div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#e9edf5]"><div className="h-full w-3/4 rounded-full bg-[#0869f7]" /></div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs text-[#5e6282]"><span>Débit<br /><strong className="text-[#14183e]">2,4 L/min</strong></span><span>Objectif<br /><strong className="text-[#14183e]">160 L</strong></span><span>Économie<br /><strong className="text-[#14183e]">32 L</strong></span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
