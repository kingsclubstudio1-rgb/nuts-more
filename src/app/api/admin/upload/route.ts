import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

const BUCKET = "uploads";

/**
 * Admin image upload → Supabase Storage (public bucket).
 * The local filesystem is read-only on Vercel, so uploads must go to object
 * storage. Returns a public URL that is stored on the product.
 */
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Image storage isn't configured. Paste an image URL instead." },
      { status: 500 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const rand = Math.random().toString(36).slice(2, 8);
    const filename = `${Date.now()}-${rand}.${ext}`;

    const sb = createAdminClient();
    const { error } = await sb.storage.from(BUCKET).upload(filename, bytes, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const { data } = sb.storage.from(BUCKET).getPublicUrl(filename);
    return NextResponse.json({ path: data.publicUrl });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed. Try an image URL instead." },
      { status: 500 },
    );
  }
}
