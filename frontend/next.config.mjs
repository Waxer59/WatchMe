/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react']
  },
  reactStrictMode: false, // This is causing multiple issues with ws
}

export default nextConfig
