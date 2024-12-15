import livereload from "livereload"; // Import livereload
import connectLivereload from "connect-livereload"; // Import connect-livereload

// Check for 'NODE_ENV' to run livereload only in development
if (process.env.NODE_ENV === "development") {
  // Membuat livereload server
  const liveReloadServer = livereload.createServer({
    exts: ["js", "css", "html", "png", "jpg", "jpeg", "gif", "svg", "webp"], // Ekstensi file yang dipantau
    port: 35729, // Port livereload
  });

  // Menonton folder publik untuk perubahan
  liveReloadServer.watch(process.cwd() + "/public/uploads");
}

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Abaikan ESLint selama build
  },
  images: {
    domains: ["img.daisyui.com", "example.com"], // Tambahkan domain gambar
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
};

export default nextConfig;
