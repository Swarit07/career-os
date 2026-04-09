const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple"];

export function TrustedLogos() {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="mx-auto max-w-[1600px]">
        <p className="mb-12 text-center font-[family-name:var(--font-inter)] text-sm uppercase tracking-widest text-gray-400">
          Trusted by top-tier product companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-[100px]">
          {companies.map((name) => (
            <span
              key={name}
              className="select-none font-[family-name:var(--font-fustat)] text-2xl font-bold text-gray-300"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
