/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Allow Cloudinary images
    unoptimized: true, // Allow Base64 images in next/image
  },
};

module.exports = nextConfig;
