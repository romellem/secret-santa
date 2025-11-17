import { getApplicationState } from "./state.js";
import { renderAdminPage } from "./pages/adminPage.js";
import { renderIndividualPage, clearIndividualPageEffects } from "./pages/individualPage.js";

function showPage(pageId) {
  document.getElementById("initial-form").classList.add("hidden");
  document.getElementById("admin-page").classList.add("hidden");
  document.getElementById("individual-page").classList.add("hidden");
  document.getElementById(pageId).classList.remove("hidden");
  if (pageId !== "individual-page") {
    clearIndividualPageEffects();
  }
}

export function renderCurrentPage() {
  const state = getApplicationState();
  if (state.page === "admin") {
    showPage("admin-page");
    renderAdminPage(state);
  } else if (state.page === "pairing") {
    showPage("individual-page");
    renderIndividualPage(state);
  } else {
    showPage("initial-form");
  }
}
