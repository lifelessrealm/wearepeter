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
const rawSiteUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || fileEnv.SITE_URL || '';
const siteUrl = rawSiteUrl
  ? `${/^https?:\/\//i.test(rawSiteUrl) ? '' : 'https://'}${rawSiteUrl}`.replace(/\/$/, '')
  : '';
const pageUrl = siteUrl ? `${siteUrl}/` : '';
const socialImage = siteUrl ? `${siteUrl}/assets/peter-banner.png` : './assets/peter-banner.png';
const indexPath = resolve(root, 'dist', 'index.html');
let indexHtml = await readFile(indexPath, 'utf8');

function replaceDynamicContent(marker, value) {
  const pattern = new RegExp(`(<meta data-dynamic-url="${marker}"[^>]*content=")[^"]*(")`);
  indexHtml = indexHtml.replace(pattern, `$1${value}$2`);
}

replaceDynamicContent('page', pageUrl);
replaceDynamicContent('image', socialImage);
replaceDynamicContent('twitter-image', socialImage);
indexHtml = indexHtml.replace(
  /(<link data-dynamic-href="canonical"[^>]*href=")[^"]*(")/,
  `$1${pageUrl}$2`
);

await writeFile(resolve(root, 'dist', 'config.js'), config, 'utf8');
await writeFile(indexPath, indexHtml, 'utf8');
console.log(contractAddress ? 'FIATLESS launch configuration generated.' : 'No contract address set; the site remains in pre-launch mode.');
console.log(siteUrl ? `Social preview configured for ${siteUrl}.` : 'Social preview uses a local relative image until deployed.');
