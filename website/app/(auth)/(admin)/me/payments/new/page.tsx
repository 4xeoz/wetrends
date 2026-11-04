import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ClientPaymentForm from "@/app/_component/client-payments/payment-form";

export default function NewClientPaymentPage() {
  return <main className="min-h-screen bg-[#F7F4F2] px-4 py-8 text-[#151515] sm:px-6">
    <div className="mx-auto max-w-4xl">
      <Link href="/me/payments" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-black/55 hover:text-black"><ArrowLeft className="h-4 w-4" /> Payment requests</Link>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">New request</p>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em]">Build the payment summary.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/55">Enter only the services and amounts already agreed with your client. You can review the draft before publishing a link.</p>
      <section className="mt-7 rounded-3xl border border-black/10 bg-white p-5 sm:p-8"><ClientPaymentForm /></section>
    </div>
  </main>;
}
