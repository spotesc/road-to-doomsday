import { SECTIONS, FINALE, RELEASE, TIERS } from "./data/titles.js";

const KEYS = {
  watched: "road-to-doomsday:watched",
  prefs: "road-to-doomsday:prefs",
  tmdb: "road-to-doomsday:tmdb",
};

const IMG = "https://image.tmdb.org/t/p/";

const store = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

const KINDS = { film: "Film", series: "Series", special: "Special", animated: "Animated" };

const FILTERS = {
  all: { label: "Everything", test: () => true },
  ess: { label: "Essentials", test: (t) => t.tier === "ess" },
  picks: { label: "Disney+ picks", test: (t) => t.pick },
  films: { label: "Films", test: (t) => t.kind === "film" || t.kind === "special" },
  series: { label: "Series", test: (t) => t.kind === "series" || t.kind === "animated" },
};

const ICONS = {
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.01"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  out: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
};

const titles = SECTIONS.flatMap((s) => s.items.map((t) => ({ ...t, section: s })));
titles.forEach((t, i) => (t.number = i + 1));
const byId = new Map(titles.map((t) => [t.id, t]));
const TOTAL = titles.length;
const releaseAt = new Date(RELEASE);

let info = {};
const watched = new Set(store.read(KEYS.watched, []).filter((id) => byId.has(id)));
const prefs = { filter: "all", hide: false, view: "list", ...store.read(KEYS.prefs, {}) };
if (!FILTERS[prefs.filter]) prefs.filter = "all";
if (!["grid", "list"].includes(prefs.view)) prefs.view = "list";

const $ = (sel, root = document) => root.querySelector(sel);
const list = $("#list");
const rows = new Map();

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const pad = (n) => String(n).padStart(2, "0");

const runtimeText = (m) => {
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (!h) return `${r}m`;
  return r ? `${h}h ${r}m` : `${h}h`;
};

const nameOf = (t) => info[t.id]?.name || t.title;
const fullName = (t) => (t.season ? `${nameOf(t)} (Season ${t.season})` : nameOf(t));
const minsOf = (t) => info[t.id]?.runtime || t.mins || 0;
const epsOf = (t) => info[t.id]?.episodes || t.eps || 0;
const seasonTag = (t) => (t.season ? ` <span class="season">S${t.season}</span>` : "");

function tagsHtml(t) {
  const isShow = t.kind === "series" || t.kind === "animated";
  const length = epsOf(t) ? `${epsOf(t)} eps` : minsOf(t) ? runtimeText(minsOf(t)) : "";
  return [
    `<span class="tag ${t.tier}">${TIERS[t.tier]}</span>`,
    `<span class="tag kind${isShow ? " show" : ""}">${KINDS[t.kind]}</span>`,
    length ? `<span class="tag len" data-len>${length}</span>` : "",
    t.pick ? '<span class="tag pick">Disney+ pick</span>' : "",
  ].join("");
}

const posterImg = (path, sizes) =>
  `<img src="${IMG}w185${path}" srcset="${IMG}w92${path} 92w, ${IMG}w185${path} 185w, ${IMG}w342${path} 342w, ${IMG}w500${path} 500w" sizes="${sizes}" alt="" loading="lazy" decoding="async">`;

const backdropImg = (path, size = "w1280") => `<img src="${IMG}${size}${path}" alt="" decoding="async">`;

const THUMB_SIZES = "(max-width: 600px) 30vw, 200px";

/* Building */

function build() {
  $("#total").textContent = TOTAL;

  $("#filters").innerHTML = Object.entries(FILTERS)
    .map(
      ([key, f]) =>
        `<button class="chip" type="button" data-filter="${key}" aria-pressed="false">${esc(f.label)}<span class="n">${titles.filter(f.test).length}</span></button>`
    )
    .join("");

  $("#segbar").innerHTML = titles
    .map((t, i) => `<i data-seg="${t.id}"${i && titles[i - 1].section !== t.section ? ' class="gap"' : ""}></i>`)
    .join("");

  list.innerHTML = SECTIONS.map(
    (s) => `
    <section class="chapter" id="${s.id}" aria-labelledby="${s.id}-title">
      <header class="shead">
        <div class="sbanner" aria-hidden="true"></div>
        <p class="kicker">${esc(s.kicker)}</p>
        <div class="srow"><h2 id="${s.id}-title">${esc(s.title)}</h2><span class="rule"></span><span class="tally" data-tally></span></div>
        <p class="snote">${esc(s.note)}</p>
      </header>
      <ul class="items">${titles.filter((t) => t.section === s).map(row).join("")}</ul>
      <p class="empty" data-empty hidden>All watched in this part.</p>
    </section>`
  ).join("");

  list.querySelectorAll(".item").forEach((li) => rows.set(li.dataset.id, li));
}

function row(t) {
  return `
    <li class="item" data-id="${t.id}">
      <button class="box" type="button" data-action="tick" aria-pressed="false" aria-label="Watched ${esc(fullName(t))}">${ICONS.check}</button>
      <button class="thumb" type="button" data-action="open" aria-label="${esc(fullName(t))}: details">
        <span class="fallback">${esc(t.title)}</span>
      </button>
      <span class="num" aria-hidden="true">${pad(t.number)}</span>
      <div class="body">
        <div class="ttl"><span data-name>${esc(t.title)}</span>${seasonTag(t)} <span class="yr">· ${t.year}</span></div>
        <div class="why">${esc(t.why)}</div>
        <div class="tags">${tagsHtml(t)}</div>
      </div>
      <span class="idx" aria-hidden="true">${pad(t.number)}</span>
      <button class="more" type="button" data-action="open" aria-label="${esc(fullName(t))}: details">${ICONS.chevron}</button>
    </li>`;
}

/* TMDB details */

function paint() {
  titles.forEach((t) => {
    const li = rows.get(t.id);
    const i = info[t.id];
    if (!li || !i) return;
    const thumb = li.querySelector(".thumb");
    if (i.poster && !thumb.querySelector("img")) thumb.insertAdjacentHTML("afterbegin", posterImg(i.poster, THUMB_SIZES));
    li.querySelector("[data-name]").textContent = nameOf(t);
    const len = li.querySelector("[data-len]");
    if (len) len.textContent = epsOf(t) ? `${epsOf(t)} eps` : runtimeText(minsOf(t));
  });

  SECTIONS.forEach((s) => {
    const path = info[s.cover]?.backdrop;
    const holder = document.querySelector(`#${s.id} .sbanner`);
    if (path && holder && !holder.querySelector("img")) holder.innerHTML = backdropImg(path, "w1280");
  });

  const finale = info[FINALE.id];
  const bg = $("#finale-bg");
  if (finale?.backdrop && !bg.querySelector("img")) bg.innerHTML = backdropImg(finale.backdrop);

  nextKey = "";
  update();
}

/* State */

let nextKey = "";

function update() {
  const filter = FILTERS[prefs.filter];
  const inView = titles.filter(filter.test);
  const seenInView = inView.filter((t) => watched.has(t.id)).length;

  list.dataset.view = prefs.view;

  SECTIONS.forEach((s) => {
    const section = document.getElementById(s.id);
    const matching = s.items.filter(filter.test);
    const seen = matching.filter((t) => watched.has(t.id)).length;
    let shown = 0;

    s.items.forEach((t) => {
      const li = rows.get(t.id);
      const done = watched.has(t.id);
      const visible = filter.test(t) && !(prefs.hide && done);
      li.hidden = !visible;
      li.classList.remove("leaving");
      li.classList.toggle("done", done);
      li.querySelector(".box").setAttribute("aria-pressed", String(done));
      if (visible) shown++;
    });

    section.hidden = matching.length === 0;
    section.classList.toggle("complete", matching.length > 0 && seen === matching.length);
    section.querySelector("[data-tally]").innerHTML = `<b>${seen}</b>/${matching.length}`;
    section.querySelector("[data-empty]").hidden = !(matching.length && !shown);
  });

  document.querySelectorAll("#segbar i").forEach((seg) => seg.classList.toggle("on", watched.has(seg.dataset.seg)));
  document.querySelectorAll(".chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.filter === prefs.filter)));
  document.querySelectorAll(".views button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === prefs.view)));
  $(".hide").setAttribute("aria-pressed", String(prefs.hide));
  $("#mini").innerHTML = `<b>${seenInView}</b> of ${inView.length} watched`;

  const pct = Math.round((watched.size / TOTAL) * 100);
  $("#done").textContent = watched.size;
  $("#pct").textContent = `${pct}% complete`;
  $("#essleft").textContent = titles.filter((t) => t.tier === "ess" && !watched.has(t.id)).length;

  const minsLeft = titles.filter((t) => !watched.has(t.id)).reduce((sum, t) => sum + minsOf(t), 0);
  const hoursLeft = minsLeft / 60;
  const daysLeft = (releaseAt - Date.now()) / 86400000;
  $("#rt").textContent = `${Math.round(hoursLeft)}h`;
  $("#pace").textContent = !minsLeft ? "Done" : daysLeft > 0 ? `${(hoursLeft / daysLeft).toFixed(1)}h a day` : "–";

  renderNext(inView);

  const everything = watched.size === TOTAL;
  $("#finale").classList.toggle("ready", everything);
  const days = Math.ceil(daysLeft);
  $("#finale-status").textContent = everything
    ? `All ${TOTAL} watched. You're ready.`
    : `${days > 0 ? `${days} days to go` : "Out now"} · ${watched.size} of ${TOTAL} watched`;

  if (sheet.open) refreshSheetState();
}

function renderNext(inView) {
  const next = inView.find((t) => !watched.has(t.id));
  const key = next ? `${next.id}:${info[next.id] ? 1 : 0}` : `done:${prefs.filter}`;
  if (key === nextKey) return;
  nextKey = key;
  const box = $("#next");

  if (!next) {
    box.classList.add("all-done");
    delete box.dataset.id;
    const whole = prefs.filter === "all";
    box.innerHTML = `
      <div class="next-body">
        <p class="next-k">${whole ? "Road complete" : "All done here"}</p>
        <h2 class="next-title">${whole ? "You're ready for Doomsday" : "Nothing left in this filter"}</h2>
        <p class="next-why">${whole ? "Every stop ticked. See you at the cinema on 16 December." : "Pick another filter to keep going."}</p>
      </div>`;
    return;
  }

  const i = info[next.id] || {};
  box.classList.remove("all-done");
  box.dataset.id = next.id;
  box.innerHTML = `
    <div class="next-bg" aria-hidden="true">${i.backdrop ? backdropImg(i.backdrop) : ""}</div>
    <button class="next-poster" type="button" data-action="open" data-id="${next.id}" aria-label="${esc(fullName(next))}: details">${i.poster ? posterImg(i.poster, "150px") : ""}</button>
    <div class="next-body">
      <div class="next-head">
        <p class="next-k">Up next<span>No. ${pad(next.number)} of ${TOTAL}</span></p>
        <h2 class="next-title">${esc(nameOf(next))}${seasonTag(next)}</h2>
        <p class="next-why">${esc(next.why)}</p>
        ${i.overview ? `<p class="next-overview">${esc(i.overview)}</p>` : ""}
      </div>
      <div class="next-actions">
        <button class="btn btn-go" type="button" data-action="tick" data-id="${next.id}">${ICONS.check}<span>Mark watched</span></button>
        ${i.trailer ? `<a class="btn" href="https://www.youtube.com/watch?v=${esc(i.trailer)}" target="_blank" rel="noopener">${ICONS.play}<span>Trailer</span></a>` : ""}
        <button class="btn" type="button" data-action="open" data-id="${next.id}">${ICONS.info}<span>Details</span></button>
      </div>
    </div>`;
}

/* Detail sheet */

const sheet = $("#sheet");
let sheetId = null;

function openSheet(id) {
  const t = byId.get(id);
  if (!t) return;
  sheetId = id;
  const i = info[id] || {};
  const index = titles.indexOf(t);
  const prev = titles[index - 1];
  const next = titles[index + 1];
  const extra = [];
  if (i.rating) extra.push(`<span class="tag">TMDB ★ ${i.rating.toFixed(1)}</span>`);
  (i.genres || []).slice(0, 2).forEach((g) => extra.push(`<span class="tag">${esc(g)}</span>`));

  sheet.innerHTML = `
    <div class="sheet-hero">
      ${i.backdrop ? backdropImg(i.backdrop) : ""}
      <button class="sheet-close" type="button" data-action="close" aria-label="Close">${ICONS.close}</button>
    </div>
    <div class="sheet-body">
      <div class="sheet-poster">${i.poster ? `<img src="${IMG}w342${i.poster}" alt="">` : ""}</div>
      <div class="sheet-head">
        <p class="sheet-k">No. ${pad(t.number)} of ${TOTAL} · ${esc(t.section.title)}</p>
        <h2 id="sheet-title">${esc(nameOf(t))}${seasonTag(t)}</h2>
        ${i.tagline ? `<p class="tagline">${esc(i.tagline)}</p>` : `<p class="tagline">${t.year}</p>`}
      </div>
      <div class="sheet-main">
        <div class="tags">${tagsHtml(t)}<span class="tag">${t.year}</span>${extra.join("")}</div>
        <p class="why-box"><b>Why watch it</b>${esc(t.why)}</p>
        ${i.overview ? `<p class="overview">${esc(i.overview)}</p>` : ""}
        <div class="sheet-actions">
          <button class="btn" type="button" data-action="tick" data-id="${t.id}" data-sheet-tick></button>
          ${i.trailer ? `<a class="btn" href="https://www.youtube.com/watch?v=${esc(i.trailer)}" target="_blank" rel="noopener">${ICONS.play}<span>Trailer</span></a>` : ""}
          ${i.link ? `<a class="btn" href="${esc(i.link)}" target="_blank" rel="noopener">${ICONS.out}<span>TMDB</span></a>` : ""}
        </div>
      </div>
    </div>
    <nav class="sheet-nav" aria-label="Story order">
      <button type="button" data-action="open" data-id="${prev?.id || ""}" ${prev ? "" : "disabled"}><small>Before this</small><span>${prev ? esc(fullName(prev)) : ""}</span></button>
      <button type="button" data-action="open" data-id="${next?.id || ""}" ${next ? "" : "disabled"}><small>After this</small><span>${next ? esc(fullName(next)) : ""}</span></button>
    </nav>`;

  refreshSheetState();
  if (!sheet.open) {
    sheet.showModal();
    document.documentElement.classList.add("locked");
  }
  sheet.scrollTop = 0;
}

function refreshSheetState() {
  const btn = sheet.querySelector("[data-sheet-tick]");
  if (!btn || !sheetId) return;
  const done = watched.has(sheetId);
  btn.className = `btn ${done ? "btn-done" : "btn-go"}`;
  btn.innerHTML = `${ICONS.check}<span>${done ? "Watched · undo" : "Mark watched"}</span>`;
}

sheet.addEventListener("close", () => {
  document.documentElement.classList.remove("locked");
  sheetId = null;
});

sheet.addEventListener("click", (e) => {
  if (e.target === sheet) sheet.close();
});

/* Actions */

function save() {
  store.write(KEYS.watched, [...watched]);
}

function savePrefs() {
  store.write(KEYS.prefs, prefs);
}

function toggle(id, on = !watched.has(id)) {
  if (on) watched.add(id);
  else watched.delete(id);
  save();

  const li = rows.get(id);
  const box = li?.querySelector(".box");
  if (on && box) {
    box.classList.remove("ping");
    void box.offsetWidth;
    box.classList.add("ping");
  }
  const seg = document.querySelector(`#segbar [data-seg="${id}"]`);
  if (on && seg) {
    seg.classList.remove("flash");
    void seg.offsetWidth;
    seg.classList.add("flash");
  }

  if (on && prefs.hide && li && !li.hidden) {
    li.classList.add("done", "leaving");
    setTimeout(update, 450);
  } else {
    update();
  }
  return on;
}

let toastTimer;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

async function share() {
  const url = location.origin + location.pathname;
  const text = watched.size
    ? `I've watched ${watched.size} of ${TOTAL} on the road to Avengers: Doomsday. Here's the full list in story order:`
    : "Every Marvel film and series to watch before Avengers: Doomsday, in story order:";
  if (navigator.share) {
    try {
      await navigator.share({ title: "Road to Doomsday", text, url });
    } catch {}
    return;
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    toast("Link copied");
  } catch {
    toast(url);
  }
}

document.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (chip) {
    prefs.filter = chip.dataset.filter;
    savePrefs();
    update();
    return;
  }

  const view = e.target.closest(".views [data-view]");
  if (view) {
    prefs.view = view.dataset.view;
    savePrefs();
    update();
    return;
  }

  const el = e.target.closest("[data-action]");
  const item = e.target.closest(".item");

  if (!el && item) {
    toggle(item.dataset.id);
    return;
  }
  if (!el) return;

  const id = el.dataset.id || item?.dataset.id;

  switch (el.dataset.action) {
    case "tick": {
      if (!id) break;
      const on = toggle(id);
      if (el.closest(".next") || el.closest(".sheet")) toast(on ? `Ticked off ${fullName(byId.get(id))}` : "Unticked");
      break;
    }
    case "open":
      if (id) openSheet(id);
      break;
    case "close":
      sheet.close();
      break;
    case "share":
      share();
      break;
    case "hide":
      prefs.hide = !prefs.hide;
      savePrefs();
      update();
      break;
    case "reset":
      if (watched.size && confirm("Clear all your ticks on this device?")) {
        watched.clear();
        save();
        update();
        toast("List reset");
      }
      break;
  }
});

document.addEventListener("keydown", (e) => {
  if (!sheet.open || !sheetId) return;
  const index = titles.findIndex((t) => t.id === sheetId);
  if (e.key === "ArrowRight" && titles[index + 1]) openSheet(titles[index + 1].id);
  if (e.key === "ArrowLeft" && titles[index - 1]) openSheet(titles[index - 1].id);
});

document.addEventListener("load", (e) => e.target.tagName === "IMG" && e.target.classList.add("loaded"), true);
document.addEventListener("error", (e) => e.target.tagName === "IMG" && e.target.closest(".thumb, .next-poster") && e.target.remove(), true);

window.addEventListener("storage", (e) => {
  if (e.key !== KEYS.watched) return;
  watched.clear();
  store.read(KEYS.watched, []).forEach((id) => byId.has(id) && watched.add(id));
  update();
});

/* Countdown */

function tickClock() {
  let left = Math.max(0, Math.floor((releaseAt - Date.now()) / 1000));
  const d = Math.floor(left / 86400);
  left %= 86400;
  const h = Math.floor(left / 3600);
  left %= 3600;
  const m = Math.floor(left / 60);
  const s = left % 60;
  const values = { d: String(d), h: pad(h), m: pad(m), s: pad(s) };
  document.querySelectorAll(".counts [data-unit]").forEach((el) => {
    const v = values[el.dataset.unit];
    if (el.textContent !== v) el.textContent = v;
  });
}

/* Reveal on scroll */

function reveal() {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.classList.add("reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -6% 0px" }
  );
  rows.forEach((li) => io.observe(li));
}

/* TMDB */

async function loadInfo() {
  const cached = store.read(KEYS.tmdb, null);
  if (cached?.titles) {
    info = cached.titles;
    paint();
  }
  try {
    const res = await fetch("/api/tmdb");
    if (!res.ok) return;
    const data = await res.json();
    if (!data?.titles || !Object.keys(data.titles).length) return;
    info = data.titles;
    store.write(KEYS.tmdb, { saved: Date.now(), titles: info });
    paint();
  } catch {}
}

build();
update();
tickClock();
setInterval(tickClock, 1000);
reveal();
loadInfo();
