#!/usr/bin/env node
/**
 * Runs agent.py with the local venv when present. Python deps are not npm-installed.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2] ?? 'dev';
const venvPython = resolve(
  ROOT,
  '.venv',
  process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python'
);
const python = existsSync(venvPython) ? venvPython : 'python3';

if (!existsSync(venvPython)) {
  console.error(
    'No .venv found. From repo root: npm run agent:setup\nPut keys in the repo-root .env.local (see .env.example).'
  );
}

const child = spawn(python, [resolve(ROOT, 'agent.py'), mode], {
  cwd: ROOT,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
