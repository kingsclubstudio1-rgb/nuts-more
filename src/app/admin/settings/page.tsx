import { getInvoiceConfig } from "@/lib/gst";
import { supabaseReady } from "@/lib/cms";
import { GstSettingsEditor } from "@/components/admin/gst-settings-editor";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [config, ready] = await Promise.all([getInvoiceConfig(), supabaseReady()]);
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
      {!ready && (
        <p className="mt-4 max-w-xl rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Connect the database (run the SQL schema) to save settings.
        </p>
      )}
      <div className="mt-5">
        <GstSettingsEditor config={config} />
      </div>
    </div>
  );
}
