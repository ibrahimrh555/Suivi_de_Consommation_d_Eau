type Props = { onLogin: () => void };

export function WaterCtaSection({ onLogin }: Props) {
  return (
    <section className="relative mt-14 min-h-[660px] overflow-hidden">
      <img src="/figma-assets/cta-background.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative mx-auto grid min-h-[660px] max-w-[1070px] items-center gap-14 px-5 py-16 md:grid-cols-[0.9fr_1.1fr]">
        <div className="flex justify-center">
          <div className="rounded-3xl border-[10px] border-white/90 shadow-2xl">
            <img src="/figma-assets/cta-device.png" alt="Compteur et application AquaWatch" className="h-[360px] w-[340px] rounded-xl object-cover" />
          </div>
        </div>
        <div className="text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]">Prêt à économiser ?</p>
          <h2 className="mt-7 text-4xl font-semibold leading-[1.16] md:text-[50px]">Chaque goutte compte.<br />Commencez aujourd’hui.</h2>
          <p className="mt-7 max-w-[500px] text-lg leading-8 text-white/90">Créez votre espace AquaWatch et obtenez une vision claire de votre consommation.</p>
          <button onClick={onLogin} className="mt-10 rounded-[15px] bg-[#75a0fd] px-7 py-[18px] text-base font-semibold text-[#010101] transition hover:bg-white">
            Créer mon compte
          </button>
        </div>
      </div>
    </section>
  );
}
