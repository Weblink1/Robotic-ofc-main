import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "192.168.8.75",
    "192.168.8.75:3000",
    "192.168.*.*",
    "10.31.27.134",
    "10.31.27.134:3000",
    "10.*.*.*",
  ],
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tvpkyeyfgkwtnmiddfpp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  }
};

export default nextConfig;
