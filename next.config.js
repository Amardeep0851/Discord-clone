/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io"], // Add your image hostname here
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
};


module.exports = nextConfig

