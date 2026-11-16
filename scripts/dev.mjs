import { spawn } from 'node:child_process';

// Accept the preview host's Vite-style flags while retaining Next.js locally.
const input = process.argv.slice(2);
const args = input.flatMap((arg, index) =>
  arg === '--strictPort' ? [] : [arg === '--host' ? '--hostname' : input[index - 1] === '--host' ? '0.0.0.0' : arg],
);
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...args], {
  stdio: 'inherit', env: process.env,
});
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => child.kill(signal));
child.on('exit', (code) => process.exit(code ?? 1));
