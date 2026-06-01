/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rmqggozcsfdvemvulmoy.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/how-to-get-to-mafia-island',
        destination: '/blog/how-to-get-to-mafia-island',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
