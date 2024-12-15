/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["img.daisyui.com", "example.com", "localhost", "147.93.18.133"],
  },
};

// Tambahkan middleware LiveReload
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const liveReloadServer = livereload.createServer({
  exts: ["js", "css", "html", "png", "jpg", "jpeg", "gif", "svg"],
  debug: true,
});

// Pantau folder yang perlu diawasi, misalnya `public/uploads`
liveReloadServer.watch(process.cwd() + "/public/uploads");

module.exports = {
  ...nextConfig,
  webpackDevMiddleware: (config) => {
    config.server = connectLivereload();
    return config;
  },
};
