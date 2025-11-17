import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePairings, countHamiltonianCycles } from './js/generatePairings.js';

function createDisallowedSet(disallowedPairs) {
  const set = new Set();
  disallowedPairs.forEach(([a, b]) => {
    set.add(`${a}->${b}`);
    set.add(`${b}->${a}`);
  });
  return set;
}

function validateCycle(pairings, participants, disallowedPairs) {
  assert.ok(pairings, 'Expected pairings to be defined');
  assert.strictEqual(pairings.length, participants.length, 'Cycle must include every participant');

  const givers = new Set();
  const receivers = new Set();
  const disallowedSet = createDisallowedSet(disallowedPairs);

  pairings.forEach(([giver, receiver]) => {
    assert.notStrictEqual(giver, receiver, 'Participants cannot gift to themselves');
    const key = `${giver}->${receiver}`;
    assert.ok(!disallowedSet.has(key), `Pair ${giver} -> ${receiver} is disallowed`);
    assert.ok(participants.includes(giver), `Unknown giver ${giver}`);
    assert.ok(participants.includes(receiver), `Unknown receiver ${receiver}`);
    assert.ok(!givers.has(giver), `Giver ${giver} appears more than once`);
    assert.ok(!receivers.has(receiver), `Receiver ${receiver} appears more than once`);
    givers.add(giver);
    receivers.add(receiver);
  });
}

function bruteForceCycleCount(participants, disallowedPairs) {
  const n = participants.length;
  if (n < 2) {
    return 0n;
  }

  const disallowedSet = createDisallowedSet(disallowedPairs);
  const start = participants[0];
  const rest = participants.slice(1);
  let total = 0n;

  function isAllowed(a, b) {
    return !disallowedSet.has(`${a}->${b}`);
  }

  function isValidCycle(order) {
    for (let i = 0; i < order.length - 1; i++) {
      if (!isAllowed(order[i], order[i + 1])) {
        return false;
      }
    }
    return isAllowed(order[order.length - 1], order[0]);
  }

  function permute(idx) {
    if (idx === rest.length) {
      const candidate = [start, ...rest];
      if (isValidCycle(candidate)) {
        total += 1n;
      }
      return;
    }

    for (let i = idx; i < rest.length; i++) {
      [rest[idx], rest[i]] = [rest[i], rest[idx]];
      permute(idx + 1);
      [rest[idx], rest[i]] = [rest[i], rest[idx]];
    }
  }

  permute(0);
  return total;
}

test('generatePairings creates a full cycle when no restrictions exist', () => {
  const participants = ['John', 'Mary', 'Zoey', 'Chris'];
  const disallowedPairs = [];
  const pairings = generatePairings(participants, disallowedPairs);
  validateCycle(pairings, participants, disallowedPairs);
});

test('generatePairings respects disallowed pairs and still completes cycle', () => {
  const participants = ['Matt', 'Abby', 'Dan', 'Lindsay'];
  const disallowedPairs = [['Matt', 'Abby'], ['Dan', 'Lindsay']];
  const pairings = generatePairings(participants, disallowedPairs);
  validateCycle(pairings, participants, disallowedPairs);
});

test('generatePairings returns null when a cycle is impossible', () => {
  const participants = ['A', 'B', 'C', 'D'];
  const disallowedPairs = [
    ['A', 'C'], ['A', 'D'],
    ['B', 'C'], ['B', 'D']
  ];
  const pairings = generatePairings(participants, disallowedPairs);
  assert.strictEqual(pairings, null);
});

test('countHamiltonianCycles equals factorial baseline for a complete graph', () => {
  const participants = ['A', 'B', 'C', 'D'];
  const disallowedPairs = [];
  const count = countHamiltonianCycles(participants, disallowedPairs);
  assert.strictEqual(count, 6n); // (n - 1)! = 3! = 6
});

test('countHamiltonianCycles returns zero when no cycle exists', () => {
  const participants = ['A', 'B', 'C', 'D'];
  const disallowedPairs = [
    ['A', 'C'], ['A', 'D'],
    ['B', 'C'], ['B', 'D']
  ];
  const count = countHamiltonianCycles(participants, disallowedPairs);
  assert.strictEqual(count, 0n);
});

test('countHamiltonianCycles matches brute force enumeration for mixed constraints', () => {
  const participants = ['Matt', 'Abby', 'Dan', 'Lindsay', 'Taylor'];
  const disallowedPairs = [
    ['Matt', 'Abby'],
    ['Abby', 'Dan'],
    ['Taylor', 'Matt']
  ];
  const dpCount = countHamiltonianCycles(participants, disallowedPairs);
  const bruteCount = bruteForceCycleCount(participants, disallowedPairs);
  assert.strictEqual(dpCount, bruteCount);
});
