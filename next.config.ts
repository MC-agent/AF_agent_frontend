/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
        poll: 3000,
        aggregateTimeout: 500,
      };
    return config;
  },
};

module.exports = nextConfig;
