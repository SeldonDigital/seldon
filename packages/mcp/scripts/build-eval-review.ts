/**
 * Generates eval-review.html — a self-contained visual review UI for the
 * human-authorship pass over the search eval set
 * (src/search-eval-set.ts). Rerun this whenever the eval set, the shipped
 * search index, or the tag overlays change, so the review reflects live
 * search behavior. The output is gitignored (a generated aid, not a source
 * file) and safe to regenerate at any time — localStorage annotations in
 * the browser are keyed by pair/icon id, not by file content, so they
 * survive a regeneration.
 *
 * Per pair: query, live top-8 and gold list with REAL icon glyphs AND the
 * tags each entry carries (the vocabulary that powers both search layers).
 * Per icon: click "+ tag" to append tags, and a note field for why a result
 * worked or failed. Export downloads pair verdicts + icon annotations as
 * JSON for the tag-curation pass.
 *
 * Usage: npm run build:eval-review
 */
import fs from "node:fs"
import { register } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

register(new URL("../src/runtime/hooks.mjs", import.meta.url))

const { searchCatalogIndex, selectTopResults, getCatalogEntries } =
  await import("../src/catalog-search")
const { createSemanticSearchProvider } = await import("../src/semantic-search")
const { SEARCH_EVAL_SET } = await import("../src/search-eval-set")
const { ICON_TAGS } = await import("../src/icon-tags")
const { catalog } = await import("@seldon/core/components/catalog/index")

const CATALOG_DIR = fileURLToPath(
  new URL("../../core/icon-sets/catalog/", import.meta.url),
)

// ---- Tag lookup -------------------------------------------------------------
const componentTags = new Map<string, string[]>(
  Object.values(catalog)
    .flat()
    .map((schema) => [schema.id, schema.tags as string[]]),
)
function tagsFor(id: string, kind: string): string[] {
  if (kind === "icon") return [...(ICON_TAGS[id] ?? [])]
  if (kind === "component") return componentTags.get(id) ?? []
  return []
}

// ---- Icon glyph extraction --------------------------------------------------
const iconFiles = new Map<string, string>()
;(function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.startsWith("Icon") && entry.name.endsWith(".tsx")) {
      const key = entry.name
        .slice(4, -4)
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase()
      iconFiles.set(key, full)
    }
  }
})(CATALOG_DIR)

const svgCache = new Map<string, string | null>()
function svgFor(iconId: string): string | null {
  if (svgCache.has(iconId)) return svgCache.get(iconId)!
  const key = iconId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
  const file = iconFiles.get(key)
  let svg: string | null = null
  if (file) {
    const source = fs.readFileSync(file, "utf8")
    const match = source.match(/<svg[\s\S]*<\/svg>/)
    if (match) {
      svg = match[0]
        .replace(/\{\.\.\.props\}/g, "")
        .replace(/height="1em"/g, "")
        .replace(/width="1em"/g, "")
    }
  }
  svgCache.set(iconId, svg)
  return svg
}

// ---- Build pair data --------------------------------------------------------
const kinds = new Map(getCatalogEntries().map((e) => [e.id, e.kind]))
const intents = new Map(getCatalogEntries().map((e) => [e.id, e.intent]))
const provider = createSemanticSearchProvider()

function toItem(id: string, kind: string, score?: number) {
  return {
    id,
    kind,
    intent: intents.get(id) ?? "",
    ...(score !== undefined ? { score } : {}),
    tags: tagsFor(id, kind),
    svg: kind === "icon" ? svgFor(id) : null,
  }
}

const pairs = [] as Array<Record<string, unknown>>
let misses = 0
for (const [i, pair] of SEARCH_EVAL_SET.entries()) {
  const scores = (await provider.scoreQuery(pair.query, pair.kind)) ?? undefined
  const all = searchCatalogIndex(pair.query, pair.kind, scores)
  const top = selectTopResults(all, 8, !pair.kind)
  const hit = top.some((r) => pair.expected.includes(r.id))
  if (!hit) misses++
  pairs.push({
    n: i + 1,
    query: pair.query,
    kind: pair.kind ?? null,
    note: pair.note ?? null,
    hit,
    goldIds: pair.expected,
    gold: pair.expected.map((id) => toItem(id, kinds.get(id) ?? "?")),
    results: top.map((r) => ({
      ...toItem(r.id, r.kind, r.score),
      gold: pair.expected.includes(r.id),
    })),
  })
}

// ---- HTML --------------------------------------------------------------------
const data = JSON.stringify({ pairs, misses, total: pairs.length })
const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Seldon search eval review</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root {
    --bg: #f6f7f9; --card: #fff; --ink: #1c2330; --muted: #667085;
    --line: #e4e7ec; --ok: #087443; --okbg: #e6f4ec; --bad: #b42318;
    --badbg: #fdecea; --gold: #b8860b; --goldbg: #fdf6e3; --accent: #3538cd;
    --add: #0e7090; --addbg: #e0f2f7;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink);
    font: 15px/1.5 -apple-system, "SF Pro Text", Segoe UI, sans-serif; }
  header { position: sticky; top: 0; z-index: 5; background: #fffffff2;
    backdrop-filter: blur(6px); border-bottom: 1px solid var(--line);
    padding: 10px 20px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  header h1 { font-size: 15px; margin: 0 8px 0 0; }
  .pill { border: 1px solid var(--line); border-radius: 999px; padding: 3px 12px;
    background: var(--card); cursor: pointer; font-size: 13px; }
  .pill.active { background: var(--accent); border-color: var(--accent); color: #fff; }
  .spacer { flex: 1; }
  #progress { font-size: 13px; color: var(--muted); }
  button.export { background: var(--accent); color: #fff; border: 0;
    border-radius: 8px; padding: 7px 14px; font-size: 13px; cursor: pointer; }
  main { max-width: 1180px; margin: 0 auto; padding: 18px 20px 80px; }
  .pair { background: var(--card); border: 1px solid var(--line);
    border-radius: 12px; padding: 16px 18px; margin: 14px 0; }
  .pair.flagged { border-color: var(--bad); box-shadow: 0 0 0 1px var(--bad); }
  .pair.approved { border-color: var(--ok); }
  .row { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; }
  .q { font-size: 17px; font-weight: 650; }
  .tagchip { font-size: 11px; font-weight: 600; letter-spacing: .3px; padding: 2px 8px;
    border-radius: 999px; text-transform: uppercase; }
  .tagchip.hit { background: var(--okbg); color: var(--ok); }
  .tagchip.miss { background: var(--badbg); color: var(--bad); }
  .tagchip.kindf { background: #eef2ff; color: var(--accent); }
  .tagchip.expanded { background: var(--goldbg); color: var(--gold); }
  .authnote { margin: 6px 0 0; font-size: 13px; color: var(--gold); }
  h4 { margin: 14px 0 6px; font-size: 12px; text-transform: uppercase;
    letter-spacing: .5px; color: var(--muted); }
  .items { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 8px; }
  .item { border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px;
    background: #fafbfc; }
  .item.gold { background: var(--goldbg); border-color: #e7cf8c; }
  .item.annotated { border-color: var(--add); }
  .ihead { display: flex; align-items: center; gap: 8px; }
  .ihead svg { width: 26px; height: 26px; flex: none; }
  .glyphless { width: 26px; height: 26px; flex: none; border-radius: 6px;
    background: #eef2ff; color: var(--accent); display: flex; align-items: center;
    justify-content: center; font-size: 9px; font-weight: 700; }
  .ihead .id { font: 600 12px/1.3 ui-monospace, monospace; word-break: break-all; }
  .ihead .sub { font-size: 11px; color: var(--muted); }
  .tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .tag { font-size: 10.5px; padding: 1px 7px; border-radius: 999px;
    background: #eef1f5; color: #475467; border: 1px solid var(--line); }
  .tag.added { background: var(--addbg); color: var(--add); border-color: var(--add);
    cursor: pointer; }
  .tag.added::after { content: " ×"; }
  .addtag { font-size: 10.5px; padding: 1px 7px; border-radius: 999px; cursor: pointer;
    background: var(--card); color: var(--accent); border: 1px dashed var(--accent); }
  input.taginput { font-size: 11px; padding: 1px 6px; width: 90px;
    border: 1px solid var(--accent); border-radius: 999px; }
  input.iconnote { width: 100%; margin-top: 6px; border: 1px solid var(--line);
    border-radius: 6px; padding: 3px 8px; font-size: 12px; background: #fff; }
  input.iconnote::placeholder { color: #b6bcc8; }
  .controls { display: flex; gap: 8px; margin-top: 14px; align-items: center; }
  .controls button { border: 1px solid var(--line); background: var(--card);
    border-radius: 8px; padding: 6px 14px; font-size: 13px; cursor: pointer; }
  .controls button.on-ok { background: var(--okbg); border-color: var(--ok); color: var(--ok); }
  .controls button.on-flag { background: var(--badbg); border-color: var(--bad); color: var(--bad); }
  .controls input { flex: 1; border: 1px solid var(--line); border-radius: 8px;
    padding: 6px 10px; font-size: 13px; }
</style>
<header>
  <h1>Search eval review</h1>
  <span class="pill filter active" data-f="all">All</span>
  <span class="pill filter" data-f="miss">Misses</span>
  <span class="pill filter" data-f="noted">Gold expansions</span>
  <span class="pill filter" data-f="open">Unreviewed</span>
  <span class="pill filter" data-f="flagged">Flagged</span>
  <span class="pill filter" data-f="annotated">Icon annotations</span>
  <span class="spacer"></span>
  <span id="progress"></span>
  <button class="export" onclick="exportDecisions()">Export decisions</button>
</header>
<main id="main"></main>
<script>
const DATA = ${data};
const KEY = "seldon-eval-review-v2";
const state = JSON.parse(localStorage.getItem(KEY) || "null") || { pairs: {}, icons: {} };
// migrate v1 (pair verdicts only)
try {
  const v1 = JSON.parse(localStorage.getItem("seldon-eval-review-v1") || "null");
  if (v1 && !localStorage.getItem(KEY)) state.pairs = v1;
} catch (e) {}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); progress(); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function iconState(id) { return state.icons[id] || { tags: [], note: "" }; }
function isAnnotated(id) { const s = iconState(id); return s.tags.length > 0 || !!s.note; }

let tagEditing = null; // entry id whose "+tag" input is open

function itemHtml(it, pairN) {
  const s = iconState(it.id);
  const glyph = it.svg ? it.svg
    : '<div class="glyphless">' + esc(it.kind.slice(0, 4)) + '</div>';
  const score = it.score !== undefined ? it.score.toFixed(3) + ' · ' : '';
  const baseTags = it.tags.map(t => '<span class="tag">' + esc(t) + '</span>').join("");
  const addedTags = s.tags.map(t =>
    '<span class="tag added" title="click to remove" onclick="removeTag(\\'' + esc(it.id) + '\\',\\'' + esc(t) + '\\')">' + esc(t) + '</span>').join("");
  const editKey = pairN + ":" + it.id;
  const adder = tagEditing === editKey
    ? '<input class="taginput" id="taginput" placeholder="new tag ⏎" ' +
      'onkeydown="if(event.key===\\'Enter\\')commitTag(\\'' + esc(it.id) + '\\',this.value);' +
      'if(event.key===\\'Escape\\'){tagEditing=null;render()}" onblur="tagEditing=null;render()">'
    : '<span class="addtag" onclick="openTag(\\'' + esc(editKey) + '\\')">+ tag</span>';
  return '<div class="item' + (it.gold ? ' gold' : '') + (isAnnotated(it.id) ? ' annotated' : '') + '">'
    + '<div class="ihead">' + glyph
    + '<div><div class="id">' + esc(it.id) + '</div>'
    + '<div class="sub">' + score + esc(it.intent) + '</div></div></div>'
    + '<div class="tags">' + baseTags + addedTags + adder + '</div>'
    + '<input class="iconnote" placeholder="why did this work / fail?" value="' + esc(s.note) + '"'
    + ' onchange="iconNote(\\'' + esc(it.id) + '\\', this.value)">'
    + '</div>';
}
function render() {
  const f = document.querySelector(".filter.active").dataset.f;
  document.getElementById("main").innerHTML = DATA.pairs.filter(p => {
    const d = state.pairs[p.n] || {};
    if (f === "miss") return !p.hit;
    if (f === "noted") return !!p.note;
    if (f === "open") return !d.verdict;
    if (f === "flagged") return d.verdict === "flagged";
    if (f === "annotated")
      return [...p.results, ...p.gold].some(it => isAnnotated(it.id));
    return true;
  }).map(p => {
    const d = state.pairs[p.n] || {};
    return '<section class="pair ' + (d.verdict || '') + '" id="p' + p.n + '">'
      + '<div class="row">'
      + '<span class="tagchip ' + (p.hit ? 'hit">hit' : 'miss">miss') + '</span>'
      + '<span class="q">' + p.n + '. “' + esc(p.query) + '”</span>'
      + (p.kind ? '<span class="tagchip kindf">' + p.kind + '</span>' : '')
      + (p.note ? '<span class="tagchip expanded">note</span>' : '')
      + '</div>'
      + (p.note ? '<p class="authnote">✎ ' + esc(p.note) + '</p>' : '')
      + '<h4>Top 8 returned (gold hits highlighted)</h4>'
      + '<div class="items">' + p.results.map(it => itemHtml(it, p.n)).join("") + '</div>'
      + '<h4>Gold — any of these in the top 8 counts as a hit</h4>'
      + '<div class="items">' + p.gold.map(it => itemHtml(it, p.n)).join("") + '</div>'
      + '<div class="controls">'
      + '<button class="' + (d.verdict === "approved" ? "on-ok" : "") + '" onclick="verdict(' + p.n + ',\\'approved\\')">✓ Approve</button>'
      + '<button class="' + (d.verdict === "flagged" ? "on-flag" : "") + '" onclick="verdict(' + p.n + ',\\'flagged\\')">⚑ Flag</button>'
      + '<input placeholder="pair notes: reword / add X to gold / drop Y…" value="' + esc(d.note || "") + '" onchange="pairNote(' + p.n + ', this.value)">'
      + '</div></section>';
  }).join("") || '<p style="color:var(--muted)">Nothing in this filter.</p>';
  const input = document.getElementById("taginput");
  if (input) input.focus();
}
function verdict(n, v) {
  state.pairs[n] = state.pairs[n] || {};
  state.pairs[n].verdict = state.pairs[n].verdict === v ? null : v;
  save(); render();
}
function pairNote(n, text) { state.pairs[n] = state.pairs[n] || {}; state.pairs[n].note = text; save(); }
function openTag(editKey) { tagEditing = editKey; render(); }
function commitTag(id, value) {
  const tag = value.trim().toLowerCase();
  if (tag) {
    state.icons[id] = state.icons[id] || { tags: [], note: "" };
    if (!state.icons[id].tags.includes(tag)) state.icons[id].tags.push(tag);
  }
  tagEditing = null; save(); render();
}
function removeTag(id, tag) {
  const s = state.icons[id];
  if (s) { s.tags = s.tags.filter(t => t !== tag); save(); render(); }
}
function iconNote(id, text) {
  state.icons[id] = state.icons[id] || { tags: [], note: "" };
  state.icons[id].note = text; save(); render();
}
function progress() {
  const done = DATA.pairs.filter(p => (state.pairs[p.n] || {}).verdict).length;
  const flagged = DATA.pairs.filter(p => (state.pairs[p.n] || {}).verdict === "flagged").length;
  const annotated = Object.entries(state.icons).filter(([, s]) => s.tags.length || s.note).length;
  document.getElementById("progress").textContent =
    done + "/" + DATA.total + " reviewed · " + flagged + " flagged · "
    + annotated + " icons annotated · " + DATA.misses + " misses";
}
function exportDecisions() {
  const out = {
    pairs: DATA.pairs.map(p => ({
      n: p.n, query: p.query,
      verdict: (state.pairs[p.n] || {}).verdict || "unreviewed",
      note: (state.pairs[p.n] || {}).note || "",
    })),
    icons: Object.entries(state.icons)
      .filter(([, s]) => s.tags.length || s.note)
      .map(([id, s]) => ({ id, addedTags: s.tags, note: s.note })),
  };
  const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "eval-review-decisions.json";
  a.click();
}
document.querySelectorAll(".filter").forEach(el => el.onclick = () => {
  document.querySelector(".filter.active").classList.remove("active");
  el.classList.add("active"); render();
});
render(); progress();
</script>
</html>`

const out = fileURLToPath(new URL("../eval-review.html", import.meta.url))
fs.writeFileSync(out, html)
console.log(
  `wrote ${out} — ${pairs.length} pairs, ${misses} misses, ` +
    `${Math.round(html.length / 1024)} KB`,
)
