import {withSentryConfig} from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com', 'github.com'],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['framer-motion', '@react-three/fiber', '@react-three/drei'],
  },
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Handle large JSON files
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    
    return config;
  },
  // Add compression for better performance
  compress: true,
  // Increase memory limit for build
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

// Only wrap with Sentry if we're in production and Sentry is properly configured
const isProduction = process.env.NODE_ENV === 'production';
const hasSentryConfig = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const finalConfig = isProduction && hasSentryConfig 
  ? withSentryConfig(nextConfig, {
      org: "it-solutions-2v",
      project: "javascript-nextjs",
      silent: !process.env.CI,
      widenClientFileUpload: true,
      reactComponentAnnotation: {
        enabled: true,
      },
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    })
  : nextConfig;

export default finalConfig;
