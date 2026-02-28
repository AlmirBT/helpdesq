/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGhPages ? "/helpdesk" : "";
const assetPrefix = isGhPages ? "/helpdesk/" : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  assetPrefix,
  images: { unoptimized: true },
};

export default nextConfig;

