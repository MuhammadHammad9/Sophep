import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { fileTypeFromBuffer } from "file-type";

// Allowed MIME types and their expected magic-byte signatures
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);

export async function POST(request: Request) {
  // ── Rate Limiting ────────────────────────────────────────────
  const ip = getClientIp(request.headers);
  const { allowed, remaining } = await checkRateLimit(ip, "upload", 5, 60 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many upload requests. Please try again in an hour." },
      {
        status: 429,
        headers: {
          "Retry-After": "3600",
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ── Client-declared MIME type check (first gate) ─────────
    const allowedClientTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedClientTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPG, PNG, or PDF." },
        { status: 400 }
      );
    }

    // ── File size check ──────────────────────────────────────
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5 MB." },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();

    // ── Magic-byte MIME validation (second gate) ─────────────
    // Read the first 4,100 bytes to detect the true file type
    const sampleBuffer = Buffer.from(fileBuffer.slice(0, 4100));
    const detectedType = await fileTypeFromBuffer(sampleBuffer);

    if (!detectedType || !ALLOWED_MIME_TYPES.has(detectedType.mime)) {
      return NextResponse.json(
        {
          error:
            "File content does not match an accepted type (JPG, PNG, or PDF). Disguised files are not permitted.",
        },
        { status: 415 }
      );
    }

    // ── Sanitise the extension from the detected type (not the client) ──
    const typeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "application/pdf": "pdf",
    };

    const safeExt = typeToExt[detectedType.mime];
    const fileName = `${crypto.randomUUID()}.${safeExt}`;
    const filePath = `receipts/${fileName}`;

    // ── Upload to Supabase Storage ───────────────────────────
    const { error: uploadError } = await supabaseAdmin.storage
      .from("receipts")
      .upload(filePath, fileBuffer, {
        contentType: detectedType.mime, // use verified MIME, not client-supplied
        upsert: false,
      });

    if (uploadError) {
      console.error("[Upload API] Storage error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Use signed URL so the bucket can stay private
    const { data: signedData, error: signError } = await supabaseAdmin.storage
      .from("receipts")
      .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year — admin fetches re-sign it

    if (signError || !signedData?.signedUrl) {
      console.error("[Upload API] Signed URL error:", signError);
      return NextResponse.json({ error: "Could not generate file URL." }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        url: signedData.signedUrl,
        path: filePath,
      },
      {
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (error) {
    console.error("[Upload API] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
