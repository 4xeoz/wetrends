import { createClientPaymentCheckout } from "@/lib/client-payments/checkout";
import { isPaymentSameOrigin, paymentPrivateHeaders } from "@/lib/client-payments/policy";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!isPaymentSameOrigin(request)) return Response.json(
    { error: "Invalid request origin." },
    { status: 403, headers: paymentPrivateHeaders },
  );
  const { token } = await params;
  try {
    return Response.json(await createClientPaymentCheckout(token), { headers: paymentPrivateHeaders });
  } catch (error) {
    console.error("[client-payment-checkout]", error instanceof Error ? error.message : "Checkout failed");
    return Response.json(
      { error: "Payment could not be opened. Refresh the page or contact WeTrends if this continues." },
      { status: 503, headers: paymentPrivateHeaders },
    );
  }
}
