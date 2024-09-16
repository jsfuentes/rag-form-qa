const conf = require("./conf/index.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.sanity.io", "lh3.googleusercontent.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${conf.get("SERVER_URL")}/api/:path*`, // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
