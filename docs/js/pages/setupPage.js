import { replaceApplicationState, getApplicationState } from "../state.js";
import { writeStateToHash } from "../urlState.js";
import { renderCurrentPage } from "../router.js";
import { generatePairings, countHamiltonianCycles } from "../generatePairings.js";

const participantList = document.getElementById("participant-list");
const disallowedList = document.getElementById("disallowed-list");
const setupForm = document.getElementById("setup-form");
const addParticipantButton = document.getElementById("add-participant-button");
const addDisallowedButton = document.getElementById("add-disallowed-button");
const generatePairsButton = document.getElementById("generate-pairs-button");
const errorMessageElement = document.getElementById("error-message");

function getParticipantNames() {
  return Array.from(document.querySelectorAll(".participant-input"))
    .map((input) => input.value.trim())
    .filter((name) => name !== "");
}

function getDisallowedPairs() {
  const pairs = Array.from(document.querySelectorAll(".disallowed-pair"));
  return pairs.map((pair) => {
    const [inputA, inputB] = pair.querySelectorAll(".disallowed-input");
    return [inputA.value.trim(), inputB.value.trim()];
  }).filter(([a, b]) => a !== "" && b !== "" && a !== b);
}

function clearError() {
  errorMessageElement.textContent = "";
  errorMessageElement.classList.add("hidden");
}

function showError(message) {
  errorMessageElement.textContent = message;
  errorMessageElement.classList.remove("hidden");
}

function updateGenerateButtonState() {
  const uniqueParticipantCount = new Set(getParticipantNames()).size;
  generatePairsButton.disabled = uniqueParticipantCount < 2;
}

function createParticipantInput() {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "participant-input";
  input.placeholder = "Name";
  return input;
}

function createDisallowedPairFields() {
  const pairDiv = document.createElement("div");
  pairDiv.className = "disallowed-pair";
  ["Person A", "Person B"].forEach((placeholder) => {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "disallowed-input";
    input.placeholder = placeholder;
    pairDiv.appendChild(input);
  });
  return pairDiv;
}

async function persistStateAndRender(state) {
  replaceApplicationState(state);
  await writeStateToHash(getApplicationState());
  renderCurrentPage();
}

async function handleFormSubmit(event) {
  event.preventDefault();
  clearError();

  const participants = getParticipantNames();
  const disallowedPairs = getDisallowedPairs();
  const pairings = generatePairings(participants, disallowedPairs);

  if (pairings) {
    const cycleCount = countHamiltonianCycles(participants, disallowedPairs).toString();
    await persistStateAndRender({
      page: "admin",
      participants,
      disallowedPairs,
      pairings,
      cycleCount
    });
    return;
  }

  const totalCycles = countHamiltonianCycles(participants, disallowedPairs);
  if (totalCycles === 0n) {
    showError("Unable to generate a valid cycle. Try removing a restriction or adding another participant.");
  } else {
    showError("Something went wrong while generating pairings. Please try again.");
  }
}

export function initSetupPage() {
  addParticipantButton.addEventListener("click", () => {
    const input = createParticipantInput();
    participantList.appendChild(input);
    input.focus();
  });

  addDisallowedButton.addEventListener("click", () => {
    const pairDiv = createDisallowedPairFields();
    disallowedList.appendChild(pairDiv);
    pairDiv.querySelector("input")?.focus();
  });

  participantList.addEventListener("input", updateGenerateButtonState);
  setupForm.addEventListener("submit", handleFormSubmit);
  updateGenerateButtonState();
}
