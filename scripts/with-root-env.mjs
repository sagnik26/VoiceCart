#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { loadRootEnv } from './load-root-env.mjs';

loadRootEnv();

const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error('usage: with-root-env <command> [args...]');
  process.exit(1);
}

const child = spawn(command, args, {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
