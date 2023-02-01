/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/j/:slug',
        destination: '/join/:slug', // Matched parameters can be used in the destination
        permanent: false,
      },
    ]
  }
}

module.exports = nextConfig
