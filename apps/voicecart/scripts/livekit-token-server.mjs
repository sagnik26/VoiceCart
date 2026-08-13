#!/usr/bin/env node
/**
 * Dev-only LiveKit token mint. Secrets stay on this machine — never in the app bundle.
 *
 *   npm run token:livekit -w voicecart
 *
 * Loads repo-root .env.local (one env file for mint, app, and agent).
 */
import { createServer } from 'node:http';
import { AccessToken, AgentDispatchClient, RoomAgentDispatch, RoomConfiguration } from 'livekit-server-sdk';

import { loadRootEnv } from '../../../scripts/load-root-env.mjs';

loadRootEnv();

const PORT = Number(process.env.LIVEKIT_TOKEN_PORT ?? 8787);
const ROOM_NAME = 'voicecart-talk-dev';
const AGENT_NAME = 'voicecart-talk';

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const livekitUrl = process.env.LIVEKIT_URL ?? process.env.EXPO_PUBLIC_LIVEKIT_URL;

if (!apiKey || !apiSecret || !livekitUrl) {
  console.error(
    'Missing LIVEKIT_API_KEY, LIVEKIT_API_SECRET, or LIVEKIT_URL (repo-root .env.local)'
  );
  process.exit(1);
}

function livekitApiHost(url) {
  return url.replace(/^wss:\/\//, 'https://').replace(/^ws:\/\//, 'http://');
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
  at.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName: AGENT_NAME })],
  });

  // Token roomConfig only dispatches when the room is first created. This
  // shared dev room already exists after Phase 1–3, so also dispatch explicitly.
  try {
    const dispatch = new AgentDispatchClient(livekitApiHost(livekitUrl), apiKey, apiSecret);
    await dispatch.createDispatch(ROOM_NAME, AGENT_NAME);
  } catch (err) {
    console.warn(
      `Agent dispatch skipped (${err instanceof Error ? err.message : err}). Is npm run agent running?`
    );
  }

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
  console.log(`Agent dispatch: ${AGENT_NAME}`);
  console.log('Emulator: EXPO_PUBLIC_LIVEKIT_TOKEN_URL=http://10.0.2.2:8787/token');
  console.log('Device:    EXPO_PUBLIC_LIVEKIT_TOKEN_URL=http://<LAN-IP>:8787/token');
});
