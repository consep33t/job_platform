import chokidar from "chokidar";
import { exec } from "child_process";

// Tentukan folder yang ingin dipantau
const uploadsDir = "./public/uploads";

// Inisialisasi watcher untuk folder uploads
const watcher = chokidar.watch(uploadsDir, {
  persistent: true,
  ignoreInitial: true, // Mengabaikan file yang sudah ada pada saat startup
});

// Fungsi untuk mereload server atau memberi notifikasi ketika file baru ditambahkan
const reloadServer = () => {
  console.log("File baru ditambahkan, mereload server...");
  exec("npm run dev", (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
      return;
    }
    console.log(stdout);
  });
};

// Tambahkan event listener untuk file yang ditambahkan
watcher.on("add", (filePath) => {
  console.log(`File ditambahkan: ${filePath}`);
  reloadServer(); // Mereload server ketika file baru ditambahkan
});

console.log(`Memantau folder ${uploadsDir} untuk perubahan file.`);
