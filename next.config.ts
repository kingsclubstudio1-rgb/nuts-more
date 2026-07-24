import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
