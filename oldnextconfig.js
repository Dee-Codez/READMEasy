// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Note: we provide webpack here to avoid importing it
  
      // Perform customizations to the default configuration
      // Important: return the modified config
  
      // Add 'chrome-aws-lambda' to externals
      if (isServer) {
        config.externals = [...config.externals, 'chrome-aws-lambda'];
      }
  
      return config;
    },
  }
  
  module.exports = nextConfig