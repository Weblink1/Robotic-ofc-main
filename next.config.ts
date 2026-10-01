import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["localhost:3000", "10.31.27.134:3000", "10.*:*", "192.168.*:*"],
  images: {
    qualities: [75, 100]
  }
};

export default nextConfig;
