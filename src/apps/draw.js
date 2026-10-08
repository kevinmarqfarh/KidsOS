// Rita-appen: fritt skapande med spegelpensel (symmetri) och ritidéer.
export const DRAW_PROMPTS = [
  'Rita ett djur som inte finns – vad heter det?',
  'Rita hur det ser ut på Mars.',
  'Rita din drömrobot. Vad kan den göra?',
  'Rita en fjäril med spegelpenseln 🦋',
  'Rita ditt favoritväder.',
  'Rita en karta över en hemlig ö.',
  'Rita vad du vill bli när du blir stor.',
  'Rita ett hus för en igelkott.',
  'Rita en ny planet och ge den ett namn.',
  'Rita din familj som superhjältar.',
  'Rita något som gör dig glad.',
  'Rita en snöflinga med spegelpenseln ❄️',
  'Rita en undervattensstad.',
  'Rita din egen bokstav – hitta på ett nytt tecken!',
  'Rita en maskin som städar rummet.',
];
export const DRAW_COLORS = ['#1f2a44', '#ff4b3e', '#ff9f1c', '#ffd23f', '#2fae66', '#13a3a0', '#3d8bfd', '#8a5cf6', '#ff5fa2', '#8b5a2b', '#ffffff'];
export const DRAW_STAMPS = ['⭐', '❤️', '🌸', '🐞', '🦋', '🌈', '☀️', '🌙', '🐟', '🌲', '🚀', '🍎'];
export const drawApp = {
  id: 'draw',
  name: 'Rita',
  icon: '🎨',
  color: '#ec4899',
  tagline: 'Måla, stämpla och skapa',
  modules: [{ id: 'canvas', name: 'Rita', icon: '🎨', minLevel: 0, view: 'draw', lgr: ['bi-skapa', 'ma-sym'] }],
};
