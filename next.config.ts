import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["localhost:3000", "192.168.8.75:3000", "192.168.*:*"],
  images: {
    qualities: [75, 100]
  }
};

export default nextConfig;
