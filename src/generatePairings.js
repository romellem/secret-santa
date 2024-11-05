// Generate pairings function using graph theory and Hamiltonian path with random neighbor selection and proper backtracking
export function generatePairings(participants, disallowedPairs) {
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

  // Find a Hamiltonian path using Depth-First Search (DFS) with random neighbor selection and proper backtracking
  function findHamiltonianPath(node, visited, path) {
    if (path.length === participants.length) {
      return path;
    }

    const neighbors = [...graph.get(node)];
    shuffleArray(neighbors); // Randomize the order of neighbors

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        path.push(neighbor);

        const result = findHamiltonianPath(neighbor, visited, path);
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
    if (path.length === participants.length) {
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

  const cycle = findHamiltonianCycle();
  if (cycle) {
    return cycle;
  }

  alert("Unable to generate valid pairings. Please adjust the participant list or disallowed pairs.");
  return null;
}
