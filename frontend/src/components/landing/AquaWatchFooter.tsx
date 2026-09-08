type Props = { onNavigate: (id: string) => void };

export function AquaWatchFooter({ onNavigate }: Props) {
  return (
    <footer className="relative overflow-hidden bg-white px-5 py-20">
      <div className="mx-auto grid max-w-[1140px] gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <img src="/figma-assets/aquawatch-logo.png" alt="AquaWatch" className="h-[72px] w-[218px] object-contain" />
          <p className="mt-3 max-w-[260px] text-sm font-medium leading-6 text-[#5e6282]">Le suivi intelligent pour une consommation d’eau plus responsable.</p>
        </div>
        <FooterColumn title="Navigation" links={[["home","Accueil"],["features","Fonctionnalités"],["results","Résultats"]]} onNavigate={onNavigate} />
        <FooterColumn title="Contact" links={[["how-it-works","À propos"],["testimonials","Contact"],["home","Tarifs"]]} onNavigate={onNavigate} />
        <FooterColumn title="Informations" links={[["home","Confidentialité"],["home","Conditions"],["home","Assistance"]]} onNavigate={onNavigate} />
      </div>
      <p className="mt-16 text-center text-sm font-medium text-[#5e6282]">© 2026 AquaWatch. Tous droits réservés.</p>
    </footer>
  );
}

function FooterColumn({ title, links, onNavigate }: { title: string; links: readonly (readonly [string,string])[]; onNavigate: (id: string) => void }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-[#080809]">{title}</h3>
      <div className="mt-6 space-y-4">
        {links.map(([id,label]) => <button key={label} onClick={() => onNavigate(id)} className="block text-left text-base font-medium text-[#5e6282] hover:text-[#0869f7]">{label}</button>)}
      </div>
    </div>
  );
}
