/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    // swcMinify: true,
    images: {
        // remotePatterns: [{
        //     protocol: 'https',
        //     hostname: 'www.cervantes.to',
        //     pathname: 'images/photo/2022/**'
        // }]
        domains: ['www.cervantes.to']
    }
}

module.exports = nextConfig
