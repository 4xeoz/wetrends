import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { objectIdPattern, recoveryPrivateHeaders } from "@/lib/recovery/policy";
import { recoveryAssetResponse } from "@/lib/recovery/asset-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; assetId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: recoveryPrivateHeaders },
    );
  const { id, assetId } = await params;
  if (!objectIdPattern.test(id) || !objectIdPattern.test(assetId))
    return new Response(null, { status: 404 });
  const asset = await prisma.recoveryAsset.findFirst({
    where: { id: assetId, recoveryId: id },
  });
  if (!asset) return new Response(null, { status: 404 });
  return recoveryAssetResponse(asset);
}
