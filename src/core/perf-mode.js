// Lätt grafikläge för äldre/svaga enheter (t.ex. iPad 9,7" med A9/A10 och iPadOS 15–16.1).
// backdrop-filter (glaseffekt) på helbreddsytor som statusraden och dockan måste ritas om vid
// varje scroll och är tungt på gamla GPU:er. I lätt läge stängs oskärpan av och glaset görs i
// stället nästan ogenomskinligt (src/styles/app.css, .lite-fx).

/** Safari-/iOS-version ur user agent som [major, minor], annars null. */
export function safariVersion(ua = '') {
  const ios = /\bOS (\d+)_(\d+)/.exec(ua);
  if (ios && /like Mac OS X/.test(ua)) return [Number(ios[1]), Number(ios[2])];
  // iPadOS 13+ utger sig för att vara en Mac; Safari-versionen följer iPadOS-versionen.
  const safari = !/Chrome|Chromium|CriOS|FxiOS|Edg|Android/.test(ua) && /Version\/(\d+)\.(\d+).*Safari/.exec(ua);
  return safari ? [Number(safari[1]), Number(safari[2])] : null;
}

/** Sant om enheten bör få lätt grafik. Rena indata så att det går att testa i node. */
export function prefersLiteFx({ ua = '', cores = 0, memory = 0, reducedTransparency = false, search = '' } = {}) {
  if (/[?&]fx=lite\b/.test(search)) return true;
  if (/[?&]fx=full\b/.test(search)) return false;
  if (reducedTransparency) return true;
  if (memory && memory <= 2) return true;
  if (cores && cores <= 2) return true;
  const v = safariVersion(ua);
  // Samma gräns som color-mix-reserverna: Safari före 16.2 körs på de gamla iPad-modellerna.
  return !!v && (v[0] < 16 || (v[0] === 16 && v[1] < 2));
}

/** Sätter .lite-fx på roten när enheten bör få lätt grafik. Följer ändringar av systeminställningen. */
export function installPerfMode(root, host = globalThis) {
  const nav = host.navigator || {};
  const mq = host.matchMedia?.('(prefers-reduced-transparency: reduce)');
  const apply = () => {
    const lite = prefersLiteFx({ ua: nav.userAgent || '', cores: nav.hardwareConcurrency || 0, memory: nav.deviceMemory || 0, reducedTransparency: !!mq?.matches, search: host.location?.search || '' });
    root.classList.toggle('lite-fx', lite);
    return lite;
  };
  const lite = apply();
  mq?.addEventListener?.('change', apply);
  return lite;
}
