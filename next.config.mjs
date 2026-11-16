/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // let phones on the same Wi-Fi load dev assets (only affects `next dev`)
  allowedDevOrigins: ['192.168.1.79', '192.168.*.*'],
};

export default nextConfig;
