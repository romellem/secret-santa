import { readState, stateURL, slug, showLinkError } from "./urlState.js";
import { generatePairings, countHamiltonianCycles } from "./generatePairings.js";

try {
  const state = await readState();
  const list = document.getElementById("pairing-links");
  async function render() {
    document.getElementById("cycle-count").textContent = `Possible valid cycles: ${countHamiltonianCycles(state.participants, state.disallowedPairs)}`;
    list.replaceChildren();
    for (const [giver, receiver] of state.pairings) {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = giver;
      item.append(title);
      const name = slug(giver);
      for (const [label, path] of [["Generic link", "individual/"], ...(name ? [["Special link ✦", `n/${name}/`]] : [])]) {
        const link = document.createElement("a");
        link.href = await stateURL(path, { giver, receiver });
        link.textContent = label;
        item.append(link);
      }
      list.append(item);
    }
  }
  document.getElementById("regenerate-button").addEventListener("click", async () => {
    state.pairings = generatePairings(state.participants, state.disallowedPairs);
    history.replaceState(null, "", await stateURL("admin/", state));
    await render();
  });
  await render();
} catch (error) { console.error(error); showLinkError(); }
