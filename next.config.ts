import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static assets under public/ are served by the CDN and are NOT part of a
  // serverless function's filesystem. The invoice PDF reads its logo with fs,
  // so trace it into every route that renders one, or the logo silently
  // disappears in production while working fine locally.
  outputFileTracingIncludes: {
    "/api/invoice/**": ["./public/brand/logo-invoice.png"],
    "/api/checkout/verify": ["./public/brand/logo-invoice.png"],
    "/admin/orders/**": ["./public/brand/logo-invoice.png"],
  },
  images: {
    // Stock placeholders are pre-sized in /public/img; skip on-the-fly
    // optimization for now. Re-enable (remove this) once real, larger product
    // photography lands and you want responsive variants.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zpfsjaqcmihdgpydddqp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
