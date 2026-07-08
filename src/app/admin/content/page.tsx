import { ContentEditor } from "@/components/admin/content-editor";
import { getHeroSlides, getHomeCircles, supabaseReady } from "@/lib/cms";
import { HOME_CIRCLES } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [hero, circles, ready] = await Promise.all([
    getHeroSlides(),
    getHomeCircles(),
    supabaseReady(),
  ]);
  return (
    <div>
      {!ready && (
        <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Connect the database (run the SQL schema) to save content changes live. You can preview the
          editor below.
        </p>
      )}
      <ContentEditor hero={hero} circles={(circles as typeof HOME_CIRCLES) ?? HOME_CIRCLES} />
    </div>
  );
}
