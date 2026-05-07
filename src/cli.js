#!/usr/bin/env node

import path from "node:path";
import { Command } from "commander";
import { checkFfmpegInstalled, renderVideo } from "./render.js";
import { generateSrtFromAudio } from "./transcribe.js";
import { ensureDirExists, ensureFileExists, stripExtension } from "./utils.js";

async function main() {
  const program = new Command();

  program
    .name("add-subs")
    .description("Gera video MP4 com imagem fixa, musica e legenda")
    .requiredOption("--audio <path>", "arquivo .mp3 ou .wav")
    .requiredOption("--bg <path>", "imagem de fundo .jpg/.png")
    .option("--srt <path>", "usa arquivo .srt existente e pula transcricao")
    .option("--lang <code>", "idioma da transcricao (ex: pt)", "pt")
    .option("--out <path>", "caminho do MP4 final")
    .option("--whisper-bin <path>", "binario do whisper.cpp", "whisper-cli")
    .option("--whisper-model <path>", "caminho do modelo do whisper.cpp (ex: ggml-base.bin)")
    .parse(process.argv);

  const options = program.opts();
  const audioPath = path.resolve(options.audio);
  const backgroundPath = path.resolve(options.bg);
  const outputPath = path.resolve(options.out ?? `output/${stripExtension(audioPath)}.mp4`);
  const tempDir = path.resolve("temp");
  const outputDir = path.dirname(outputPath);

  await ensureFileExists(audioPath, "Audio");
  await ensureFileExists(backgroundPath, "Background");
  await ensureDirExists(tempDir);
  await ensureDirExists(outputDir);
  await checkFfmpegInstalled();

  let srtPath = options.srt ? path.resolve(options.srt) : null;

  if (options.srt) {
    await ensureFileExists(srtPath, "Legenda SRT");
    console.log(`Usando legenda existente: ${srtPath}`);
  } else {
    if (!options.whisperModel) {
      throw new Error("Informe --whisper-model para gerar legenda automatica local.");
    }

    srtPath = path.join(tempDir, `${stripExtension(audioPath)}.srt`);
    console.log("Gerando legenda automatica via whisper.cpp...");
    await generateSrtFromAudio({
      audioPath,
      language: options.lang,
      outputSrtPath: srtPath,
      whisperBin: options.whisperBin,
      whisperModelPath: options.whisperModel
    });
    console.log(`Legenda gerada em: ${srtPath}`);
  }

  const hasSubtitles = Boolean(srtPath);
  console.log(`Renderizando video ${hasSubtitles ? "com" : "sem"} legenda...`);
  await renderVideo({
    audioPath,
    backgroundPath,
    srtPath,
    outputPath
  });

  console.log(`Video criado com sucesso: ${outputPath}`);
  console.log(`Modo de legenda: ${hasSubtitles ? "com legenda" : "sem legenda"}`);
}

main().catch((error) => {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
});
