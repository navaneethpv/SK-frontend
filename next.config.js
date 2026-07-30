/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enables static HTML export for XAMPP
  basePath: '/SK',   // Configures subfolder path for http://localhost/SK/
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig
