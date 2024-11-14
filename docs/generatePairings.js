// Generate pairings function using graph theory and Hamiltonian path with random neighbor selection and proper backtracking
export function generatePairings(participants, disallowedPairs) {
  const disallowedMapOfSets = new Map();
  for (let [a, b] of disallowedPairs) {
    if (!disallowedMapOfSets.has(a)) {
      disallowedMapOfSets.set(a, new Set());
    }
    if (!disallowedMapOfSets.has(b)) {
      disallowedMapOfSets.set(b, new Set());
    }
    disallowedMapOfSets.get(a).add(b);
    disallowedMapOfSets.get(b).add(a);
  }

  // Build graph representation
  const graph = new Map();
  participants.forEach(participant => {
    graph.set(participant, []);
  });

  participants.forEach(participant => {
    participants.forEach(other => {
      if (participant !== other && (!disallowedMapOfSets.has(participant) || !disallowedMapOfSets.get(participant).has(other))) {
        graph.get(participant).push(other);
      }
    });
  });

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Try to find a Hamiltonian cycle by attempting from different starting nodes
  function findHamiltonianCycle() {
    const node = participants[0];
    const path = [node];
    const visited = new Set(path);
    const result = findHamiltonianPathWithBacktracking(node, visited, path);
    if (result) {
      return result.map((giver, index) => {
        const receiver = result[(index + 1) % result.length];
        return [giver, receiver];
      });
    }
    return null;
  }

  function findHamiltonianPathWithBacktracking(node, visited, path) {
    if (path.length === participants.length) {
      if (!isValidCycle(path)) {
        return null;
      }
      return path;
    }

    const neighbors = [...graph.get(node)];
    shuffleArray(neighbors); // Randomize the order of neighbors

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        path.push(neighbor);

        const result = findHamiltonianPathWithBacktracking(neighbor, visited, path);
        if (result) {
          return result;
        }

        // Backtrack
        visited.delete(neighbor);
        path.pop();
      }
    }
    return null;
  }

  function isValidCycle(path) {
    for (let i = 0; i < path.length; i++) {
      const giver = path[i];
      const receiver = path[(i + 1) % path.length];
      if (disallowedMapOfSets.has(giver) && disallowedMapOfSets.get(giver).has(receiver)) {
        return false;
      }
    }
    return true;
  }

  const cycle = findHamiltonianCycle();
  if (cycle) {
    return cycle;
  }

  // alert("Unable to generate valid pairings. Please adjust the participant list or disallowed pairs.");
  return null;
}
