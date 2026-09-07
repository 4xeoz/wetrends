export default function Loading() {
  return (
    <main
      className="grid min-h-[100svh] place-items-center bg-[#F7F4F2] px-6 text-[#0F0F0F]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center text-center">
        <div className="wt-page-loader" aria-hidden="true">
          <span />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#C72C5B]">WeTrends</p>
        <p className="mt-2 text-sm text-black/45">Loading your page…</p>
      </div>
    </main>
  );
}
