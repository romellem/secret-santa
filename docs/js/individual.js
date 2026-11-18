import { readState, showLinkError } from "./urlState.js";
import { renderIndividualPage } from "./pages/individualPage.js";
try {
  const state = await readState();
  if (!state.giver || !state.receiver) throw new Error("Invalid pairing");
  renderIndividualPage(state);
} catch (error) { console.error(error); showLinkError(); }
