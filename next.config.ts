import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const githubPagesBasePath = isGitHubPagesBuild ? "/AI-" : "";

const nextConfig: NextConfig = {
  ...(isGitHubPagesBuild
    ? {
        output: "export",
        trailingSlash: true,
        basePath: githubPagesBasePath,
        assetPrefix: githubPagesBasePath,
        images: {
          unoptimized: true,
        },
      }
    : {}),
};

export default nextConfig;
