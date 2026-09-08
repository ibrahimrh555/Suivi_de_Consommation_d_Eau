import { Check } from "lucide-react";

const results = [
  { image: "/figma-assets/result-smart.png", title: "Suivi intelligent", value: "24/7", note: "Visibilité en temps réel" },
  { image: "/figma-assets/result-leak.png", title: "Fuites détectées", value: "7 jours", note: "Repérage plus rapide" },
  { image: "/figma-assets/result-dashboard.png", title: "Consommation moyenne", value: "−22 %", note: "Économies mesurées" },
];

export function ResultsSection() {
  return (
    <section id="results" className="bg-white px-5 py-28">
      <div className="mx-auto max-w-[1118px]">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5e6282]">Votre impact</p>
          <h2 className="mt-5 text-4xl font-bold capitalize tracking-[-0.03em] text-[#14183e] md:text-[50px]">Résultats concrets</h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {results.map((result) => (
            <article key={result.title} className="overflow-hidden rounded-[18px] bg-white shadow-[0_18px_55px_rgba(30,35,90,0.11)]">
              <div className="h-[310px] overflow-hidden">
                <img src={result.image} alt={result.title} className="h-full w-full object-cover object-top" />
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-[#14183e]">{result.title}</h3>
                  <span className="whitespace-nowrap text-sm font-bold text-[#5e6282]">{result.value}</span>
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-[#5e6282]"><Check className="h-4 w-4 text-[#0869f7]" />{result.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
