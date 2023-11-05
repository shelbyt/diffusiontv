const withPWA = require('next-pwa')

module.exports = withPWA({
    reactStrictMode: false,
      images: {
    domains: ['avatars.githubusercontent.com', 'image.civitai.com'],
  },


    pwa: {
        dest: 'public',
        register: true,
        skipWaiting: true,
        disable: process.env.NODE_ENV === 'development',
    },
})
