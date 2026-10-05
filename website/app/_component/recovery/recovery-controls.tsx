"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, FolderOpen, Loader2, Mail, RefreshCw, Upload } from "lucide-react";
import {
  emailRecovery,
  prepareRecoveryDrive,
  importRecoveryDrive,
  syncRecoveryDrive,
} from "@/actions/recovery";

export default function RecoveryControls({
  id,
  status,
  clientEmail,
  assetCount,
  folderUrl,
  clientUrl,
  driveConfigured,
  expired,
}: {
  id: string;
  status: string;
  clientEmail: string;
  assetCount: number;
  folderUrl: string | null;
  clientUrl: string;
  driveConfigured: boolean;
  expired: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [failed, setFailed] = useState(false);
  async function run(
    label: string,
    task: () => Promise<{
      error?: string;
      message?: string;
      folderUrl?: string;
    }>,
  ) {
    if (busy) return;
    setBusy(label);
    setNotice("");
    setFailed(false);
    try {
      const result = await task();
      setFailed(Boolean(result.error));
      setNotice(
        result.error ||
          result.message ||
          (result.folderUrl
            ? "Drive folder ready. Open it below to upload your originals."
            : "Done."),
      );
      router.refresh();
    } catch {
      setNotice("Something went wrong. Please try again.");
      setFailed(true);
    } finally {
      setBusy("");
    }
  }
  async function upload(files: FileList | null) {
    if (!files?.length || busy) return;
    const selected = Array.from(files);
    if (selected.some((file) => file.size > 4 * 1024 * 1024)) {
      setFailed(true);
      setNotice(
        "For photos above 4 MB, open the Drive folder, upload them there, then click Import photos.",
      );
      return;
    }
    await run("Uploading…", async () => {
      let completed = 0;
      for (const file of selected) {
        setBusy(`Uploading ${completed + 1} of ${selected.length}…`);
        const form = new FormData();
        form.set("recoveryId", id);
        form.set("file", file);
        const response = await fetch("/api/admin/recoveries/upload", {
          method: "POST",
          body: form,
        });
        const result = await response.json();
        if (!response.ok)
          return {
            error: `${completed} uploaded. ${result.error || "Upload failed; try again."}`,
          };
        completed++;
      }
      return {
        message: `${completed} ${completed === 1 ? "photograph" : "photographs"} uploaded.`,
      };
    });
  }
  const button =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-bold transition hover:border-[#C72C5B] disabled:opacity-50";
  return (
    <div className="space-y-6">
      {status === "DRAFT" && (
        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C72C5B]">
            02 · Restore photographs
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Add their collection.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-black/55">
            Upload the photos this client originally received. Everything stays
            private until they pay.
          </p>
          {!driveConfigured ? (
            <p className="mt-4 text-sm text-red-700">
              Connect the company Google Drive before uploading.
            </p>
          ) : (
            <>
              <div className="mt-5 flex flex-wrap gap-3">
                <label
                  className={`${button} ${busy ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                >
                  <Upload className="h-4 w-4" /> Upload photos
                  <input
                    aria-label="Upload recovered photos"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    disabled={Boolean(busy)}
                    className="sr-only"
                    onChange={(event) => {
                      void upload(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </label>
                {folderUrl ? (
                  <a
                    href={folderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={button}
                  >
                    <FolderOpen className="h-4 w-4" /> Open Drive folder
                  </a>
                ) : (
                  <button
                    disabled={Boolean(busy)}
                    className={button}
                    onClick={() =>
                      run("Preparing folder…", () => prepareRecoveryDrive(id))
                    }
                  >
                    <FolderOpen className="h-4 w-4" /> Prepare Drive folder
                  </button>
                )}
                {folderUrl && (
                  <button
                    disabled={Boolean(busy)}
                    className={button}
                    onClick={() =>
                      run("Importing…", () => importRecoveryDrive(id))
                    }
                  >
                    Import photos from Drive
                  </button>
                )}
              </div>
              <p className="mt-3 text-xs text-black/45">
                JPEG, PNG or WebP. Website uploads: up to 4 MB each. For larger
                originals, upload directly to Drive, then import.
              </p>
            </>
          )}
        </section>
      )}
      {(status === "READY" || (status === "PAID" && !expired)) && (
        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C72C5B]">
            Drive photo sync
          </p>
          <h2 className="mt-2 text-xl font-bold">Added photos in Drive?</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/55">
            Drive uploads do not appear in the gallery automatically. Add JPEG,
            PNG or WebP files directly inside this ticket&apos;s Photographs
            folder, then sync them here. The agreed fee and access end date will
            stay the same.
          </p>
          {!driveConfigured ? (
            <p className="mt-4 text-sm text-red-700">
              Connect the company Google Drive before syncing.
            </p>
          ) : !folderUrl ? (
            <p className="mt-4 text-sm text-amber-800">
              This recovery has no linked Drive folder. Create a new recovery
              with the photos in its Photographs folder.
            </p>
          ) : (
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={folderUrl} target="_blank" rel="noreferrer" className={button}>
                <FolderOpen className="h-4 w-4" /> Open Photographs folder
              </a>
              <button
                disabled={Boolean(busy)}
                onClick={() => run("Syncing Drive photos…", () => syncRecoveryDrive(id))}
                className={button}
              >
                <RefreshCw className="h-4 w-4" /> Sync new photos
              </button>
            </div>
          )}
        </section>
      )}
      <section className="rounded-3xl bg-[#12090D] p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#F08BAB]">
          {status === "DRAFT" ? "03 · Email your client" : "Client access"}
        </p>
        <h2 className="mt-2 text-2xl font-bold">
          {status === "PAID" ? "Payment received." : "Ready to send?"}
        </h2>
        <p className="mt-3 break-words text-sm text-white/65">
          {status === "DRAFT"
            ? `Sending locks the price and collection, then emails ${clientEmail}.`
            : `Recovery for ${clientEmail}.`}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            disabled={Boolean(busy) || !assetCount || expired}
            onClick={() => run("Sending email…", () => emailRecovery(id))}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-6 text-sm font-bold disabled:opacity-50"
          >
            <Mail className="h-4 w-4" />
            {status === "DRAFT"
              ? "Send recovery email"
              : status === "PAID"
                ? "Resend gallery email"
                : "Resend recovery email"}
          </button>
          {status !== "DRAFT" && (
            <button
              disabled={Boolean(busy)}
              onClick={() =>
                run("Copying…", async () => {
                  await navigator.clipboard.writeText(clientUrl);
                  return { message: "Private link copied." };
                })
              }
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-bold"
            >
              <Copy className="h-4 w-4" /> Copy private link
            </button>
          )}
          {status !== "DRAFT" && (
            <a
              href={clientUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-5 text-sm font-bold"
            >
              View client page
            </a>
          )}
        </div>
        {expired && (
          <p className="mt-4 text-sm text-[#F08BAB]">
            Access has ended. Create a new recovery to restore this collection
            again.
          </p>
        )}
      </section>
      {busy && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Loader2 className="h-4 w-4 animate-spin text-[#C72C5B]" />
          {busy}
        </p>
      )}
      {notice && (
        <p
          role={failed ? "alert" : "status"}
          className={`rounded-xl p-4 text-sm ${failed ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}
        >
          {notice}
        </p>
      )}
    </div>
  );
}
