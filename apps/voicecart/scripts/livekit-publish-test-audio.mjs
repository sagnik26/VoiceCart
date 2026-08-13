#!/usr/bin/env node
/**
 * Phase 3 — publish a short test clip into voicecart-talk-dev (not bundled in the APK).
 *
 * Uses repo-root .env.local. LiveKit CLI publishes Opus Ogg (not raw wav).
 * This script generates a beep, converts with ffmpeg, then runs `lk room join --publish`.
 *
 *   npm run publish:livekit-audio
 *   npm run publish:livekit-audio -- --once
 *   npm run publish:livekit-audio -- --file /path/to/clip.ogg
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, resolve } from 'node:path';

import { loadRootEnv } from '../../../scripts/load-root-env.mjs';

loadRootEnv();

const ROOM_NAME = 'voicecart-talk-dev';
const IDENTITY = `voicecart-publisher-${Date.now()}`;

function parseArgs(argv) {
  const parsed = { once: false, file: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--once') {
      parsed.once = true;
    } else if (arg === '--file') {
      parsed.file = argv[i + 1] ?? null;
      i += 1;
    }
  }
  return parsed;
}

function hasBin(name) {
  const cmd = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(cmd, [name], { encoding: 'utf8' }).status === 0;
}

function findCli() {
  if (hasBin('lk')) {
    return 'lk';
  }
  if (hasBin('livekit-cli')) {
    return 'livekit-cli';
  }
  return null;
}

function writeSineWav(filePath, { seconds = 3, sampleRate = 48000, freq = 440 } = {}) {
  const n = sampleRate * seconds;
  const dataSize = n * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  const fadeSamples = Math.floor(sampleRate * 0.02);
  for (let i = 0; i < n; i += 1) {
    const sample = Math.sin((2 * Math.PI * freq * i) / sampleRate);
    const fadeIn = i < fadeSamples ? i / fadeSamples : 1;
    const fadeOut = i > n - fadeSamples ? (n - i) / fadeSamples : 1;
    buf.writeInt16LE(Math.round(sample * fadeIn * fadeOut * 0.35 * 32767), 44 + i * 2);
  }
  writeFileSync(filePath, buf);
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed${result.stderr ? `\n${result.stderr}` : ''}`
    );
  }
}

function printManual(url, oggPath, once) {
  const onceFlag = once ? ' --exit-after-publish' : '';
  console.error(`
Install LiveKit CLI (https://docs.livekit.io/home/cli/), then:

  lk room join \\
    --url ${url} \\
    --api-key <LIVEKIT_API_KEY> \\
    --api-secret <LIVEKIT_API_SECRET> \\
    --identity ${IDENTITY}${onceFlag} \\
    --publish ${oggPath} \\
    ${ROOM_NAME}

lk publishes Opus .ogg (not wav). Convert with:

  ffmpeg -y -i clip.wav -c:a libopus -b:a 32k clip.ogg
`);
}

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const livekitUrl = process.env.LIVEKIT_URL ?? process.env.EXPO_PUBLIC_LIVEKIT_URL;
const { once, file } = parseArgs(process.argv.slice(2));

if (!apiKey || !apiSecret || !livekitUrl) {
  console.error(
    'Missing LIVEKIT_API_KEY, LIVEKIT_API_SECRET, or LIVEKIT_URL (repo-root .env.local)'
  );
  process.exit(1);
}

let publishPath = file ? resolve(file) : null;
if (publishPath && !existsSync(publishPath)) {
  console.error(`File not found: ${publishPath}`);
  process.exit(1);
}

if (!publishPath) {
  const wavPath = resolve(tmpdir(), 'voicecart-talk-beep.wav');
  const oggPath = resolve(tmpdir(), 'voicecart-talk-beep.ogg');
  writeSineWav(wavPath);
  if (!hasBin('ffmpeg')) {
    console.error(`Generated wav at ${wavPath}`);
    console.error('ffmpeg is required to convert that wav to Opus .ogg for `lk --publish`.');
    printManual(livekitUrl, '<clip.ogg>', once);
    process.exit(1);
  }
  try {
    run('ffmpeg', [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      wavPath,
      '-c:a',
      'libopus',
      '-b:a',
      '32k',
      oggPath,
    ]);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
  publishPath = oggPath;
} else if (extname(publishPath).toLowerCase() === '.wav') {
  console.error('lk publishes Opus .ogg, not wav. Convert first, or omit --file to auto-generate.');
  printManual(livekitUrl, '<clip.ogg>', once);
  process.exit(1);
}

const cli = findCli();
if (!cli) {
  console.error('LiveKit CLI (`lk`) not found on PATH.');
  printManual(livekitUrl, publishPath, once);
  process.exit(1);
}

const args = [
  'room',
  'join',
  '--url',
  livekitUrl,
  '--api-key',
  apiKey,
  '--api-secret',
  apiSecret,
  '--identity',
  IDENTITY,
  '--publish',
  publishPath,
  ROOM_NAME,
];
if (once) {
  args.splice(args.length - 1, 0, '--exit-after-publish');
}

console.log(`Publishing into room ${ROOM_NAME} as ${IDENTITY}`);
console.log(once ? 'Exits when the clip finishes.' : 'Ctrl+C to stop (phone should go silent).');

const child = spawn(cli, args, { stdio: 'inherit' });
child.on('exit', (code) => {
  process.exit(code ?? 1);
});
