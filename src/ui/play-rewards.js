import { h, onTap } from './dom.js';
import { loadJSON } from '../core/storage.js';
import { STUDIO_PACKS, STUDIO_ROOMS, getRequirementProgress } from '../apps/studio.js';

export function learningPlayReward(profile, result, correctFirst) {
  const earned = correctFirst + (result.coinsEarned ?? result.bonus);
  const studio = loadJSON(`studio.${profile.id}`, {});
  const goal = studio?.goal;
  const target = goal?.type === 'room' ? STUDIO_ROOMS.find(item => item.id === goal.id) : goal?.type === 'pack' ? STUDIO_PACKS.find(item => item.id === goal.id) : null;
  const ready = target && getRequirementProgress(profile, target.requirement).complete;
  const card = h('div.learn-play-reward',
    h('span.learn-play-coin', { 'aria-hidden': 'true' }, '🪙'),
    h('div', h('b', `+${earned} spelmynt för svar och genomförd övning`), h('p', result.moduleCoins === 5 ? 'Första rundan i den här modulen gav fem extra mynt.' : 'Din genomförda övning gav extra mynt.'),
      target ? h('p', ready ? `${target.name}: kursmålet är klart. Paketet eller rummet kostar ${target.price} mynt.` : `Ditt mål: ${target.name}. Fortsätt med övningen som hör till målet.`) : h('p', 'Använd samma mynt i Skaparstudion och Byggvärlden.')),
    onTap(h('button.btn.btn-ghost.learn-play-open', { type: 'button' }, '🏡 Till Skaparstudion'), () => card.dispatchEvent(new CustomEvent('kos-open', { bubbles: true, detail: { app: 'play', module: 'studio' } }))),
    onTap(h('button.btn.btn-ghost.learn-play-world', {type:'button'}, '🧱 Till Byggvärlden'),()=>card.dispatchEvent(new CustomEvent('kos-open',{bubbles:true,detail:{app:'build-world',module:'world'}}))));
  return card;
}
