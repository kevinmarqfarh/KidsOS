// Enkel webbserver för att testa på iPad i samma wifi: npm run serve → öppna http://<datorns-ip>:8080
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT) || 8080;
createServer((req, res) => {
  const file = join(dist, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(500);
    return res.end('Kör npm run build först.');
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
  res.end(readFileSync(file));
}).listen(port, () => {
  const ips = Object.values(networkInterfaces()).flat().filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i.address);
  console.log(`KidsOS körs på http://localhost:${port}`);
  ips.forEach((ip) => console.log(`  På iPad/mobil i samma nätverk: http://${ip}:${port}`));
});
