import path from "node:path";
import { access, copyFile } from "node:fs/promises";
import { constants } from "node:fs";
import { execFile } from "node:child_process";

function execFileAsync(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr?.trim() || error.message));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

export async function transcribeToSrtWithWhisperCpp({
  audioPath,
  language,
  outputSrtPath,
  whisperBin = "whisper-cli",
  whisperModelPath
}) {
  if (!whisperModelPath) {
    throw new Error("Defina --whisper-model com o caminho do modelo GGUF do whisper.cpp.");
  }

  const outputBase = outputSrtPath.endsWith(".srt")
    ? outputSrtPath.slice(0, -4)
    : outputSrtPath;

  const args = [
    "-m", path.resolve(whisperModelPath),
    "-f", audioPath,
    "-l", language,
    "-osrt",
    "-of", outputBase
  ];

  await execFileAsync(whisperBin, args);

  const generatedSrtPath = `${outputBase}.srt`;
  await access(generatedSrtPath, constants.F_OK);

  if (generatedSrtPath !== outputSrtPath) {
    await copyFile(generatedSrtPath, outputSrtPath);
  }

  return outputSrtPath;
}
