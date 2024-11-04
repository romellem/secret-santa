// Initialize LZMA
const lzma = new LZMA("lzma_worker.js");

// Application state
let applicationState = {
  participants: [],
  disallowedPairs: []
};

// Utility function to compress state and update URL
function updateURLWithState(state) {
  const data = JSON.stringify(state);
  lzma.compress(data, 1, (compressed, error) => {
    if (error) {
      console.error("Compression error: ", error);
      return;
    }
    // Convert compressed byte array to Base64
    const base64Data = btoa(String.fromCharCode.apply(null, compressed));
    // Update the URL hash
    window.location.hash = base64Data;
  });
}

// Utility function to decompress state from URL
function loadStateFromURL() {
  const base64Data = window.location.hash.substring(1);
  if (!base64Data) return;

  fetch("data:application/octet-stream;base64," + base64Data)
    .then((r) => r.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        const compressed_data = Array.from(new Uint8Array(reader.result));
        lzma.decompress(compressed_data, (serialized, error) => {
          if (error) {
            alert("Failed to decompress data: " + error);
            return;
          }
          applicationState = JSON.parse(serialized);
          renderAdminPage();
        });
      };
      reader.readAsArrayBuffer(blob);
    });
}

// Handle adding participants
const addParticipantButton = document.getElementById("add-participant-button");
addParticipantButton.addEventListener("click", () => {
  const participantList = document.getElementById("participant-list");
  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.className = "participant-input";
  newInput.placeholder = "Name";
  const newLine = document.createElement("br");
  participantList.appendChild(newInput);
  participantList.appendChild(newLine);
});

// Handle adding disallowed pairings
const addDisallowedButton = document.getElementById("add-disallowed-button");
addDisallowedButton.addEventListener("click", () => {
  const disallowedList = document.getElementById("disallowed-list");
  const pairDiv = document.createElement("div");
  pairDiv.className = "disallowed-pair";
  const inputA = document.createElement("input");
  inputA.type = "text";
  inputA.className = "disallowed-input";
  inputA.placeholder = "Person A";
  const inputB = document.createElement("input");
  inputB.type = "text";
  inputB.className = "disallowed-input";
  inputB.placeholder = "Person B";
  pairDiv.appendChild(inputA);
  pairDiv.appendChild(inputB);
  disallowedList.appendChild(pairDiv);
});

// Handle form submission
const setupForm = document.getElementById("setup-form");
setupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Collect participants
  const participantInputs = document.querySelectorAll(".participant-input");
  applicationState.participants = Array.from(participantInputs)
    .map((input) => input.value.trim())
    .filter((name) => name !== "");

  // Collect disallowed pairs
  const disallowedInputs = document.querySelectorAll(".disallowed-pair");
  applicationState.disallowedPairs = Array.from(disallowedInputs).map((pair) => {
    const [inputA, inputB] = pair.querySelectorAll(".disallowed-input");
    return [inputA.value.trim(), inputB.value.trim()];
  }).filter(([a, b]) => a !== "" && b !== "");

  // Generate pairings
  generatePairings();
  // Update URL with compressed state
  updateURLWithState(applicationState);
  renderAdminPage();
});

// Generate pairings function
function generatePairings() {
  const participants = [...applicationState.participants];
  const disallowedPairs = new Set(applicationState.disallowedPairs.map(pair => pair.join(",")));
  let pairings = [];
  let retries = 0;

  while (pairings.length !== participants.length && retries < 1000) {
    pairings = [];
    const remaining = [...participants];
    let valid = true;

    for (let i = 0; i < participants.length; i++) {
      const giver = participants[i];
      const possibleReceivers = remaining.filter(receiver => receiver !== giver && !disallowedPairs.has([giver, receiver].join(",")));

      if (possibleReceivers.length === 0) {
        valid = false;
        retries++;
        break;
      }

      const receiver = possibleReceivers[Math.floor(Math.random() * possibleReceivers.length)];
      pairings.push({ giver, receiver });
      remaining.splice(remaining.indexOf(receiver), 1);
    }

    if (valid) {
      applicationState.pairings = pairings;
      return;
    }
  }

  if (retries >= 1000) {
    alert("Unable to generate valid pairings after multiple attempts. Please adjust the participant list or disallowed pairs.");
  }
}

// Render admin page
function renderAdminPage() {
  document.getElementById("initial-form").classList.add("hidden");
  document.getElementById("admin-page").classList.remove("hidden");
  const pairingLinks = document.getElementById("pairing-links");
  pairingLinks.innerHTML = "";

  applicationState.pairings.forEach((pair, index) => {
    const link = document.createElement("a");
    link.href = `#${index}`; // Placeholder, will eventually link to individual pairing page
    link.textContent = `Link for ${pair.giver}`;
    pairingLinks.appendChild(link);
  });
}

// Load state from URL if available
window.addEventListener("load", loadStateFromURL);
