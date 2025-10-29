#!/usr/bin/env node

/**
 * Debug the solver step by step
 */

const fs = require('fs');
const path = require('path');

// Load the puzzle data
const puzzleDataPath = path.join(__dirname, 'puzzle-data.json');
const puzzleData = JSON.parse(fs.readFileSync(puzzleDataPath, 'utf8'));

// Simple solver for debugging
class DebugSolver {
    constructor() {
        this.EMPTY = 0;
        this.FILLED = 1;
        this.UNKNOWN = -1;
    }
    
    generateClues(line) {
        const clues = [];
        let currentGroup = 0;
        
        for (const cell of line) {
            if (cell === true || cell === this.FILLED) {
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
    
    solveLine(line, clues) {
        const length = line.length;
        const result = [...line];
        
        console.log(`  Solving line: ${JSON.stringify(line)} with clues: ${JSON.stringify(clues)}`);
        
        if (clues.length === 0 || (clues.length === 1 && clues[0] === 0)) {
            console.log(`  All empty line`);
            for (let i = 0; i < length; i++) {
                if (result[i] === this.UNKNOWN) {
                    result[i] = this.EMPTY;
                }
            }
            return result;
        }
        
        // Calculate minimum and maximum positions for each clue
        const minPositions = [];
        const maxPositions = [];
        let currentPos = 0;
        
        for (let i = 0; i < clues.length; i++) {
            minPositions[i] = currentPos;
            currentPos += clues[i] + (i < clues.length - 1 ? 1 : 0);
        }
        
        currentPos = length - 1;
        for (let i = clues.length - 1; i >= 0; i--) {
            maxPositions[i] = currentPos - clues[i] + 1;
            currentPos -= clues[i] + (i > 0 ? 1 : 0);
        }
        
        console.log(`  Min positions: ${JSON.stringify(minPositions)}`);
        console.log(`  Max positions: ${JSON.stringify(maxPositions)}`);
        
        // Fill cells that must be filled
        for (let i = 0; i < clues.length; i++) {
            const clue = clues[i];
            const minPos = minPositions[i];
            const maxPos = maxPositions[i];
            
            const overlapStart = Math.max(minPos, maxPos);
            const overlapEnd = Math.min(minPos + clue - 1, maxPos + clue - 1);
            
            console.log(`  Clue ${i}: ${clue}, minPos: ${minPos}, maxPos: ${maxPos}, overlap: ${overlapStart}-${overlapEnd}`);
            
            for (let pos = overlapStart; pos <= overlapEnd; pos++) {
                if (result[pos] === this.UNKNOWN) {
                    result[pos] = this.FILLED;
                    console.log(`    Filled position ${pos}`);
                }
            }
        }
        
        // Mark cells that must be empty
        for (let i = 0; i < clues.length; i++) {
            const clue = clues[i];
            const minPos = minPositions[i];
            const maxPos = maxPositions[i];
            
            for (let pos = 0; pos < minPos; pos++) {
                if (result[pos] === this.UNKNOWN) {
                    result[pos] = this.EMPTY;
                    console.log(`    Emptied position ${pos} (before min)`);
                }
            }
            
            for (let pos = maxPos + clue; pos < length; pos++) {
                if (result[pos] === this.UNKNOWN) {
                    result[pos] = this.EMPTY;
                    console.log(`    Emptied position ${pos} (after max)`);
                }
            }
        }
        
        console.log(`  Result: ${JSON.stringify(result)}`);
        return result;
    }
    
    solvePuzzle(rowClues, colClues) {
        const height = rowClues.length;
        const width = colClues.length;
        
        console.log(`Solving puzzle ${width}x${height}`);
        console.log(`Row clues: ${JSON.stringify(rowClues)}`);
        console.log(`Col clues: ${JSON.stringify(colClues)}`);
        
        let grid = Array(height).fill().map(() => Array(width).fill(this.UNKNOWN));
        
        console.log(`Initial grid: ${JSON.stringify(grid)}`);
        
        // Try one iteration of constraint propagation
        let changed = true;
        let iteration = 0;
        
        while (changed && iteration < 5) {
            changed = false;
            iteration++;
            console.log(`\n=== Iteration ${iteration} ===`);
            
            // Solve rows
            for (let row = 0; row < height; row++) {
                console.log(`Solving row ${row}:`);
                const newRow = this.solveLine(grid[row], rowClues[row]);
                if (JSON.stringify(newRow) !== JSON.stringify(grid[row])) {
                    grid[row] = newRow;
                    changed = true;
                    console.log(`Row ${row} changed`);
                }
            }
            
            // Solve columns
            for (let col = 0; col < width; col++) {
                console.log(`Solving col ${col}:`);
                const column = grid.map(row => row[col]);
                const newColumn = this.solveLine(column, colClues[col]);
                if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
                    for (let row = 0; row < height; row++) {
                        grid[row][col] = newColumn[row];
                    }
                    changed = true;
                    console.log(`Col ${col} changed`);
                }
            }
            
            console.log(`Grid after iteration ${iteration}: ${JSON.stringify(grid)}`);
        }
        
        return grid;
    }
}

// Test with heart puzzle
const heartPuzzle = puzzleData[0];
const solver = new DebugSolver();

console.log('Testing solver with heart puzzle...\n');

// Generate clues
const rowClues = heartPuzzle.solution.map(row => solver.generateClues(row));
const colClues = [];
for (let col = 0; col < heartPuzzle.solution[0].length; col++) {
    const column = heartPuzzle.solution.map(row => row[col]);
    colClues.push(solver.generateClues(column));
}

console.log('Generated clues:');
console.log('Row clues:', rowClues);
console.log('Col clues:', colClues);

const result = solver.solvePuzzle(rowClues, colClues);
console.log('\nFinal result:', JSON.stringify(result, null, 2));
