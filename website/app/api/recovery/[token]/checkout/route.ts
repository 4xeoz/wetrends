import { createRecoveryCheckout } from "@/lib/recovery/checkout";
import {
  isRecoverySameOrigin,
  recoveryPrivateHeaders,
} from "@/lib/recovery/policy";

export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!isRecoverySameOrigin(request))
    return Response.json(
      { error: "Invalid request origin." },
      { status: 403, headers: recoveryPrivateHeaders },
    );
  const { token } = await params;
  try {
    return Response.json(await createRecoveryCheckout(token), {
      headers: recoveryPrivateHeaders,
    });
  } catch (error) {
    console.error(
      "[recovery-checkout]",
      error instanceof Error ? error.message : "Checkout failed",
    );
    return Response.json(
      {
        error:
          "We could not open payment. Please try again, or reply to your recovery email for help.",
      },
      { status: 503, headers: recoveryPrivateHeaders },
    );
  }
}
