// Tester för Undra (frågekort + quiz) och Programmering (robotbanor, lösare, buggjakt, logik, vardagsalgoritmer).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../src/core/rng.js';
import { WONDERS, WONDER_CATS, genWonderQuiz, randomFact, wonderApp } from '../../src/apps/wonder.js';
import {
  ROBOT_LEVELS,
  ROBOT_STAGES,
  TURTLE_CHALLENGES,
  MACHINE_SEQUENCES,
  IF_RULES,
  parseProgram,
  programToString,
  runProgram,
  blockCount,
  shortestPath,
  solveLevel,
  expand,
  genPredict,
  genDebug,
  genLogic,
  genEveryday,
  codeApp,
} from '../../src/apps/code.js';

const nested = (prog) => prog.some((p) => p.cmd === 'loop' && p.body.some((b) => b.cmd === 'loop'));

/* ======================= Undra ======================= */

test('undra: minst 80 frågor, unika id och alla tio kategorierna', () => {
  assert.ok(WONDERS.length >= 80, `bara ${WONDERS.length} frågor`);
  assert.equal(new Set(WONDERS.map((w) => w.id)).size, WONDERS.length, 'dubbla id');
  assert.equal(new Set(WONDERS.map((w) => w.q)).size, WONDERS.length, 'dubbla frågor');
  for (const c of ['Natur', 'Kroppen', 'Djur', 'Rymden', 'Vetenskap', 'Teknik', 'Historia', 'Mat', 'Språk', 'Känslor']) {
    assert.ok(WONDER_CATS.includes(c));
    assert.ok(WONDERS.filter((w) => w.cat === c).length >= 5, `för få frågor i ${c}`);
  }
  WONDERS.forEach((w) => assert.ok(WONDER_CATS.includes(w.cat), `${w.id}: okänd kategori ${w.cat}`));
});

test('undra: varje fråga har emoji, fråga, kort svar (2–4 meningar) och en följdfråga', () => {
  for (const w of WONDERS) {
    assert.match(w.id, /^[a-z0-9-]+$/, `${w.id}: id ska fungera som fotonyckel w-<id>`);
    assert.ok(w.e && w.e.length <= 8, `${w.id}: emoji`);
    assert.ok(w.q.endsWith('?'), `${w.id}: frågan ska sluta med frågetecken`);
    assert.ok(w.think.endsWith('?') || w.think.endsWith('!') || w.think.endsWith('.') || w.think.endsWith(')'), `${w.id}: följdfrågan`);
    const sentences = w.a.split(/(?<=[.!?])\s+(?=[A-ZÅÄÖ"])/).filter(Boolean);
    assert.ok(sentences.length >= 2 && sentences.length <= 4, `${w.id}: svaret har ${sentences.length} meningar`);
    assert.ok(w.a.length <= 330, `${w.id}: svaret är för långt (${w.a.length} tecken)`);
    assert.ok(!/undefined|NaN|null/.test(`${w.q}${w.a}${w.think}`), `${w.id}: skräptext`);
    if (w.tf) {
      assert.equal(typeof w.tf[0], 'string');
      assert.equal(typeof w.tf[1], 'boolean');
    }
  }
  const tf = WONDERS.filter((w) => w.tf);
  assert.ok(tf.length >= 30, 'för få sant/falskt-påståenden');
  assert.ok(tf.filter((w) => w.tf[1]).length >= 10 && tf.filter((w) => !w.tf[1]).length >= 10, 'blanda sant och falskt');
});

test('undra: quizet "Visste du?" – nivå 0–1 har två bildknappar, högre nivåer går att lösa', () => {
  assert.ok(wonderApp.modules.some((m) => m.gen === genWonderQuiz));
  for (let lvl = 0; lvl <= 4; lvl++) {
    for (let s = 0; s < 150; s++) {
      const q = genWonderQuiz(lvl, createRng(s * 31 + lvl));
      assert.equal(q.type, 'choice');
      assert.ok(q.options.some((o) => o.id === q.answer));
      assert.equal(new Set(q.options.map((o) => o.id)).size, q.options.length);
      if (lvl <= 1) {
        assert.equal(q.options.length, 2);
        assert.ok(q.options.every((o) => o.html.includes('👍') || o.html.includes('👎')));
      }
      if (q.answer === 'sant' || q.answer === 'falskt') {
        const w = WONDERS.find((x) => x.tf && q.prompt.endsWith(x.tf[0]));
        assert.ok(w, 'påståendet finns');
        assert.equal(q.answer, w.tf[1] ? 'sant' : 'falskt');
      } else {
        assert.ok(q.visual.includes(WONDERS.find((x) => x.id === q.answer).a));
      }
    }
  }
  const f = randomFact(createRng(4));
  assert.ok(f.text && WONDERS.find((w) => w.id === f.id).tf[1] === true, 'Visste du-kortet visar bara sanna fakta');
});

/* ======================= Programmering: robotbanor ======================= */

test('robotbanor: progressionen 0→4 går i ordning och varje steg har banor', () => {
  let prev = 0;
  for (const L of ROBOT_LEVELS) {
    assert.ok(Number.isInteger(L.stage) && L.stage >= 0 && L.stage <= 4, `bana ${L.id} saknar stage`);
    assert.ok(L.stage >= prev, `bana ${L.id} ligger före ett lättare steg`);
    prev = L.stage;
  }
  for (const st of ROBOT_STAGES) assert.ok(ROBOT_LEVELS.filter((L) => L.stage === st.stage).length >= 2, `steg ${st.stage} har för få banor`);
  // steg 0: 1–2 pilsteg; steg 3: loopar; steg 4: buggar
  ROBOT_LEVELS.filter((L) => L.stage === 0).forEach((L) => {
    assert.equal(L.mode, 'abs');
    assert.ok(expand(parseProgram(L.solution)).length <= 2, `bana ${L.id} är för lång för steg 0`);
  });
  ROBOT_LEVELS.filter((L) => L.stage === 3).forEach((L) => assert.ok(L.loops, `bana ${L.id} i loopsteget saknar loopar`));
  assert.ok(ROBOT_LEVELS.filter((L) => L.stage === 4 && L.bug).length >= 4, 'för få buggbanor');
  ROBOT_LEVELS.filter((L) => !L.loops && L.stage < 3).forEach((L) => assert.ok(!/\(/.test(L.solution), `bana ${L.id}`));
});

test('robotbanor: lösaren klarar varje bana inom blockgränsen (utan nästlade loopar)', () => {
  for (const L of ROBOT_LEVELS) {
    const sol = solveLevel(L);
    assert.ok(sol, `bana ${L.id} (${L.title}) går inte att lösa`);
    assert.equal(runProgram(L, sol.program).result, 'win', `bana ${L.id}: lösarens program vinner inte`);
    assert.equal(blockCount(sol.program), sol.blocks);
    assert.ok(sol.blocks <= L.maxBlocks, `bana ${L.id}: kräver ${sol.blocks} block men bara ${L.maxBlocks} får plats (${programToString(sol.program)})`);
    assert.ok(!nested(sol.program));
    // facit ska också fungera och gå att bygga i redigeraren (inga loopar i loopar)
    const facit = parseProgram(L.solution);
    assert.equal(runProgram(L, facit).result, 'win', `bana ${L.id}: facit`);
    assert.ok(blockCount(facit) <= L.maxBlocks, `bana ${L.id}: facit för långt`);
    assert.ok(!nested(facit), `bana ${L.id}: facit har nästlade loopar`);
  }
});

test('robotbanor: banor utan loopblock går att lösa utan loopar', () => {
  for (const L of ROBOT_LEVELS.filter((x) => !x.loops)) {
    const sp = shortestPath(L);
    assert.ok(sp && sp.length <= L.maxBlocks, `bana ${L.id}`);
    assert.deepEqual(solveLevel(L, { loops: false }).blocks, sp.length);
  }
});

test('robotbanor: id är unika och i följd, titlar unika', () => {
  ROBOT_LEVELS.forEach((L, i) => assert.equal(L.id, i + 1));
  assert.equal(new Set(ROBOT_LEVELS.map((l) => l.title)).size, ROBOT_LEVELS.length);
});

test('buggbanor: buggen ger fel, och ett enda byte (block eller loopsiffra) lagar programmet', () => {
  const CMDS = { abs: ['U', 'D', 'L', 'R'], rel: ['F', 'V', 'H'] };
  for (const L of ROBOT_LEVELS.filter((x) => x.bug)) {
    const bug = parseProgram(L.bug);
    assert.notEqual(runProgram(L, bug).result, 'win', `bana ${L.id}: buggen vinner ju`);
    assert.ok(blockCount(bug) <= L.maxBlocks, `bana ${L.id}: buggprogrammet får inte plats`);
    assert.ok(!nested(bug));
    // alla program som skiljer sig med ett tryck i buggläget (byt kommando / ändra loopvarv)
    const variants = [];
    const walk = (list, path) => list.forEach((p, i) => {
      if (p.cmd === 'loop') {
        for (let n = 2; n <= 9; n++) if (n !== p.n) variants.push({ path: [...path, i], n });
        walk(p.body, [...path, i, 'body']);
      } else for (const c of CMDS[L.mode]) if (c !== p.cmd) variants.push({ path: [...path, i], cmd: c });
    });
    walk(bug, []);
    const fixes = variants.filter((v) => {
      const prog = structuredClone(bug);
      let node = prog;
      for (const k of v.path) node = node[k];
      if (v.cmd) node.cmd = v.cmd;
      else node.n = v.n;
      return runProgram(L, prog).result === 'win';
    });
    assert.ok(fixes.length >= 1, `bana ${L.id}: ingen enkel ändring lagar buggen`);
  }
});

test('rita med kod: alla ritutmaningar går att bygga utan loopar i loopar', () => {
  for (const c of TURTLE_CHALLENGES.filter((x) => x.solution)) {
    const p = parseProgram(c.solution);
    assert.ok(!nested(p), `${c.id}: redigeraren tillåter inte loopar i loopar`);
    assert.ok(blockCount(p) <= c.maxBlocks, c.id);
  }
});

/* ======================= Programmering: frågegeneratorer ======================= */

test('kodmoduler: nya moduler finns med läroplanskoppling', () => {
  const ids = codeApp.modules.map((m) => m.id);
  for (const id of ['robot', 'predict', 'everyday', 'logic', 'debug', 'turtle']) assert.ok(ids.includes(id), id);
});

test('följ koden: svaret är dit roboten går, loopar från nivå 3', () => {
  for (let lvl = 0; lvl <= 4; lvl++) {
    let loops = 0;
    for (let s = 0; s < 200; s++) {
      const q = genPredict(lvl, createRng(s * 13 + lvl));
      assert.ok(q.visual.includes(`data-hit="${q.answer}"`));
      if (q.visual.includes('code-loop')) loops++;
    }
    if (lvl >= 3) assert.ok(loops > 150, `nivå ${lvl} ska nästan alltid ha loopar`);
    else assert.equal(loops, 0, `nivå ${lvl} ska inte ha loopar`);
  }
});

test('hitta buggen: rätt block lagar programmet och inget annat block gör det', () => {
  for (let lvl = 0; lvl <= 4; lvl++) {
    for (let s = 0; s < 200; s++) {
      const q = genDebug(lvl, createRng(s * 7 + lvl * 1000));
      assert.equal(q.type, 'choice');
      assert.ok(q.options.some((o) => o.id === q.answer));
      if (lvl === 0) assert.ok(q.options.length <= 3, 'nivå 0 ska ha få alternativ');
      assert.ok(!/undefined|NaN/.test(q.visual + q.explain));
    }
  }
});

test('hitta buggen: verifiera med robotmotorn att svaret är den enda lagningen', () => {
  const win = (L, cmds) => runProgram(L, cmds.map((c) => ({ cmd: c }))).result === 'win';
  let blocks = 0;
  let loopsQ = 0;
  for (let lvl = 0; lvl <= 4; lvl++) {
    for (let s = 0; s < 200; s++) {
      const q = genDebug(lvl, createRng(s * 11 + lvl));
      const { level: L } = q.meta;
      if (q.meta.buggy) {
        blocks++;
        const { buggy, fix } = q.meta;
        assert.ok(!win(L, buggy), 'buggprogrammet ska inte fungera');
        const b = Number(q.answer);
        const fixed = buggy.slice();
        fixed[b] = fix;
        assert.ok(win(L, fixed), 'att byta det rätta blocket ska laga programmet');
        for (let j = 0; j < buggy.length; j++) {
          if (j === b) continue;
          for (const c of ['U', 'D', 'L', 'R']) {
            const t = buggy.slice();
            t[j] = c;
            assert.ok(!win(L, t), `block ${j + 1} ska inte kunna laga programmet`);
          }
        }
      } else {
        loopsQ++;
        assert.ok(lvl >= 2);
        const prog = (k) => [{ cmd: 'loop', n: k, body: q.meta.body.map((c) => ({ cmd: c })) }, { cmd: q.meta.extra }];
        for (const o of q.options) assert.equal(runProgram(L, prog(Number(o.id))).result === 'win', o.id === q.answer, `loopvarv ${o.id}`);
      }
    }
  }
  assert.ok(blocks > 500 && loopsQ > 50, 'båda sorternas buggfrågor förekommer');
});

test('om, loopar & funktioner: alla svar är rätt uträknade', () => {
  for (let lvl = 0; lvl <= 4; lvl++) {
    for (let s = 0; s < 250; s++) {
      const q = genLogic(lvl, createRng(s * 17 + lvl));
      if (q.type === 'choice') {
        assert.ok(q.options.some((o) => o.id === q.answer), `nivå ${lvl} frö ${s}`);
        assert.equal(new Set(q.options.map((o) => o.id)).size, q.options.length);
        if (lvl === 0) assert.ok(q.options.length <= 3 && q.options.every((o) => o.html));
      } else {
        assert.equal(q.type, 'numpad');
        assert.ok(lvl >= 2, 'siffersvar först från nivå 2');
        assert.ok(Number.isInteger(q.answer) && q.answer > 0 && q.answer <= 30);
      }
    }
  }
  // OM–SÅ–ANNARS: svaret följer villkoret
  for (let s = 0; s < 200; s++) {
    const q = genLogic(1, createRng(s));
    if (!q.prompt.includes('OM')) continue;
    const r = IF_RULES.find((x) => q.prompt.startsWith(x.rule));
    const yes = q.prompt.includes(r.yes[1]);
    assert.equal(q.answer, yes ? r.then[1] : r.else[1]);
  }
});

test('vardagsalgoritmer: unika steg, rätt antal per nivå och saknat steg går att hitta', () => {
  for (const seq of MACHINE_SEQUENCES) {
    assert.equal(new Set(seq.steps).size, seq.steps.length, seq.name);
    assert.ok(seq.steps.length >= 4);
  }
  assert.ok(MACHINE_SEQUENCES.some((s) => s.name.startsWith('tandborst')));
  for (let lvl = 0; lvl <= 4; lvl++) {
    for (let s = 0; s < 200; s++) {
      const q = genEveryday(lvl, createRng(s * 3 + lvl));
      if (q.type === 'order') {
        const want = [3, 3, 4, 5, 6][lvl];
        assert.ok(q.items.length <= want && q.items.length >= 3);
        // ordningen ska följa sekvensen
        const seq = MACHINE_SEQUENCES.find((m) => q.items.every((it) => m.steps.includes(it.label)));
        assert.ok(seq);
        const ordered = q.answerOrder.map((id) => q.items.find((it) => it.id === id).label);
        const pos = ordered.map((l) => seq.steps.indexOf(l));
        assert.deepEqual(pos, [...pos].sort((a, b) => a - b));
      } else if (q.type === 'choice') {
        assert.ok(lvl >= 2);
        assert.ok(q.options.some((o) => o.id === q.answer));
        assert.equal(new Set(q.options.map((o) => o.id)).size, q.options.length);
      }
    }
  }
});
