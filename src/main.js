// KidsOS – startpunkt.
import { kos } from './ui/kos.js';
import { mountShell, openApp, goHome } from './ui/shell.js';
import { isOverDailyLimit } from './core/model.js';

function boot() {
  const root = document.getElementById('kidsos');
  kos.init(root);
  mountShell(root);
  // Vyer kan be skalet öppna en annan app (t.ex. raketen → solsystemet).
  root.addEventListener('kos-open', (e) => openApp(e.detail.app, e.detail.module));
  // Förhindra dubbeltryck-zoom och nyp-zoom på iOS (barnvänligt).
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  let lastTouch = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now();
      if (now - lastTouch < 300 && !e.target.closest('input, textarea, select')) e.preventDefault();
      lastTouch = now;
    },
    { passive: false },
  );
  // Långt tryck ska inte öppna systemmenyer.
  document.addEventListener('contextmenu', (e) => {
    if (!e.target.closest('input, textarea')) e.preventDefault();
  });
  if (kos.profile && isOverDailyLimit(kos.profile)) kos.emit('limit');
  window.kidsos = { kos, goHome, openApp }; // för felsökning och tester
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
