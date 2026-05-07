import fs from "node:fs/promises";
import path from "node:path";

export async function ensureFileExists(filePath, label) {
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`${label} nao e um arquivo: ${filePath}`);
    }
  } catch (error) {
    throw new Error(`${label} nao encontrado: ${filePath}`);
  }
}

export async function ensureDirExists(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export function stripExtension(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

export function formatSrtTime(seconds) {
  const totalMs = Math.max(0, Math.floor(seconds * 1000));
  const ms = totalMs % 1000;
  const totalSec = Math.floor(totalMs / 1000);
  const sec = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const min = totalMin % 60;
  const hrs = Math.floor(totalMin / 60);

  const pad = (value, size = 2) => String(value).padStart(size, "0");
  return `${pad(hrs)}:${pad(min)}:${pad(sec)},${pad(ms, 3)}`;
}

export function escapePathForFfmpegFilter(filePath) {
  return filePath.replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/'/g, "\\'");
}
