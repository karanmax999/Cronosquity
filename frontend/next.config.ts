import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'ui.aceternity.com',
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;",
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' blob: data: https:;",
              "font-src 'self' data:;",
              "connect-src 'self' https: wss:;", // Allow Web3 connections
            ].join(" ").replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer, webpack }) => {
    // Universal aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "react-native": false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        os: false,
        url: false,
        http: false,
        https: false,
        stream: false,
        path: false,
        buffer: false,
      };

      // Resolve multiple versions of Lit warning
      config.resolve.alias = {
        ...config.resolve.alias,
        lit: path.resolve(__dirname, 'node_modules/lit'),
      };

      // Handle 'node:' prefix for browser compatibility
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource: any) => {
          resource.request = resource.request.replace(/^node:/, "");
        })
      );
    }

    config.externals.push("pino-pretty", "encoding", "lokijs");

    return config;
  },
};

export default nextConfig;
