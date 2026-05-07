import { transcribeToSrtWithWhisperCpp } from "./whispercpp.js";

export async function transcribeAudio({
  audioPath,
  language,
  outputSrtPath,
  whisperBin,
  whisperModelPath
}) {
  return transcribeToSrtWithWhisperCpp({
    audioPath,
    language,
    outputSrtPath,
    whisperBin,
    whisperModelPath
  });
}
