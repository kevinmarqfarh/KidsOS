import { h, clear } from "../dom.js";
import { loadJSON, saveJSON, isPersistent } from "../../core/storage.js";
import { APPS } from "../../apps/registry.js";
import { WORLD_SIZE, BLOCKS, BUILD_PLANS, applyBuildPlan, emptyWorld, normalizeWorld, cellBlocks, placeBlock, removeBlock, rotateBlock, moveAvatar, purchaseBlock, missionProgress } from "../../apps/build-world.js";
function buildWorldView(el, { kos }) {
  const profile = kos.profile, key = `buildWorld.${profile.id}`;
  let world = normalizeWorld(loadJSON(key, null) || emptyWorld()), selected = { ...world.avatar }, mode = "walk", chosen = BLOCKS[0].id, pending = null, purchaseVersion = 0, zoom = 1, alive = true, history = [];
  const previousText = window.render_game_to_text, previousAdvance = window.advanceTime;
  let started = !profile.settings?.previewRounds;
  const root = h("section.build-world", { "aria-label": "Byggvärlden" }), controls = h("div.bw-controls"), canvas = h("canvas.bw-canvas", { width: 1e3, height: 700, tabindex: 0, "aria-label": "Din blockvärld. Piltangenter går eller väljer byggplats. Använd även knapparna nedanför." }), storageNotice = h("p.bw-storage-notice", { role: "status" }), notice = h("p.bw-notice", { role: "status", "aria-live": "polite" });
  const save = () => {
    const ok = saveJSON(key, world);
    kos.saveNow?.();
    storageNotice.textContent = ok && isPersistent() ? "" : "Sparas bara under den här öppna sessionen. Be en vuxen ta en säkerhetskopia.";
    return ok && isPersistent();
  };
  const button = (text, fn, id, attrs = {}) => h("button.bw-button", { type: "button", dataset: { bwKey: id }, onClick: () => {
    if (alive && !kos.paused) fn();
  }, ...attrs }, text);
  const message = (text) => {
    notice.textContent = text;
  };
  const accept = (result) => {
    if (!result.ok) {
      message(result.message || "Det går inte här. Prova en annan ruta.");
      return;
    }
    history.push(world);
    history = history.slice(-30);
    world = result.state;
    save();
    draw();
    message(result.message || "Din värld är sparad.");
  };
  const selectedText = () => `Kolumn ${selected.x + 1}, rad ${selected.y + 1}`;
  const item = (id) => BLOCKS.find((b) => b.id === id);
  const snapshot = () => JSON.stringify({ mode: "build-world", tool: mode, paused: !!kos.paused, coordinates: "10x10; x east/right, y south/down, z up; zero based", avatar: world.avatar, selected, chosen, coins: profile.coins || 0, inventory: world.inventory, blocks: world.blocks, missions: missionProgress(world), purchase: pending });
  const advance = () => {
    paint();
    return snapshot();
  };
  window.render_game_to_text = snapshot;
  window.advanceTime = advance;
  function move(dx, dy) {
    if (mode === "walk") {
      accept(moveAvatar(world, dx, dy));
      selected = { ...world.avatar };
      draw();
    } else {
      selected = { x: Math.max(0, Math.min(WORLD_SIZE - 1, selected.x + dx)), y: Math.max(0, Math.min(WORLD_SIZE - 1, selected.y + dy)) };
      draw();
      message(selectedText());
    }
  }
  function keyboard(event) {
    if (!started || kos.paused || event.defaultPrevented || event.target.closest?.("input,textarea,select,dialog,.sheet")) return;
    const owner = el.closest(".dwin");
    if (owner && (!owner.classList.contains("active") || owner.classList.contains("minimized"))) return;
    if (!root.contains(event.target)) return;
    const steps = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    if (steps[event.key]) {
      event.preventDefault();
      move(...steps[event.key]);
    } else if (event.target === canvas && event.key === "Enter" && mode === "build") {
      event.preventDefault();
      accept(placeBlock(world, selected.x, selected.y, chosen));
    }
  }
  document.addEventListener("keydown", keyboard);
  const project = (x, y, z = 0) => ({ x: 500 + (x - y) * 38 * zoom, y: 160 + (x + y) * 19 * zoom - z * 38 * zoom });
  function paint() {
    let c;
    try {
      c = canvas.getContext("2d");
    } catch {
      return;
    }
    if (!c) return;
    c.clearRect(0, 0, 1e3, 700);
    const sky = c.createLinearGradient(0, 0, 0, 700);
    sky.addColorStop(0, "#dff5ff");
    sky.addColorStop(1, "#f1fae8");
    c.fillStyle = sky;
    c.fillRect(0, 0, 1e3, 700);
    c.fillStyle = "#ffffff";
    for (const [x, y, r] of [[140, 100, 40], [195, 110, 55], [825, 145, 48], [875, 130, 36]]) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    }
    const polygon = (points, color, stroke) => {
      c.beginPath();
      points.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
      c.closePath();
      c.fillStyle = color;
      c.fill();
      if (stroke) {
        c.strokeStyle = stroke;
        c.lineWidth = 1;
        c.stroke();
      }
    };
    function tile(x, y, z, color, highlight = false) {
      const p = project(x, y, z), w = 38 * zoom, hh = 19 * zoom, depth = 30 * zoom;
      polygon([{ x: p.x - w, y: p.y }, { x: p.x, y: p.y + hh }, { x: p.x, y: p.y + hh + depth }, { x: p.x - w, y: p.y + depth }], color === "ground" ? "#7da65e" : "#78948b");
      polygon([{ x: p.x, y: p.y + hh }, { x: p.x + w, y: p.y }, { x: p.x + w, y: p.y + depth }, { x: p.x, y: p.y + hh + depth }], color === "ground" ? "#648b48" : "#627e80");
      polygon([{ x: p.x, y: p.y - hh }, { x: p.x + w, y: p.y }, { x: p.x, y: p.y + hh }, { x: p.x - w, y: p.y }], color === "ground" ? (x + y) % 2 ? "#a8d47d" : "#b4dc8e" : color, "#ffffff40");
      if (highlight) {
        c.strokeStyle = "#164d86";
        c.lineWidth = 4;
        c.stroke();
      }
    }
    c.fillStyle = "#8ed3e3";
    c.beginPath();
    c.ellipse(500, 415, 420 * zoom, 180 * zoom, 0, 0, Math.PI * 2);
    c.fill();
    for (let sum = 0; sum < 19; sum++) for (let y = 0; y < 10; y++) {
      const x = sum - y;
      if (x < 0 || x > 9) continue;
      tile(x, y, 0, "ground");
      const blocks = cellBlocks(world, x, y);
      for (const block of blocks) {
        const b = item(block.type), p = project(x, y, block.z + 0.3), q = zoom;
        const ellipse = (dx, dy, rx, ry, color) => {
          c.fillStyle = color;
          c.beginPath();
          c.ellipse(p.x + dx * q, p.y + dy * q, rx * q, ry * q, 0, 0, Math.PI * 2);
          c.fill();
        };
        const rect = (dx, dy, w, hh, color) => {
          c.fillStyle = color;
          c.fillRect(p.x + dx * q, p.y + dy * q, w * q, hh * q);
        };
        c.save();
        c.translate(p.x, p.y);
        c.scale(block.rotation % 2 ? -1 : 1, 1);
        c.translate(-p.x, -p.y);
        if (["stone", "wood", "glass"].includes(block.type)) {
          tile(x, y, block.z + 0.85, b.color, selected.x === x && selected.y === y && mode === "build");
          if (block.type === "glass") {
            c.strokeStyle = "#f4fcff";
            c.lineWidth = 3;
            c.beginPath();
            c.moveTo(p.x - 14 * q, p.y - 33 * q);
            c.lineTo(p.x + 10 * q, p.y - 20 * q);
            c.stroke();
          }
          if (block.type === "wood") {
            c.strokeStyle = "#85552f";
            c.lineWidth = 2;
            for (let n = 0; n < 3; n++) {
              c.beginPath();
              c.moveTo(p.x - 27 * q, p.y + (-16 + n * 9) * q);
              c.lineTo(p.x - 5 * q, p.y + (-5 + n * 9) * q);
              c.stroke();
            }
          }
        } else if (block.type === "tree") {
          rect(-6, -43, 12, 48, "#976136");
          ellipse(0, -54, 28, 31, "#288e61");
          ellipse(-12, -62, 19, 22, "#43b86e");
          ellipse(13, -64, 19, 21, "#6ccb7d");
        } else if (block.type === "bench") {
          rect(-24, -4, 5, 20, "#553e35");
          rect(17, -4, 5, 20, "#553e35");
          rect(-28, -12, 55, 11, "#b77b48");
          rect(-26, -35, 6, 27, "#80532e");
          rect(20, -35, 6, 27, "#80532e");
          rect(-27, -34, 54, 13, "#dca26c");
        } else if (block.type === "lamp") {
          rect(-4, -58, 8, 65, "#4d6175");
          ellipse(0, 8, 13, 6, "#536b7c");
          rect(-12, -72, 24, 21, "#fff1aa");
          rect(-14, -76, 28, 6, "#42576a");
          rect(-13, -53, 26, 5, "#42576a");
        } else if (block.type === "pond") {
          ellipse(0, 1, 34, 17, "#afc4ab");
          ellipse(0, -1, 29, 13, "#55bdd8");
          ellipse(-5, -3, 17, 5, "#8de2ec");
          ellipse(15, -2, 7, 4, "#4f9e6d");
        } else if (block.type === "roof") {
          polygon([{ x: p.x - 39 * q, y: p.y + 6 * q }, { x: p.x, y: p.y - 40 * q }, { x: p.x + 39 * q, y: p.y + 6 * q }], "#cc5454", "#963a45");
          polygon([{ x: p.x - 39 * q, y: p.y + 6 * q }, { x: p.x, y: p.y - 40 * q }, { x: p.x - 8 * q, y: p.y - 51 * q }, { x: p.x - 46 * q, y: p.y - 5 * q }], "#f58370");
        } else if (block.type === "flower") {
          rect(-2, -26, 4, 32, "#328f58");
          ellipse(-7, -8, 8, 4, "#5caf67");
          for (let n = 0; n < 6; n++) {
            const a = n * Math.PI / 3;
            ellipse(Math.cos(a) * 10, -30 + Math.sin(a) * 10, 7, 7, "#f6be40");
          }
          ellipse(0, -30, 7, 7, "#885b34");
        } else if (block.type === "path") {
          polygon([{ x: p.x, y: p.y - 15 * q }, { x: p.x + 32 * q, y: p.y }, { x: p.x, y: p.y + 15 * q }, { x: p.x - 32 * q, y: p.y }], "#d4b18b", "#b28b65");
        }
        c.restore();
        if (selected.x === x && selected.y === y && mode === "build") {
          c.strokeStyle = "#164d86";
          c.lineWidth = 3;
          c.strokeRect(p.x - 34 * q, p.y - 10 * q, 68 * q, 24 * q);
        }
      }
      if (selected.x === x && selected.y === y && mode === "build" && !blocks.length) {
        const p = project(x, y, 0.04);
        polygon([{ x: p.x, y: p.y - 18 * zoom }, { x: p.x + 36 * zoom, y: p.y }, { x: p.x, y: p.y + 18 * zoom }, { x: p.x - 36 * zoom, y: p.y }], "#fff7b3", "#164d86");
      }
      if (world.avatar.x === x && world.avatar.y === y) {
        const p = project(x, y, blocks.length + 0.3);
        c.fillStyle = "#32436933";
        c.beginPath();
        c.ellipse(p.x, p.y + 10, 16 * zoom, 8 * zoom, 0, 0, 7);
        c.fill();
        c.fillStyle = "#536bde";
        c.fillRect(p.x - 12 * zoom, p.y - 25 * zoom, 24 * zoom, 29 * zoom);
        c.fillStyle = "#ffd5a5";
        c.fillRect(p.x - 11 * zoom, p.y - 47 * zoom, 22 * zoom, 22 * zoom);
        c.fillStyle = "#354869";
        c.fillRect(p.x - 12 * zoom, p.y - 49 * zoom, 24 * zoom, 7 * zoom);
        c.fillStyle = "#23354c";
        c.fillRect(p.x - 6 * zoom, p.y - 39 * zoom, 3 * zoom, 3 * zoom);
        c.fillRect(p.x + 4 * zoom, p.y - 39 * zoom, 3 * zoom, 3 * zoom);
        const direction = { north: [0, -1], east: [1, 0], south: [0, 1], west: [-1, 0] }[world.avatar.direction] || [0, -1];
        c.strokeStyle = "#254d86";
        c.lineWidth = 4;
        c.beginPath();
        c.moveTo(p.x, p.y + 17 * zoom);
        c.lineTo(p.x + (direction[0] - direction[1]) * 20 * zoom, p.y + (17 + (direction[0] + direction[1]) * 10) * zoom);
        c.stroke();
      }
    }
    c.fillStyle = "#24465e";
    c.font = "bold 22px system-ui";
    c.textAlign = "left";
    c.fillText("DIN EGEN Ö AV IDÉER", 36, 52);
    c.font = "18px system-ui";
    c.fillText(mode === "walk" ? "Utforska i din egen takt" : "Välj en ruta och bygg vidare", 36, 81);
  }
  function walkTo(tx, ty) {
    const queue = [{ state: world, steps: [] }], visited = /* @__PURE__ */ new Set([`${world.avatar.x},${world.avatar.y}`]);
    while (queue.length) {
      const current = queue.shift();
      if (current.state.avatar.x === tx && current.state.avatar.y === ty) {
        if (current.steps.length) {
          history.push(world);
          history = history.slice(-30);
          world = current.state;
          save();
        }
        draw();
        message("Du är framme.");
        return;
      }
      for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const result = moveAvatar(current.state, dx, dy);
        if (!result.ok) continue;
        const id = `${result.state.avatar.x},${result.state.avatar.y}`;
        if (!visited.has(id)) {
          visited.add(id);
          queue.push({ state: result.state, steps: [...current.steps, 1] });
        }
      }
    }
    message("Det finns ingen fri väg dit. Välj en annan ruta.");
  }
  canvas.addEventListener("click", (event) => {
    if (!started || kos.paused) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const mx = (event.clientX - rect.left) / rect.width * 1e3, my = (event.clientY - rect.top) / rect.height * 700;
    let best = null;
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) {
      const z = cellBlocks(world, x, y).length, p = project(x, y, z ? z - 0.15 : 0), distance = Math.abs(mx - p.x) / (38 * zoom) + Math.abs(my - p.y) / (19 * zoom);
      if (distance <= 1 && (!best || p.y > best.py)) best = { x, y, py: p.y };
    }
    if (!best) {
      message("Tryck på en ruta på ön.");
      return;
    }
    selected = { x: best.x, y: best.y };
    if (mode === "walk") walkTo(selected.x, selected.y);
    draw();
  });
  function draw() {
    if (!alive || !started) return;
    const focused = document.activeElement?.dataset?.bwKey;
    const openDetails = [...controls.querySelectorAll("details")].filter((d) => d.open).map((d) => d.querySelector("summary")?.textContent);
    clear(controls);
    const wallet = h("strong.bw-wallet", `${profile.coins || 0} spelmynt`);
    controls.append(h("header.bw-heading", h("div", h("p.bw-kicker", "UTFORSKA · BYGG · HITTA PÅ"), h("h2", "Byggvärlden")), wallet), h("p", "En egen ö att bygga på. Startsatsen är gratis. Du tjänar fler spelmynt i kursapparna."), h("div.bw-toolbar", button("🚶 Gå", () => {
      mode = "walk";
      draw();
    }, "walk", { "aria-pressed": String(mode === "walk") }), button("🧱 Bygg", () => {
      mode = "build";
      draw();
    }, "build", { "aria-pressed": String(mode === "build") }), button("− Zoom", () => {
      zoom = Math.max(0.7, zoom - 0.1);
      paint();
    }, "zoom-out"), button("+ Zoom", () => {
      zoom = Math.min(1.1, zoom + 0.1);
      paint();
    }, "zoom-in"), button("Spara min värld", () => message(save() ? "Din värld är sparad." : "Världen finns kvar i den här sessionen. Läs lagringsmeddelandet."), "save"), button("Läs hjälpen", () => kos.read("Använd pilarna för att gå. Välj Bygg, välj ett material och en ruta. Tryck Placera. Ta bort lämnar tillbaka materialet. Alla mynt är spelmynt."), "read")));
    const nav = h("div.bw-navigation", h("div.bw-dpad", button("↑", () => move(0, -1), "up", { "aria-label": "Norr, uppåt" }), button("←", () => move(-1, 0), "left", { "aria-label": "Väster, vänster" }), button("↓", () => move(0, 1), "down", { "aria-label": "Söder, nedåt" }), button("→", () => move(1, 0), "right", { "aria-label": "Öster, höger" })), h("p", mode === "walk" ? `Din figur: kolumn ${world.avatar.x + 1}, rad ${world.avatar.y + 1}` : selectedText()));
    controls.append(nav, h("p.bw-cell-description", `${selectedText()}. ${cellBlocks(world, selected.x, selected.y).map((b, i) => `Lager ${i + 1}: ${item(b.type)?.name}, vridet ${b.rotation * 90} grader`).join(". ") || "Tom gräsruta"}. ${selected.x === world.avatar.x && selected.y === world.avatar.y ? "Din figur står här." : ""}`), h("details.bw-details", h("summary", "Min världs alla byggdelar"), world.blocks.length ? h("ul", ...world.blocks.map((b) => h("li", `${item(b.type)?.name}, kolumn ${b.x + 1}, rad ${b.y + 1}, lager ${b.z + 1}`))) : h("p", "Din ö är redo för det första bygget.")));
    const picker = h("div.bw-cell-picker");
    for (const [axis, label] of [["x", "Kolumn"], ["y", "Rad"]]) {
      const select = h("select", { "aria-label": `Välj ${label.toLowerCase()}`, dataset: { bwKey: axis } });
      for (let n = 0; n < 10; n++) select.append(h("option", { value: n, selected: selected[axis] === n }, `${label} ${n + 1}`));
      select.addEventListener("change", () => {
        if (kos.paused) return;
        selected[axis] = Number(select.value);
        draw();
      });
      picker.append(h("label", label, select));
    }
    controls.append(h("details.bw-details", h("summary", "Välj ruta med lista"), picker));
    if (mode === "build") {
      const tray = h("div.bw-palette", { "aria-label": "Byggmaterial" });
      BLOCKS.forEach((b) => tray.append(button(`${b.icon} ${b.name} · ${world.inventory[b.id] || 0}`, () => {
        chosen = b.id;
        draw();
      }, `material-${b.id}`, { "aria-pressed": String(chosen === b.id) })));
      controls.append(tray, h("div.bw-toolbar", button("Placera här", () => accept(placeBlock(world, selected.x, selected.y, chosen)), "place"), button("Ångra senaste", () => {
        if (!history.length) {
          message("Inget att ångra ännu.");
          return;
        }
        world = history.pop();
        save();
        draw();
        message("Senaste ändringen ångrades.");
      }, "undo", { disabled: !history.length }), button("Rotera översta", () => accept(rotateBlock(world, selected.x, selected.y)), "rotate"), button("Ta bort översta", () => accept(removeBlock(world, selected.x, selected.y)), "remove")), h("p.bw-hint", "Tryck på ön eller välj rad och kolumn. Ta bort ger tillbaka materialet."));
    }
    const shop = h("details.bw-details", h("summary", "🛍 Materialbutik · bara spelmynt"), h("p", "Du ser priset innan du köper. Inga riktiga pengar används."));
    const catalog = h("div.bw-shop");
    BLOCKS.filter((b) => b.price > 0).forEach((b) => catalog.append(button(`${b.icon} ${b.name} · ${b.price} mynt`, () => {
      pending = b.id;
      purchaseVersion++;
      draw();
    }, `shop-${b.id}`)));
    shop.append(catalog);
    if (pending) {
      const b = item(pending), purchaseToken = purchaseVersion;
      const affordable=kos.canAfford?kos.canAfford(b.price):(profile.coins||0)>=b.price;
      shop.open = true;
      shop.append(h("div.bw-confirm", h("p", `Köp 1 ${b.name.toLowerCase()} för ${b.price} spelmynt? Du har ${profile.coins || 0}. ${affordable?`Efter köpet har du ${(profile.coins||0)-b.price} spelmynt.`:`Det saknas ${b.price-(profile.coins||0)} spelmynt. Du kan fortsätta bygga med startsatsen.`}`), button("Bekräfta köp", () => {
        if (!pending || purchaseVersion !== purchaseToken) return;
        const result = purchaseBlock(world, b.id);
        if (!result.ok) {
          message(result.message);
          return;
        }
        pending = null;
        if (!kos.spend(result.cost)) {
          draw();
          message("Mynten räcker inte. Du kan fortsätta med din gratis startsats.");
          return;
        }
        world = result.state;
        history = [];
        pending = null;
        save();
        draw();
        message(`${b.name} finns nu bland dina material.`);
      }, "confirm",{disabled:!affordable}), button("Avbryt", () => {
        pending = null;
        draw();
      }, "cancel")));
    }
    controls.append(shop);
    controls.append(h("details.bw-details", h("summary", "🏗 Byggskisser från ditt lager"), h("p", `Skissen börjar vid ${selectedText().toLowerCase()}. Välj först en tom startplats. Alla delar tas från ditt lager; hela skissen byggs eller ingenting. Du kan ångra.`), ...BUILD_PLANS.map((plan) => h("article.bw-plan", h("h3", `${plan.icon} ${plan.name}`), h("p", plan.description), h("p", Object.entries(plan.parts.reduce((counts, part) => {
      counts[part.type] = (counts[part.type] || 0) + 1;
      return counts;
    }, {})).map(([id, count]) => `${count} ${item(id)?.name.toLowerCase()}`).join(" · ")), button("Bygg " + plan.name, () => accept(applyBuildPlan(world, plan.id, selected.x, selected.y)), `plan-${plan.id}`)))));
    controls.append(h("details.bw-details", h("summary", "💡 Byggidéer · välj själv"), ...missionProgress(world).map((m) => h("p", `${m.done ? "✓" : "○"} ${m.title}: ${m.description} (${m.current}/${m.target})`))), h("details.bw-details", h("summary", "📚 Öva och tjäna spelmynt"), h("p", "Ditt saldo delas med alla kursappar. Världen sparas när du går och bygger."), h("div.bw-toolbar", ...APPS.filter((app) => !["play", "build-world"].includes(app.id)).map((app) => button(app.name, () => {
      save();
      el.dispatchEvent(new CustomEvent("kos-open", { bubbles: true, detail: { app: app.id } }));
    }, `course-${app.id}`)))));
    // Keep movement and mode controls together immediately below the island.
    const mainToolbar=controls.querySelector('.bw-toolbar');
    const primary=h('div.bw-primary',{'aria-label':'Gå eller bygg'});
    const walkButton=mainToolbar.querySelector('[data-bw-key="walk"]');
    const buildButton=mainToolbar.querySelector('[data-bw-key="build"]');
    primary.append(walkButton,buildButton);
    const secondary=h('details.bw-details.bw-secondary',h('summary','Zoom, spara och hjälp'),mainToolbar);
    const description=controls.querySelector('.bw-heading')?.nextElementSibling;
    const introduction=h('details.bw-details.bw-about',h('summary','Så fungerar din värld'));
    if(description?.tagName==='P')introduction.append(description);
    const navigation=controls.querySelector('.bw-navigation');
    controls.prepend(primary,navigation);
    controls.append(secondary,introduction);
    for (const d of controls.querySelectorAll("details")) if (openDetails.includes(d.querySelector("summary")?.textContent)) d.open = true;
    if (focused) {
      const target = controls.querySelector(`[data-bw-key="${focused}"]`) || controls.querySelector(`[data-bw-key="shop-${chosen}"]`) || controls.querySelector('[data-bw-key="build"]');
      target?.focus({ preventScroll: true });
    }
    paint();
  }
  root.append(canvas, controls, notice, storageNotice);
  el.append(root);
  if (profile.settings?.previewRounds) {
    const plan = h("div.bw-intro", h("h3", "Så går det till"), h("p", "Gå med pilarna eller tryck på ön. Välj Bygg och ett material, välj en ruta och tryck Placera här. Ångra hjälper dig att prova igen. Du kan börja gratis och pausa när du vill."), button("Börja bygga", () => {
      started = true;
      plan.remove();
      draw();
      canvas.focus();
    }, "start"));
    controls.append(plan);
    paint();
  } else draw();
  const unsubscribe = kos.on?.("coins", () => {
    if (alive && started) draw();
  });
  save();
  return () => {
    alive = false;
    save();
    unsubscribe?.();
    document.removeEventListener("keydown", keyboard);
    if (window.render_game_to_text === snapshot) window.render_game_to_text = previousText;
    if (window.advanceTime === advance) window.advanceTime = previousAdvance;
  };
}
export {
  buildWorldView
};
