const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['friendly-challenge']);

module.exports = withPlugins([withTM], {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.API_URL_INTERNAL}/:path*`,
            }
        ]
    },
    async redirects() {
        return [
            {
                source: '/discord',
                destination: 'https://discord.gg/M7xZ8MrmwP',
                permanent: false
            },
        ]
    }
})
