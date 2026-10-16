// Regressionstester från den funktionella buggjakten (okt 2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('borttagen profil lämnar inga egna data kvar (även autismstödets föräldralogg)', async () => {
  const disk = new Map();
  globalThis.localStorage = {
    getItem: (k) => disk.get(k) ?? null,
    setItem: (k, v) => disk.set(k, String(v)),
    removeItem: (k) => disk.delete(k),
    key: (i) => [...disk.keys()][i] ?? null,
    get length() { return disk.size; },
  };
  const { deleteDrawingsFor, saveJSON } = await import('../../src/core/storage.js?qa-delete-profile');
  for (const area of ['notes', 'play', 'studio', 'story', 'literacy', 'buildWorld']) saveJSON(`${area}.p1`, { x: 1 });
  disk.set('kidsos.adaptedLog.v1.p1', '{}');
  disk.set('kidsos.adaptedLog.v1.p10', '{}'); // annan profil med liknande id
  disk.set('kidsos.v1.drawings.p1', '[]');
  deleteDrawingsFor('p1');
  assert.deepEqual([...disk.keys()], ['kidsos.adaptedLog.v1.p10']);
  delete globalThis.localStorage;
});
