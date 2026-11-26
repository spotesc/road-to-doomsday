export const SITE_URL = "https://doomsdaycountdown.vercel.app";

const OLD_HOSTS = ["spotesc-doomsday.vercel.app", "road-to-doomsday-rho.vercel.app"];
const CARRIED_KEYS = ["watched", "prefs", "audio"];

function moveVisitor(site: string, oldHosts: string[], keys: string[]) {
  const prefix = "road-to-doomsday:";

  if (oldHosts.indexOf(location.hostname) !== -1) {
    const data: Record<string, string> = {};
    try {
      keys.forEach((key) => {
        const value = localStorage.getItem(prefix + key);
        if (value !== null) data[key] = value;
      });
    } catch {}
    const carry = Object.keys(data).length ? "#carry=" + encodeURIComponent(JSON.stringify(data)) : "";
    location.replace(site + location.pathname + location.search + carry);
    return;
  }

  if (location.hash.indexOf("#carry=") !== 0) return;
  try {
    const raw = decodeURIComponent(location.hash.slice(7));
    if (raw.length < 8000) {
      const data = JSON.parse(raw) as Record<string, string>;
      const incoming = JSON.parse(data.watched || "[]");
      if (Array.isArray(incoming)) {
        const current = JSON.parse(localStorage.getItem(prefix + "watched") || "[]");
        const merged = (Array.isArray(current) ? current : []).concat(incoming).filter(
          (id: unknown, i: number, all: unknown[]) => typeof id === "string" && id.length < 80 && all.indexOf(id) === i
        );
        localStorage.setItem(prefix + "watched", JSON.stringify(merged.slice(0, 200)));
      }
      ["prefs", "audio"].forEach((key) => {
        if (!data[key] || localStorage.getItem(prefix + key) !== null) return;
        const value = JSON.parse(data[key]);
        if (value && typeof value === "object" && !Array.isArray(value)) localStorage.setItem(prefix + key, JSON.stringify(value));
      });
    }
  } catch {}
  history.replaceState(null, "", location.pathname + location.search);
}

export const moveScript = `(${moveVisitor.toString()})(${JSON.stringify(SITE_URL)}, ${JSON.stringify(OLD_HOSTS)}, ${JSON.stringify(CARRIED_KEYS)});`;
