#!/usr/bin/env node

/**
 * Debug the clue generation
 */

const fs = require('fs');
const path = require('path');

// Load the puzzle data
const puzzleDataPath = path.join(__dirname, 'puzzle-data.json');
const puzzleData = JSON.parse(fs.readFileSync(puzzleDataPath, 'utf8'));

// Test clue generation
function generateClues(line) {
    const clues = [];
    let currentGroup = 0;
    
    for (const cell of line) {
        if (cell === true) {
            currentGroup++;
        } else if (currentGroup > 0) {
            clues.push(currentGroup);
            currentGroup = 0;
        }
    }
    
    if (currentGroup > 0) {
        clues.push(currentGroup);
    }
    
    return clues.length > 0 ? clues : [0];
}

// Test with the heart puzzle
const heartPuzzle = puzzleData[0];
console.log('Heart puzzle solution:');
console.log(JSON.stringify(heartPuzzle.solution, null, 2));

console.log('\nTesting clue generation:');
heartPuzzle.solution.forEach((row, index) => {
    const clues = generateClues(row);
    console.log(`Row ${index}: ${JSON.stringify(row)} -> ${JSON.stringify(clues)}`);
});

console.log('\nColumn clues:');
for (let col = 0; col < heartPuzzle.solution[0].length; col++) {
    const column = heartPuzzle.solution.map(row => row[col]);
    const clues = generateClues(column);
    console.log(`Col ${col}: ${JSON.stringify(column)} -> ${JSON.stringify(clues)}`);
}
