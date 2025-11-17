function buildDisallowedMap(disallowedPairs) {
  const disallowedMap = new Map();
  for (const [a, b] of disallowedPairs) {
    if (!disallowedMap.has(a)) {
      disallowedMap.set(a, new Set());
    }
    if (!disallowedMap.has(b)) {
      disallowedMap.set(b, new Set());
    }
    disallowedMap.get(a).add(b);
    disallowedMap.get(b).add(a);
  }
  return disallowedMap;
}

function isAllowedPair(disallowedMap, a, b) {
  return !(disallowedMap.has(a) && disallowedMap.get(a).has(b));
}

// Generate pairings function using graph theory and Hamiltonian path with random neighbor selection and proper backtracking
export function generatePairings(participants, disallowedPairs) {
  if (participants.length < 2) {
    return null;
  }
  const disallowedMapOfSets = buildDisallowedMap(disallowedPairs);

  // Build graph representation
  const graph = new Map();
  participants.forEach(participant => {
    graph.set(participant, []);
  });

  participants.forEach(participant => {
    participants.forEach(other => {
      if (participant !== other && isAllowedPair(disallowedMapOfSets, participant, other)) {
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

export function countHamiltonianCycles(participants, disallowedPairs) {
  const n = participants.length;
  if (n < 2) {
    return 0n;
  }

  const disallowedMap = buildDisallowedMap(disallowedPairs);
  const allowed = Array.from({ length: n }, () => Array(n).fill(false));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      allowed[i][j] = isAllowedPair(disallowedMap, participants[i], participants[j]);
    }
  }

  const start = 0;
  const size = 1 << n;
  const dp = Array.from({ length: size }, () => Array(n).fill(0n));
  dp[1 << start][start] = 1n;

  for (let mask = 0; mask < size; mask++) {
    if ((mask & (1 << start)) === 0) {
      continue;
    }
    for (let current = 0; current < n; current++) {
      if ((mask & (1 << current)) === 0) continue;
      const ways = dp[mask][current];
      if (ways === 0n) continue;
      for (let next = 0; next < n; next++) {
        if ((mask & (1 << next)) !== 0) continue;
        if (!allowed[current][next]) continue;
        dp[mask | (1 << next)][next] += ways;
      }
    }
  }

  let totalCycles = 0n;
  const fullMask = size - 1;
  for (let end = 1; end < n; end++) {
    if (allowed[end][start]) {
      totalCycles += dp[fullMask][end];
    }
  }

  return totalCycles;
}
