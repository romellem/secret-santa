import { initSetupPage } from "./pages/setupPage.js";
import { initAdminPage } from "./pages/adminPage.js";
import { renderCurrentPage } from "./router.js";
import { readStateFromHash } from "./urlState.js";
import { replaceApplicationState } from "./state.js";

async function loadStateFromURL() {
  const stateFromURL = await readStateFromHash();
  if (stateFromURL) {
    replaceApplicationState(stateFromURL);
  }
  renderCurrentPage();
}

initSetupPage();
initAdminPage();

window.addEventListener("load", loadStateFromURL);
window.addEventListener("hashchange", loadStateFromURL);
