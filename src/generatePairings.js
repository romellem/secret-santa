// Generate pairings function using graph theory and Hamiltonian path with random neighbor selection and proper backtracking
export function generatePairings(participants, disallowedPairs) {
  // Create disallowedMapOfSets
  const disallowedMapOfSets = new Map();
  disallowedPairs.forEach(([a, b]) => {
    if (!disallowedMapOfSets.has(a)) {
      disallowedMapOfSets.set(a, new Set());
    }
    if (!disallowedMapOfSets.has(b)) {
      disallowedMapOfSets.set(b, new Set());
    }
    disallowedMapOfSets.get(a).add(b);
    disallowedMapOfSets.get(b).add(a);
  });

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
    for (const startNode of participants) {
      const visited = new Set([startNode]);
      const path = [startNode];
      const result = findHamiltonianPathWithBacktracking(startNode, visited, path);
      if (result) {
        return result.map((giver, index) => {
          const receiver = result[(index + 1) % result.length];
          return [giver, receiver];
        });
      }
    }
    return null;
  }

  function findHamiltonianPathWithBacktracking(node, visited, path) {
    console.log('1. Checking', node, 'current path', path);
    if (path.length === participants.length) {
      return path;
    }

    const neighbors = [...graph.get(node)];
    shuffleArray(neighbors); // Randomize the order of neighbors
    console.log('  2. Random order of neighboars', neighbors);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        console.log('    3. Trying', neighbor);
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

  const cycle = findHamiltonianCycle();
  if (cycle) {
    return cycle;
  }

  console.error("Unable to generate valid pairings. Please adjust the participant list or disallowed pairs.");
  return null;
}
