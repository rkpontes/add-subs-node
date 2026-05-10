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

Gerar somente a legenda `.srt` (sem renderizar video):

```bash
node src/cli.js \
  --audio input/musica.mp3 \
  --whisper-model ~/models/whisper/ggml-base.bin \
  --lang pt \
  --only-srt \
  --srt-out input/musica.srt
```

## Opcoes

- `--audio <path>`: caminho do audio (obrigatorio)
- `--bg <path>`: caminho da imagem de fundo (obrigatorio para renderizar video)
- `--srt <path>`: usa legenda existente e nao transcreve
- `--only-srt`: gera somente a legenda `.srt` e nao cria MP4
- `--srt-out <path>`: caminho do `.srt` gerado ao transcrever (padrao: `temp/<audio>.srt`)
- `--lang <code>`: idioma da transcricao (padrao: `pt`)
- `--out <path>`: caminho do mp4 de saida
- `--whisper-bin <path>`: binario do whisper.cpp (padrao: `whisper-cli`)
- `--whisper-model <path>`: caminho do modelo do whisper.cpp (obrigatorio para transcricao)

## Saida

- Video H.264 + AAC
- 1920x1080, 30fps
- legenda fixa no rodape
