import { prisma } from "@/prisma/prisma";
import { getRecoveryFromToken } from "@/lib/recovery/access";
import {
  canDownloadRecovery,
  objectIdPattern,
  recoveryPrivateHeaders,
} from "@/lib/recovery/policy";
import { recoveryAssetResponse } from "@/lib/recovery/asset-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string; assetId: string }> },
) {
  const { token, assetId } = await params;
  const recovery = await getRecoveryFromToken(token);
  if (
    !recovery ||
    !canDownloadRecovery(recovery) ||
    !objectIdPattern.test(assetId)
  )
    return Response.json(
      { error: "Photograph unavailable." },
      { status: 404, headers: recoveryPrivateHeaders },
    );
  const asset = await prisma.recoveryAsset.findFirst({
    where: { id: assetId, recoveryId: recovery.id },
  });
  if (!asset)
    return Response.json(
      { error: "Photograph unavailable." },
      { status: 404, headers: recoveryPrivateHeaders },
    );
  return recoveryAssetResponse(
    asset,
    new URL(request.url).searchParams.get("download") === "1",
  );
}
