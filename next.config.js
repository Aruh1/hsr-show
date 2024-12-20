/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.jsdelivr.net",
                pathname: "**"
            }
        ]
    }
};
