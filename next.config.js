const withPWA = require('next-pwa')

module.exports = {
  images: {
    domains: ['avatars.githubusercontent.com', 'image.civitai.com', 'cdn.discordapp.com'],
  },
  ...withPWA({
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === 'development',
    },
  }),
}