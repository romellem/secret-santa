export function renderIndividualPage(state) {
  document.getElementById("person-name").textContent = state.giver || "";
  document.getElementById("pairing-name").textContent = state.receiver || "";
}
