// URLs are relative to the site root, including GitHub Pages project paths.
const root = new URL("../", import.meta.url);
const lzma = new LZMA(new URL("vendor/lzma_worker.js", root).href);

export function slug(name) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export async function stateURL(path, state) {
  // Short keys and indexed pairings avoid repeating names in the admin URL.
  const data = state.participants
    ? { p: state.participants, d: state.disallowedPairs.map(pair => pair.map(n => state.participants.indexOf(n))),
        r: state.participants.map(name => state.participants.indexOf(state.pairings.find(pair => pair[0] === name)[1])) }
    : [state.giver, state.receiver];
  const bytes = await new Promise((resolve, reject) => lzma.compress(JSON.stringify(data), 1,
    (result, error) => error ? reject(error) : resolve(result)));
  const encoded = btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const url = new URL(path, root);
  url.searchParams.set("s", encoded);
  return url.href;
}
export async function readState() {
  const encoded = new URLSearchParams(location.search).get("s");
  if (!encoded) throw new Error("Missing link data");
  const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  const json = await new Promise((resolve, reject) => lzma.decompress(bytes,
    (result, error) => error ? reject(error) : resolve(result)));
  const data = JSON.parse(json);
  if (Array.isArray(data)) return { giver: data[0], receiver: data[1] };
  return { participants: data.p, disallowedPairs: data.d.map(pair => pair.map(i => data.p[i])),
    pairings: data.p.map((name, i) => [name, data.p[data.r[i]]]) };
}
export function showLinkError() {
  document.getElementById("app").innerHTML = '<div class="card"><h1>Oops!</h1><p>This link is missing its Secret Santa details. Please ask for a new link.</p></div>';
}
