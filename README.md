# add-subs

CLI em Node.js para criar um video MP4 horizontal (1920x1080) a partir de:

- audio `.mp3` ou `.wav`
- imagem de background fixa (`.jpg`/`.png`)
- legenda automatica local com whisper.cpp

## Requisitos

- Node.js 18+
- `ffmpeg` e `ffprobe` no `PATH`
- `whisper.cpp` instalado (`whisper-cli`) + modelo (`ggml-*.bin`)

## Instalacao

```bash
npm install
```

Baixar o modelo local usado no projeto:

```bash
curl -L -o ~/models/whisper/ggml-base.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin
ls -lh ~/models/whisper/ggml-base.bin
```

## Uso

Gerar legenda local (whisper.cpp) e renderizar:

```bash
node src/cli.js \
  --audio input/musica.mp3 \
  --bg input/bg.jpg \
  --whisper-model ~/models/whisper/ggml-base.bin \
  --lang pt \
  --out output/musica.mp4
```

Usar um `.srt` pronto:

```bash
node src/cli.js --audio input/musica.mp3 --bg input/bg.jpg --srt input/legenda.srt --out output/musica.mp4
```

## Opcoes

- `--audio <path>`: caminho do audio (obrigatorio)
- `--bg <path>`: caminho da imagem de fundo (obrigatorio)
- `--srt <path>`: usa legenda existente e nao transcreve
- `--lang <code>`: idioma da transcricao (padrao: `pt`)
- `--out <path>`: caminho do mp4 de saida
- `--whisper-bin <path>`: binario do whisper.cpp (padrao: `whisper-cli`)
- `--whisper-model <path>`: caminho do modelo do whisper.cpp (obrigatorio para transcricao)

## Saida

- Video H.264 + AAC
- 1920x1080, 30fps
- legenda fixa no rodape
