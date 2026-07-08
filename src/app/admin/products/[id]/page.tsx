import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getProductById, getCategories } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();
  return <ProductForm product={product} categories={categories} />;
}
