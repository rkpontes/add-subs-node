import fs from "node:fs";
import { transcribeAudio } from "./transcribers/index.js";

export async function generateSrtFromAudio({
  audioPath,
  language,
  outputSrtPath,
  whisperBin,
  whisperModelPath
}) {
  if (!fs.existsSync(audioPath)) {
    throw new Error(`Audio nao encontrado: ${audioPath}`);
  }

  await transcribeAudio({
    audioPath,
    language,
    outputSrtPath,
    whisperBin,
    whisperModelPath
  });

  return outputSrtPath;
}
