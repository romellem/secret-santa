import { getApplicationState, updateApplicationState } from "../state.js";
import { serializeStateToBase64, writeStateToHash } from "../urlState.js";
import { generatePairings, countHamiltonianCycles } from "../generatePairings.js";

const pairingLinks = document.getElementById("pairing-links");
const cycleCountElement = document.getElementById("cycle-count");
const regenerateButton = document.getElementById("regenerate-button");

let renderVersion = 0;

function updateCycleCount(state) {
  let cycleCountText = state.cycleCount;
  if (!cycleCountText && (state.participants?.length ?? 0) >= 2) {
    const cycleCount = countHamiltonianCycles(state.participants, state.disallowedPairs || []);
    cycleCountText = cycleCount.toString();
    updateApplicationState({ cycleCount: cycleCountText });
  }

  if (cycleCountText) {
    cycleCountElement.textContent = `Possible valid cycles: ${cycleCountText}`;
    cycleCountElement.classList.remove("hidden");
  } else {
    cycleCountElement.textContent = "";
    cycleCountElement.classList.add("hidden");
  }
}

function createLinkForPairing(giver, receiver, currentRenderVersion) {
  const pairingState = {
    page: "pairing",
    giver,
    receiver
  };

  serializeStateToBase64(pairingState)
    .then((base64) => {
      if (currentRenderVersion !== renderVersion) {
        return;
      }
      const link = document.createElement("a");
      link.href = `#${base64}`;
      link.textContent = `Link for ${giver}`;
      pairingLinks.appendChild(link);
    })
    .catch((error) => {
      console.error("Failed to generate pairing link", error);
    });
}

async function regeneratePairings() {
  const state = getApplicationState();
  if (!state.participants || state.participants.length < 2) {
    return;
  }

  const newPairings = generatePairings(state.participants, state.disallowedPairs || []);
  if (!newPairings) {
    alert("Unable to generate a new valid cycle. Try adjusting the disallowed pairings.");
    return;
  }

  updateApplicationState({
    pairings: newPairings
  });

  if (!state.cycleCount) {
    const cycleCountString = countHamiltonianCycles(state.participants, state.disallowedPairs || []).toString();
    updateApplicationState({ cycleCount: cycleCountString });
  }

  await writeStateToHash(getApplicationState());
  renderAdminPage(getApplicationState());
}

export function renderAdminPage(state) {
  renderVersion += 1;
  const currentRenderVersion = renderVersion;

  pairingLinks.innerHTML = "";
  if (state.pairings) {
    state.pairings.forEach(([giver, receiver]) => {
      createLinkForPairing(giver, receiver, currentRenderVersion);
    });
  }

  updateCycleCount(state);
}

export function initAdminPage() {
  regenerateButton.addEventListener("click", regeneratePairings);
}
