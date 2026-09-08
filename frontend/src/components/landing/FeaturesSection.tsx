const features = [
  { icon: "/figma-assets/suivi-icon.png", title: "Suivi en direct", text: "Consultez votre débit et votre consommation instantanément." },
  { icon: "/figma-assets/alerte-icon.png", title: "Alertes de fuite", text: "Détectez rapidement les fuites et les consommations anormales." },
  { icon: "/figma-assets/objectif-icon.png", title: "Objectifs", text: "Fixez vos limites et suivez facilement les économies réalisées." },
  { icon: "/figma-assets/historique-icon.png", title: "Historique", text: "Comparez vos usages par jour, semaine et mois." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden px-5 py-28 text-center">
      <div className="absolute left-1/2 top-32 h-[620px] w-[1120px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,#eaf5ff_0%,#ffffff_66%)] shadow-[inset_0_20px_55px_rgba(8,105,247,0.20)]" />
      <div className="relative mx-auto max-w-[1248px]">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5e6282]">Fonctionnalités</p>
        <h2 className="mt-5 text-4xl font-bold capitalize tracking-[-0.03em] text-[#14183e] md:text-[50px]">Maîtrisez votre eau</h2>
        <div className="mt-20 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-[36px] bg-white px-8 py-10 shadow-[0_22px_60px_rgba(30,35,90,0.12)] transition duration-300 hover:-translate-y-2">
              <div className="mx-auto grid h-[88px] w-[88px] place-items-center rounded-[18px] bg-[#28a5ff]">
                <img src={feature.icon} alt="" className="h-11 w-11 object-contain" />
              </div>
              <h3 className="mt-7 text-xl font-semibold text-[#1e1d4c]">{feature.title}</h3>
              <p className="mx-auto mt-4 max-w-[190px] text-base leading-[26px] text-[#5e6282]">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
