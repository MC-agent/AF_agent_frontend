import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    config.watchOptions = {
      poll: 3000,
      aggregateTimeout: 500,
    };
    return config;
  },
};

export default nextConfig;
