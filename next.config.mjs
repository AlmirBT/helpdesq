/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")?.[1];
const basePath = isGhPages && repoName ? `/${repoName}` : "";
const assetPrefix = isGhPages && repoName ? `/${repoName}/` : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  assetPrefix,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

