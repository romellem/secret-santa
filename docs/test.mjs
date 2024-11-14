import {generatePairings} from './generatePairings.js';

const participants = ["Matt", "Abby", "Dan", "Lindsay", "Alex", "Lindsey"];
const disallowedPairs = [
    ["Matt", "Abby"],
    ["Dan", "Lindsay"],
    ["Alex", "Lindsey"]
];
const disallowedPairsMap = disallowedPairs.reduce((map, [a, b]) => {
    map.set(a, b);
    map.set(b, a);
    return map;
}, new Map());
// const participants = ["Albert", "Alice", "Bob", "Brenda", "Charlie", "Cathy", "David", "Diane", "Eric", "Eve", "Frank", "Fiona", "George", "Gina", "Hank", "Helen"];
// const disallowedPairs = [
//     ["Albert", "Alice"],
//     ["Albert", "Bob"],
//     ["Albert", "Brenda"],
//     ["Albert", "Charlie"],
//     ["Albert", "Cathy"],
//     ["Albert", "David"],
//     ["Albert", "Diane"],
//     ["Albert", "Eric"],
//     ["Albert", "Eve"],
//     ["Albert", "Frank"],
//     ["Albert", "Fiona"],
//     ["Albert", "George"],
//     ["Albert", "Gina"],
//     ["Albert", "Hank"],
//     ["Bob", "Brenda"], ["Charlie", "Cathy"], ["David", "Diane"], ["Eric", "Eve"], ["Frank", "Fiona"], ["George", "Gina"], ["Hank", "Helen"]];
for (let i = 0; i < 1000000; i++) {
    // console.log(i, 'START ---------')
    const pairings = generatePairings(participants, disallowedPairs);
    // console.log(i, 'END -----------')
    for (let [a, b] of pairings) {
        if (disallowedPairsMap.get(a) === b) {
            console.log('Disallowed pair found:', a, b, `after`, i);
            console.log(pairings)
            process.exit(1)
        }
    }
}