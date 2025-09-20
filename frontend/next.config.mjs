/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
    staleTimes: {
      dynamic: 0
    }
  },
  reactStrictMode: false // This is causing multiple issues with ws
}

export default nextConfig
