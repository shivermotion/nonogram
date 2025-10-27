#!/usr/bin/env node

/**
 * Extract puzzle data from puzzles.ts and convert to JSON for the validator
 */

const fs = require('fs');
const path = require('path');

// Read the puzzles.ts file
const puzzlesPath = path.join(__dirname, '../src/data/puzzles.ts');
const puzzlesContent = fs.readFileSync(puzzlesPath, 'utf8');

// Extract all solution arrays
const solutionRegex = /const (\w+Solution): boolean\[\]\[\] = \[([\s\S]*?)\];/g;
const solutions = {};
let match;

while ((match = solutionRegex.exec(puzzlesContent)) !== null) {
  const name = match[1];
  const arrayContent = match[2];
  
  // Parse the boolean array - handle multi-line format
  const solution = [];
  const lines = arrayContent.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('[') && (trimmed.endsWith('],') || trimmed.endsWith(']'))) {
      // Extract the array content
      const arrayMatch = trimmed.match(/\[([^\]]+)\]/);
      if (arrayMatch) {
        const cells = arrayMatch[1].split(',').map(cell => {
          const trimmed = cell.trim();
          return trimmed === 'true';
        });
        solution.push(cells);
      }
    }
  }
  
  solutions[name] = solution;
}

// Extract puzzle definitions
const puzzleRegex = /createPuzzle\(\s*['"`]([^'"`]+)['"`],\s*['"`]([^'"`]+)['"`],\s*Category\.(\w+),\s*Difficulty\.(\w+),\s*(\w+Solution),\s*['"`]([^'"`]+)['"`]\s*\)/g;
const puzzles = [];

while ((match = puzzleRegex.exec(puzzlesContent)) !== null) {
  const [, id, name, category, difficulty, solutionName, description] = match;
  
  if (solutions[solutionName]) {
    puzzles.push({
      id,
      name,
      solution: solutions[solutionName],
      category,
      difficulty,
      description
    });
  }
}

// Write the extracted data to a JSON file
const outputPath = path.join(__dirname, 'puzzle-data.json');
fs.writeFileSync(outputPath, JSON.stringify(puzzles, null, 2));

console.log(`Extracted ${puzzles.length} puzzles to ${outputPath}`);
console.log('Puzzle categories:', [...new Set(puzzles.map(p => p.category))]);
console.log('Puzzle difficulties:', [...new Set(puzzles.map(p => p.difficulty))]);

// Also create a JavaScript file that can be imported by the validator
const jsOutputPath = path.join(__dirname, 'puzzle-data.js');
const jsContent = `// Auto-generated puzzle data
const PUZZLE_DATA = ${JSON.stringify(puzzles, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PUZZLE_DATA;
} else if (typeof window !== 'undefined') {
  window.PUZZLE_DATA = PUZZLE_DATA;
}
`;

fs.writeFileSync(jsOutputPath, jsContent);
console.log(`Also created ${jsOutputPath} for browser import`);
