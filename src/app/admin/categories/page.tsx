import { CategoriesEditor } from "@/components/admin/categories-editor";
import { getCategories, supabaseReady } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, ready] = await Promise.all([getCategories(), supabaseReady()]);
  return (
    <div>
      {!ready && (
        <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Connect the database (run the SQL schema) to save category changes live. You can preview
          the editor below.
        </p>
      )}
      <CategoriesEditor categories={categories} />
    </div>
  );
}
