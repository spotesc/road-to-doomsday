(() => {
  const WATCHED_KEY = "road-to-doomsday:watched";
  const PREFS_KEY = "road-to-doomsday:prefs";

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
    all: { label: "Everything", short: "All", test: () => true },
    picks: { label: "Disney+ picks", short: "Disney+", test: (t) => t.pick },
    films: { label: "Films", short: "Films", test: (t) => t.kind === "film" },
    shows: { label: "Shows", short: "Shows", test: (t) => t.kind !== "film" },
  };

  const titles = SECTIONS.flatMap((s) => s.items);
  titles.forEach((t, i) => (t.number = i + 1));
  const byId = new Map(titles.map((t) => [t.id, t]));

  const watched = new Set(store.read(WATCHED_KEY, []).filter((id) => byId.has(id)));
  const prefs = { filter: "all", hide: false, ...store.read(PREFS_KEY, {}) };
  if (!FILTERS[prefs.filter]) prefs.filter = "all";

  const $ = (sel) => document.querySelector(sel);
  const list = $("#list");
  const rows = new Map();

  const escape = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const runtime = (m) => {
    const h = Math.floor(m / 60);
    const r = m % 60;
    if (!h) return `${r}m`;
    return r ? `${h}h ${r}m` : `${h}h`;
  };

  const metaText = (t) => {
    const parts = [KINDS[t.kind], t.year];
    if (t.eps) parts.push(`${t.eps} episodes`);
    else if (t.mins && !t.roughly) parts.push(runtime(t.mins));
    return parts.join(" · ");
  };

  const fullTitle = (t) => (t.season ? `${t.title} (Season ${t.season})` : t.title);

  function build() {
    list.innerHTML = SECTIONS.map(
      (s) => `
      <section class="section" id="${s.id}" aria-labelledby="${s.id}-title">
        <div class="section-head">
          <div>
            <p class="kicker">${escape(s.kicker)}</p>
            <h2 id="${s.id}-title">${escape(s.title)}</h2>
            <p class="section-note">${escape(s.note)}</p>
          </div>
          <div class="section-count"><span data-count></span><span class="bar"><i data-bar></i></span></div>
        </div>
        <ol class="items">
          ${s.items.map(row).join("")}
        </ol>
        <p class="empty" data-empty hidden>All watched here.</p>
      </section>`
    ).join("");

    list.querySelectorAll(".item").forEach((li) => rows.set(li.dataset.id, li));

    $("#filters").innerHTML = Object.entries(FILTERS)
      .map(
        ([key, f]) =>
          `<button class="chip" type="button" data-filter="${key}" aria-pressed="false" aria-label="${escape(f.label)}"><span class="long">${escape(f.label)}</span><span class="short">${escape(f.short)}</span><span class="n">${titles.filter(f.test).length}</span></button>`
      )
      .join("");
  }

  function row(t) {
    const num = String(t.number).padStart(2, "0");
    const season = t.season ? ` <span class="season">Season ${t.season}</span>` : "";
    const pick = t.pick ? `<span class="pick" title="On Disney+'s official Doomsday watchlist">Disney+ pick</span>` : "";
    const note = t.note ? `<span class="note">${escape(t.note)}</span>` : "";
    return `
      <li class="item" data-id="${t.id}">
        <label class="row">
          <input class="tick" type="checkbox" aria-label="Watched ${escape(fullTitle(t))}">
          <span class="box" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"/></svg></span>
          <span class="num">${num}</span>
          <span class="body">
            <span class="name">${escape(t.title)}${season}</span>
            <span class="meta"><span>${escape(metaText(t))}</span>${pick}</span>
            ${note}
          </span>
        </label>
      </li>`;
  }

  function daysToGo() {
    const [y, m, d] = RELEASE_DATE.split("-").map(Number);
    const release = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((release - today) / 86400000);
  }

  function update() {
    const filter = FILTERS[prefs.filter];
    const inView = titles.filter(filter.test);
    const done = inView.filter((t) => watched.has(t.id));
    const pct = inView.length ? Math.round((done.length / inView.length) * 100) : 0;
    const minsLeft = inView.filter((t) => !watched.has(t.id)).reduce((sum, t) => sum + (t.mins || 0), 0);

    SECTIONS.forEach((s) => {
      const section = document.getElementById(s.id);
      const matching = s.items.filter(filter.test);
      const seen = matching.filter((t) => watched.has(t.id)).length;
      const shown = [];

      s.items.forEach((t) => {
        const li = rows.get(t.id);
        const isDone = watched.has(t.id);
        const visible = filter.test(t) && !(prefs.hide && isDone);
        li.hidden = !visible;
        li.classList.remove("leaving", "first", "last");
        li.classList.toggle("done", isDone);
        li.querySelector(".tick").checked = isDone;
        if (visible) shown.push(li);
      });

      if (shown.length) {
        shown[0].classList.add("first");
        shown[shown.length - 1].classList.add("last");
      }

      section.hidden = matching.length === 0;
      section.classList.toggle("complete", matching.length > 0 && seen === matching.length);
      section.querySelector("[data-count]").innerHTML = `<b>${seen}</b> / ${matching.length}`;
      section.querySelector("[data-bar]").style.width = matching.length ? `${(seen / matching.length) * 100}%` : "0";
      section.querySelector("[data-empty]").hidden = !(matching.length && !shown.length);
    });

    document.querySelectorAll(".chip").forEach((chip) => {
      chip.setAttribute("aria-pressed", String(chip.dataset.filter === prefs.filter));
    });
    $(".hide").setAttribute("aria-pressed", String(prefs.hide));

    $("#pct").textContent = `${pct}%`;
    $("#pct-bar").style.width = `${pct}%`;
    $("#done-label").textContent = `${done.length} of ${inView.length} watched`;
    $("#mini").innerHTML = `<b>${done.length}</b> of ${inView.length} watched`;
    const [amount, unit] = minsLeft >= 60 ? [Math.round(minsLeft / 60), "h"] : [minsLeft, "min"];
    $("#left").innerHTML = `${amount}<small>${unit}</small>`;

    const next = inView.find((t) => !watched.has(t.id));
    const nextBox = $("#next");
    nextBox.classList.toggle("all-done", !next);
    if (next) {
      nextBox.dataset.id = next.id;
      $("#next-title").textContent = fullTitle(next);
      $("#next-meta").textContent = `No. ${next.number} · ${metaText(next)}`;
    } else {
      delete nextBox.dataset.id;
      $("#next-title").textContent = "All done. You're ready.";
      $("#next-meta").textContent = prefs.filter === "all" ? "See you at the cinema." : "Try another filter, or the whole list.";
    }

    const days = daysToGo();
    const daysText = days > 1 ? `${days} days to go` : days === 1 ? "Out tomorrow" : days === 0 ? "Out today" : "Out now";
    const everything = watched.size === titles.length;
    $("#finale").classList.toggle("ready", everything);
    $("#finale-status").textContent = everything
      ? `All ${titles.length} watched. You're ready for Doomsday.`
      : `${daysText} · ${watched.size} of ${titles.length} watched`;
  }

  function showCountdown() {
    const days = daysToGo();
    const big = $("#days");
    const label = $("#days-label");
    if (days > 1) {
      big.textContent = days;
      label.textContent = "days to Doomsday";
    } else if (days === 1) {
      big.textContent = "1";
      label.textContent = "day to Doomsday";
    } else if (days === 0) {
      big.textContent = "Today";
      label.textContent = "Doomsday is out";
    } else {
      big.textContent = "Out";
      label.textContent = "in cinemas now";
    }
  }

  function save() {
    store.write(WATCHED_KEY, [...watched]);
  }

  function savePrefs() {
    store.write(PREFS_KEY, prefs);
  }

  function setWatched(id, on) {
    if (on) watched.add(id);
    else watched.delete(id);
    save();
    const li = rows.get(id);
    if (on && prefs.hide && li && !li.hidden) {
      li.classList.add("done");
      li.querySelector(".tick").checked = true;
      li.classList.add("leaving");
      setTimeout(update, 450);
    } else {
      update();
    }
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
      ? `I've watched ${watched.size} of ${titles.length} on the road to Avengers: Doomsday. Here's the full list in story order:`
      : "Every Marvel film and series to watch before Avengers: Doomsday, in story order:";
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, text, url });
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

  function jumpTo(id) {
    const li = rows.get(id);
    if (!li) return;
    li.scrollIntoView({ behavior: "smooth", block: "center" });
    li.classList.remove("flash");
    void li.offsetWidth;
    li.classList.add("flash");
  }

  list.addEventListener("change", (e) => {
    if (!e.target.classList.contains("tick")) return;
    setWatched(e.target.closest(".item").dataset.id, e.target.checked);
  });

  document.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) {
      prefs.filter = chip.dataset.filter;
      savePrefs();
      update();
      return;
    }

    const action = e.target.closest("[data-action]")?.dataset.action;
    const nextId = $("#next").dataset.id;
    switch (action) {
      case "share":
        share();
        break;
      case "hide":
        prefs.hide = !prefs.hide;
        savePrefs();
        update();
        break;
      case "jump":
        if (nextId) jumpTo(nextId);
        break;
      case "watch-next":
        if (nextId) {
          setWatched(nextId, true);
          toast(`Ticked off ${fullTitle(byId.get(nextId))}`);
        }
        break;
      case "reset":
        if (watched.size && confirm("Clear all your ticks on this device?")) {
          watched.clear();
          save();
          update();
          toast("Ticks cleared");
        }
        break;
    }
  });

  window.addEventListener("storage", (e) => {
    if (e.key !== WATCHED_KEY) return;
    watched.clear();
    store.read(WATCHED_KEY, []).forEach((id) => byId.has(id) && watched.add(id));
    update();
  });

  build();
  showCountdown();
  update();
})();
