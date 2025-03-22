import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
      includePaths: [path.join(__dirname, 'src/styles')],
      prependData: `@import "variables.scss";`,
  },// Add any external image domains here if needed
    images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'images.pexels.com',
              port: '',
              pathname: '**',
          },
          {
              protocol: 'https',
              hostname: 'upload.wikimedia.org',
              port: '',
              pathname: '**',
          },
      ],
  },
}

export default nextConfig;
