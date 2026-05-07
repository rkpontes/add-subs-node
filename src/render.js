import { spawn } from "node:child_process";
import { escapePathForFfmpegFilter } from "./utils.js";

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });

    child.on("error", (error) => reject(error));
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} finalizou com codigo ${code}`));
    });
  });
}

export async function checkFfmpegInstalled() {
  try {
    await runCommand("ffmpeg", ["-version"]);
    await runCommand("ffprobe", ["-version"]);
  } catch (error) {
    throw new Error("ffmpeg/ffprobe nao encontrados no PATH. Instale antes de continuar.");
  }
}

export async function renderVideo({ audioPath, backgroundPath, srtPath, outputPath }) {
  const filterParts = [
    "scale=1920:1080:force_original_aspect_ratio=decrease",
    "pad=1920:1080:(ow-iw)/2:(oh-ih)/2"
  ];

  if (srtPath) {
    const escapedSrtPath = escapePathForFfmpegFilter(srtPath);
    filterParts.push(
      `subtitles='${escapedSrtPath}':force_style='Alignment=2,MarginV=45,FontSize=38,Outline=2,Shadow=0,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000'`
    );
  }

  const filter = filterParts.join(",");

  const args = [
    "-y",
    "-loop", "1",
    "-i", backgroundPath,
    "-i", audioPath,
    "-vf", filter,
    "-c:v", "libx264",
    "-preset", "medium",
    "-tune", "stillimage",
    "-r", "30",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    "-pix_fmt", "yuv420p",
    outputPath
  ];

  await runCommand("ffmpeg", args);
}
