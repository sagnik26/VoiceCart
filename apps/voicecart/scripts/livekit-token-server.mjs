#!/usr/bin/env node
/**
 * Dev-only LiveKit token mint. Secrets stay on this machine — never in the app bundle.
 *
 *   npm run token:livekit -w voicecart
 *
 * Loads apps/voicecart/.env.local (LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL).
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AccessToken } from 'livekit-server-sdk';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.LIVEKIT_TOKEN_PORT ?? 8787);
const ROOM_NAME = 'voicecart-talk-dev';

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }
  for (const raw of readFileSync(filePath, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const eq = line.indexOf('=');
    if (eq === -1) {
      continue;
    }
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(resolve(ROOT, '.env.local'));
loadEnvFile(resolve(ROOT, '.env'));

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const livekitUrl = process.env.LIVEKIT_URL ?? process.env.EXPO_PUBLIC_LIVEKIT_URL;

if (!apiKey || !apiSecret || !livekitUrl) {
  console.error(
    'Missing LIVEKIT_API_KEY, LIVEKIT_API_SECRET, or LIVEKIT_URL in apps/voicecart/.env.local'
  );
  process.exit(1);
}

async function mintToken() {
  const at = new AccessToken(apiKey, apiSecret, {
    identity: `voicecart-talk-${Date.now()}`,
    ttl: '15m',
    name: 'VoiceCart Talk',
  });
  at.addGrant({
    roomJoin: true,
    room: ROOM_NAME,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomCreate: true,
  });
  return at.toJwt();
}

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && (url.pathname === '/token' || url.pathname === '/')) {
    mintToken()
      .then((token) => json(res, 200, { token, url: livekitUrl, room: ROOM_NAME }))
      .catch((err) => {
        console.error(err);
        json(res, 500, { error: 'Failed to mint token' });
      });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    json(res, 200, { ok: true });
    return;
  }

  json(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`LiveKit token mint on http://127.0.0.1:${PORT}/token`);
  console.log(`Room: ${ROOM_NAME}`);
  console.log('Emulator: EXPO_PUBLIC_LIVEKIT_TOKEN_URL=http://10.0.2.2:8787/token');
  console.log('Device:    EXPO_PUBLIC_LIVEKIT_TOKEN_URL=http://<LAN-IP>:8787/token');
});
