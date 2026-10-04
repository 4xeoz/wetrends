import "server-only";
import type { RecoveryAsset } from "@prisma/client";
import { downloadGoogleDriveFile } from "@/lib/google-drive";
import { recoveryPrivateHeaders } from "./policy";

export async function recoveryAssetResponse(
  asset: RecoveryAsset,
  download = false,
) {
  try {
    const upstream = await downloadGoogleDriveFile(asset.driveFileId);
    // Stream original bytes; no shared cache and no public URL that bypasses payment.
    const headers = new Headers(recoveryPrivateHeaders);
    headers.set("Content-Type", asset.driveMimeType);
    headers.set("X-Content-Type-Options", "nosniff");
    if (download) {
      const name =
        asset.driveName.replace(/[^a-z0-9._-]/gi, "-").slice(0, 180) ||
        "photograph.jpg";
      headers.set("Content-Disposition", `attachment; filename="${name}"`);
    }
    return new Response(upstream.body, { headers });
  } catch {
    return Response.json(
      { error: "Photograph temporarily unavailable. Please try again." },
      { status: 503, headers: recoveryPrivateHeaders },
    );
  }
}
