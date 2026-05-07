#!/usr/bin/env bash

set -euo pipefail

MODEL_NAME="${MODEL_NAME:-ggml-base.bin}"
MODEL_DIR="${MODEL_DIR:-$HOME/models/whisper}"
MODEL_PATH="${MODEL_DIR}/${MODEL_NAME}"
MODEL_URL="${MODEL_URL:-https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${MODEL_NAME}}"

echo "[1/5] Checking Homebrew..."
if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew not found. Install it first: https://brew.sh"
  exit 1
fi

echo "[2/5] Installing ffmpeg..."
brew list ffmpeg >/dev/null 2>&1 || brew install ffmpeg

echo "[3/5] Installing whisper.cpp..."
brew list whisper-cpp >/dev/null 2>&1 || brew install whisper-cpp

echo "[4/5] Downloading model (${MODEL_NAME})..."
mkdir -p "${MODEL_DIR}"
if [[ -f "${MODEL_PATH}" ]]; then
  echo "Model already exists at ${MODEL_PATH}"
else
  if [[ "${MODEL_NAME}" == "ggml-base.bin" && "${MODEL_DIR}" == "$HOME/models/whisper" ]]; then
    curl -L -o ~/models/whisper/ggml-base.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin
  else
    curl -L "${MODEL_URL}" -o "${MODEL_PATH}"
  fi
fi

if [[ "${MODEL_NAME}" == "ggml-base.bin" && "${MODEL_DIR}" == "$HOME/models/whisper" ]]; then
  ls -lh ~/models/whisper/ggml-base.bin
else
  ls -lh "${MODEL_PATH}"
fi

echo "[5/5] Verifying tools..."
ffmpeg -version >/dev/null
whisper-cli -h >/dev/null

echo "Done."
echo "Model path: ${MODEL_PATH}"
echo ""
echo "Example run:"
echo "node src/cli.js --audio input/EchoesBetweenUs.wav --bg input/EchoesBetweenUs.png --whisper-model ${MODEL_PATH} --out output/musica-local.mp4"
