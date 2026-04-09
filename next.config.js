/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['devforum-uploads.s3.dualstack.us-east-2.amazonaws.com'],
  },
};

module.exports = nextConfig;
