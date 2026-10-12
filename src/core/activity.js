// Gemensam paus för tidsstyrda steg. Ingen DOM eller webbläsare krävs.
let paused = false;
const listeners = new Set();

export function activityPaused() { return paused; }

export function setActivityPaused(value) {
  const next = !!value;
  if (next === paused) return false;
  paused = next;
  for (const listener of [...listeners]) listener(paused);
  return true;
}

export function activityWait(ms) {
  return new Promise(resolve => {
    let remaining = Math.max(0, Number(ms) || 0);
    let timer = null;
    let started = 0;
    const finish = () => {
      listeners.delete(changed);
      resolve();
    };
    const schedule = () => {
      started = performance.now();
      timer = setTimeout(finish, remaining);
    };
    const changed = value => {
      if (value) {
        clearTimeout(timer);
        remaining = Math.max(0, remaining - (performance.now() - started));
      } else schedule();
    };
    listeners.add(changed);
    if (!paused) schedule();
  });
}
