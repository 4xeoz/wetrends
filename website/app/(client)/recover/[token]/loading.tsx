import { Loader2 } from "lucide-react";
export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F7F4F2]">
      <p
        role="status"
        className="flex items-center gap-3 text-sm font-semibold"
      >
        <Loader2 className="h-5 w-5 animate-spin text-[#C72C5B]" /> Opening your
        private gallery…
      </p>
    </main>
  );
}
