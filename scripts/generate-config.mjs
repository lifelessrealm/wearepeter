import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const envPath = resolve(root, '.env');

function parseEnv(source) {
  return Object.fromEntries(
    source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=');
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
        return [key, value];
      })
  );
}

let fileEnv = {};
try {
  fileEnv = parseEnv(await readFile(envPath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const contractAddress = process.env.CONTRACT_ADDRESS || fileEnv.CONTRACT_ADDRESS || '';
const pumpfunUrl = process.env.PUMPFUN_URL || fileEnv.PUMPFUN_URL || '';
const config = `window.__FIATLESS_CONFIG__ = ${JSON.stringify({ contractAddress, pumpfunUrl }, null, 2)};\n`;

await writeFile(resolve(root, 'dist', 'config.js'), config, 'utf8');
console.log(contractAddress ? 'FIATLESS launch configuration generated.' : 'No contract address set; the site remains in pre-launch mode.');
