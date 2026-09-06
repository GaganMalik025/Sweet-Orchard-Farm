import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * The "@/..." alias is declared in tsconfig.json, but is wired explicitly
 * here as well so resolution doesn't depend on tsconfig discovery (which is
 * brittle when the project path contains spaces).
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root,
    resolveAlias: {
      "@/*": "./*",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": root,
    };
    return config;
  },
};

export default nextConfig;
