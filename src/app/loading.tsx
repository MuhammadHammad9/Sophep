export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="overflow-x-hidden">
      <div className="relative min-h-dvh overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,76,130,0.16),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(27,225,255,0.12),transparent_24%),linear-gradient(180deg,var(--color-bg),color-mix(in_srgb,var(--color-bg)_88%,black))]"
        />

        <div className="relative z-10">
          <section className="px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 pt-24 pb-16 min-h-[72dvh] flex items-center">
            <div className="w-full max-w-7xl mx-auto grid gap-14 lg:grid-cols-[1.15fr_0.85fr] items-center animate-pulse">
              <div className="space-y-8">
                <div className="space-y-4 max-w-xl">
                  <div className="h-3 w-28 rounded-full bg-white/10" />
                  <div className="h-20 sm:h-28 rounded-[2rem] bg-white/10" />
                  <div className="h-5 w-3/4 rounded-full bg-white/10" />
                  <div className="h-5 w-2/3 rounded-full bg-white/10" />
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="h-11 w-36 rounded-full bg-[var(--color-primary)]/20 border border-white/10" />
                  <div className="h-11 w-40 rounded-full bg-white/8 border border-white/10" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="h-24 rounded-2xl border border-white/10 bg-white/8" />
                  <div className="h-24 rounded-2xl border border-white/10 bg-white/8" />
                  <div className="h-24 rounded-2xl border border-white/10 bg-white/8" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[2rem] border border-white/10 bg-white/8 p-5 sm:p-6 backdrop-blur-xl">
                  <div className="space-y-4">
                    <div className="h-4 w-32 rounded-full bg-white/12" />
                    <div className="h-56 rounded-[1.5rem] bg-white/10" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 rounded-2xl bg-white/10" />
                      <div className="h-16 rounded-2xl bg-white/10" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-40 rounded-[1.5rem] border border-white/10 bg-white/8" />
                  <div className="h-40 rounded-[1.5rem] border border-white/10 bg-white/8" />
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden border-y border-white/10 bg-black/10">
            <div className="px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 py-5">
              <div className="flex gap-4 min-w-max animate-[marquee_18s_linear_infinite]">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-7 w-44 rounded-full bg-white/10" />
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 py-16">
            <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 xl:grid-cols-4 animate-pulse">
              <div className="h-72 rounded-[1.75rem] border border-white/10 bg-white/8" />
              <div className="h-72 rounded-[1.75rem] border border-white/10 bg-white/8" />
              <div className="h-72 rounded-[1.75rem] border border-white/10 bg-white/8" />
              <div className="h-72 rounded-[1.75rem] border border-white/10 bg-white/8" />
            </div>
          </section>

          <section className="px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 pb-20">
            <div className="max-w-7xl mx-auto rounded-[2rem] border border-white/10 bg-white/8 p-6 sm:p-8 md:p-10 animate-pulse">
              <div className="space-y-4 max-w-3xl">
                <div className="h-4 w-24 rounded-full bg-white/10" />
                <div className="h-12 sm:h-16 rounded-[1.25rem] bg-white/10" />
                <div className="h-5 w-11/12 rounded-full bg-white/10" />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="h-12 w-36 rounded-full bg-[var(--color-primary)]/20 border border-white/10" />
                <div className="h-12 w-28 rounded-full bg-white/8 border border-white/10" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}