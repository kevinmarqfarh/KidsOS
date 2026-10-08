// Läser vynamnen ur views/index.js utan att importera DOM-kod.
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../../src/ui/views/index.js', import.meta.url), 'utf8');
export const VIEWS_LIST = [...src.matchAll(/^\s+(\w+):\s+\w+View,/gm)].map((m) => m[1]);
