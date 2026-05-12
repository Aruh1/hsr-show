/** @type {import('next').NextConfig} */

module.exports = {
    reactStrictMode: true,
    cacheComponents: true,
    experimental: {
        optimizePackageImports: ["react-icons"]
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.jsdelivr.net",
                pathname: "**"
            }
        ]
    }
};
