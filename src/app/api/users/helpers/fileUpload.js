import path from "path";
import fs from "fs-extra";

export async function handleFileUpload(file) {
  if (file && file.name) {
    const uploadsDir = path.resolve("./uploads");
    await fs.ensureDir(uploadsDir);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));
    return `/api/files/${fileName}`;
  }
  return null;
}
