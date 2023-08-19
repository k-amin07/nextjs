/** @type {import('next').NextConfig} */
const nextConfig = {
    images: [{
        remotePatterns: [{
            protocol: 'https',
            hostname: 'cervantes.to',
            path: 'images/photo/2022/**'
        }]
    }]
}

module.exports = nextConfig
