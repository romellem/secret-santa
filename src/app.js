// Initialize LZMA
const lzma = new LZMA("lzma_worker.js");

// Application state
/** @type {Object} */
let applicationState = {
  page: "setup"
};

// Utility function to compress state and update URL
function updateURLWithState(state, callback) {
  const data = JSON.stringify(state);
  lzma.compress(data, 1, (compressed, error) => {
    if (error) {
      console.error("Compression error: ", error);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.substr(reader.result.indexOf(",") + 1);
      callback(base64);
    };
    reader.readAsDataURL(new Blob([new Uint8Array(compressed)]));
  });
}

// Utility function to decompress state from URL
function loadStateFromURL() {
  const base64Data = window.location.hash.substring(1);
  if (!base64Data) return;

  try {
    const binaryString = atob(base64Data);
    const compressed_data = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      compressed_data[i] = binaryString.charCodeAt(i);
    }
    lzma.decompress(compressed_data, (serialized, error) => {
      if (error) {
        alert("Failed to decompress data: " + error);
        return;
      }
      applicationState = JSON.parse(serialized);
      renderPage();
    });
  } catch (e) {
    console.error("Failed to decode base64 data: ", e);
  }
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
  const participants = Array.from(participantInputs)
    .map((input) => input.value.trim())
    .filter((name) => name !== "");

  // Collect disallowed pairs
  const disallowedInputs = document.querySelectorAll(".disallowed-pair");
  const disallowedPairs = Array.from(disallowedInputs).map((pair) => {
    const [inputA, inputB] = pair.querySelectorAll(".disallowed-input");
    return [inputA.value.trim(), inputB.value.trim()];
  }).filter(([a, b]) => a !== "" && b !== "" && a !== b);

  // Generate pairings
  const pairings = generatePairings(participants, disallowedPairs);
  if (pairings) {
    applicationState = {
      page: "admin",
      participants,
      disallowedPairs,
      pairings
    };
    // Update URL with compressed state
    updateURLWithState(applicationState, (base64) => {
      window.location.hash = base64;
      renderPage();
    });
  }
});

// Generate pairings function using graph theory and Hamiltonian path
function generatePairings(participants, disallowedPairs) {
  const disallowedSet = new Set(disallowedPairs.map(pair => pair.join(",")));

  // Build graph representation
  const graph = new Map();
  participants.forEach(participant => {
    graph.set(participant, []);
  });

  participants.forEach(participant => {
    participants.forEach(other => {
      if (participant !== other && !disallowedSet.has([participant, other].join(","))) {
        graph.get(participant).push(other);
      }
    });
  });

  // Find a Hamiltonian path using Depth-First Search (DFS)
  function findHamiltonianPath(node, visited, path) {
    if (path.length === participants.length) {
      return path;
    }

    for (const neighbor of graph.get(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        path.push(neighbor);

        const result = findHamiltonianPath(neighbor, visited, path);
        if (result) {
          return result;
        }

        visited.delete(neighbor);
        path.pop();
      }
    }
    return null;
  }

  for (const startNode of participants) {
    const visited = new Set([startNode]);
    const path = [startNode];
    const result = findHamiltonianPath(startNode, visited, path);
    if (result) {
      return result.map((giver, index) => {
        const receiver = result[(index + 1) % result.length];
        return [giver, receiver];
      });
    }
  }

  alert("Unable to generate valid pairings. Please adjust the participant list or disallowed pairs.");
  return null;
}

// Render the appropriate page based on application state
function renderPage() {
  if (applicationState.page === "setup") {
    document.getElementById("initial-form").classList.remove("hidden");
    document.getElementById("admin-page").classList.add("hidden");
    document.getElementById("individual-page").classList.add("hidden");
  } else if (applicationState.page === "pairing") {
    renderIndividualPage();
  } else if (applicationState.page === "admin") {
    renderAdminPage();
  }
}

// Render admin page
function renderAdminPage() {
  document.getElementById("initial-form").classList.add("hidden");
  document.getElementById("admin-page").classList.remove("hidden");
  document.getElementById("individual-page").classList.add("hidden");
  const pairingLinks = document.getElementById("pairing-links");
  pairingLinks.innerHTML = "";

  if (applicationState.pairings) {
    applicationState.pairings.forEach(([giver, receiver], index) => {
      const link = document.createElement("a");
      link.href = `#`;
      link.textContent = `Link for ${giver}`;
      link.addEventListener("click", () => {
        applicationState = {
          page: "pairing",
          giver,
          receiver
        };
        updateURLWithState(applicationState, (base64) => {
          window.location.hash = base64;
          renderPage();
        });
      });
      pairingLinks.appendChild(link);
    });
  }
}

// Render individual pairing page
function renderIndividualPage() {
  document.getElementById("initial-form").classList.add("hidden");
  document.getElementById("admin-page").classList.add("hidden");
  document.getElementById("individual-page").classList.remove("hidden");

  document.getElementById("person-name").textContent = applicationState.giver;
  document.getElementById("pairing-name").textContent = applicationState.receiver;
}

// Load state from URL if available
window.addEventListener("load", loadStateFromURL);
