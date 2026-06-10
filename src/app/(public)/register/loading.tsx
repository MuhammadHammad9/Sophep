export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="min-h-dvh bg-[var(--color-bg)] pt-20">
      <div className="relative flex flex-col lg:flex-row w-full min-h-[calc(100dvh-80px)] animate-pulse">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-[15%] w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
          style={{
            background: "radial-gradient(circle, var(--color-primary), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-[20%] w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]"
          style={{
            background: "radial-gradient(circle, var(--color-neo-cyan), transparent 70%)",
          }}
        />

        <div className="flex-1 relative px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 py-12 flex flex-col max-w-4xl mx-auto lg:mx-0 lg:max-w-none">
          <div className="mb-10 space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-[var(--color-primary)] opacity-60" />
              <span className="h-3 w-28 rounded-full bg-white/10" />
            </div>
            <div className="h-16 sm:h-20 max-w-xl rounded-[1.5rem] bg-white/10" />
            <div className="h-5 w-72 rounded-full bg-white/10" />
          </div>

          <div className="h-10 w-full max-w-5xl rounded-full bg-white/8 border border-white/10" />

          <div className="relative flex-1 mt-8">
            <div className="w-full rounded-2xl border border-[var(--color-border)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,11,42,0.7)] via-[rgba(15,8,32,0.5)] to-transparent backdrop-blur-xl pointer-events-none" />
              <div className="relative z-10 p-6 sm:p-8 md:p-10 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-16 rounded-2xl bg-white/8 border border-white/10" />
                  <div className="h-16 rounded-2xl bg-white/8 border border-white/10" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-1/3 rounded-full bg-white/10" />
                  <div className="h-24 rounded-2xl bg-white/8 border border-white/10" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="h-14 rounded-2xl bg-white/8 border border-white/10" />
                    <div className="h-14 rounded-2xl bg-white/8 border border-white/10" />
                  </div>
                  <div className="h-14 rounded-2xl bg-white/8 border border-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[360px] xl:w-[420px] flex-shrink-0 relative z-40 order-last px-6 sm:px-10 md:px-16 lg:px-0 lg:pr-8 xl:pr-12 pb-12 lg:pb-0">
          <div className="sticky top-0 lg:h-[calc(100dvh-80px)]">
            <div className="h-full rounded-[2rem] border border-white/10 bg-white/8 backdrop-blur-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <div className="h-4 w-24 rounded-full bg-white/10" />
                <div className="h-10 w-40 rounded-[1rem] bg-white/10" />
              </div>
              <div className="space-y-4">
                <div className="h-24 rounded-2xl bg-white/8 border border-white/10" />
                <div className="h-24 rounded-2xl bg-white/8 border border-white/10" />
                <div className="h-24 rounded-2xl bg-white/8 border border-white/10" />
              </div>
              <div className="h-px w-full bg-white/10" />
              <div className="space-y-3">
                <div className="h-4 w-2/3 rounded-full bg-white/10" />
                <div className="h-4 w-1/2 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}