export function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-5 py-28">
      <div className="mx-auto grid max-w-[1080px] gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5e6282]">Témoignages</p>
          <h2 className="mt-5 text-4xl font-bold capitalize leading-[1.08] tracking-[-0.03em] text-[#14183e] md:text-[50px]">Ils économisent avec AquaWatch</h2>
          <div className="mt-12 flex gap-4"><span className="h-3 w-3 rounded-full bg-[#0869f7]" /><span className="h-3 w-3 rounded-full bg-[#e5e5e5]" /><span className="h-3 w-3 rounded-full bg-[#e5e5e5]" /></div>
        </div>
        <div className="relative pb-16 pl-8 pt-6">
          <div className="absolute left-20 top-20 h-[232px] w-[calc(100%-5rem)] rounded-xl border-2 border-[#f4f4f4]" />
          <blockquote className="relative rounded-xl bg-white px-9 pb-8 pt-12 shadow-[0_35px_90px_rgba(30,35,90,0.12)]">
            <img src="/figma-assets/portrait-karim.png" alt="Karim, utilisateur AquaWatch" className="absolute -left-9 -top-9 h-[68px] w-[68px] rounded-full object-cover shadow-md" />
            <p className="max-w-[430px] text-base leading-8 text-[#5e6282]">« Les alertes nous ont permis de repérer une fuite dès la première semaine. »</p>
            <p className="mt-8 text-lg font-semibold text-[#5e6282]">Youssef A.</p>
            <p className="mt-2 text-sm font-medium text-[#5e6282]">Particulier</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
