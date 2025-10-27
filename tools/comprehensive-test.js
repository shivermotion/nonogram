#!/usr/bin/env node

/**
 * Comprehensive puzzle validation test
 */

const fs = require('fs');
const path = require('path');

// Load the puzzle data
const puzzleDataPath = path.join(__dirname, 'puzzle-data.json');
const puzzleData = JSON.parse(fs.readFileSync(puzzleDataPath, 'utf8'));

// Simple solver
class NonogramSolver {
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
    
    generateAllClues(solution) {
        const height = solution.length;
        const width = solution[0]?.length || 0;
        
        const rowClues = [];
        const colClues = [];
        
        for (let row = 0; row < height; row++) {
            rowClues.push(this.generateClues(solution[row]));
        }
        
        for (let col = 0; col < width; col++) {
            const column = solution.map(row => row[col]);
            colClues.push(this.generateClues(column));
        }
        
        return { rowClues, colClues };
    }
    
    solveLine(line, clues) {
        const length = line.length;
        const result = [...line];
        
        if (clues.length === 0 || (clues.length === 1 && clues[0] === 0)) {
            for (let i = 0; i < length; i++) {
                if (result[i] === this.UNKNOWN) {
                    result[i] = this.EMPTY;
                }
            }
            return result;
        }
        
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
        
        for (let i = 0; i < clues.length; i++) {
            const clue = clues[i];
            const minPos = minPositions[i];
            const maxPos = maxPositions[i];
            
            const overlapStart = Math.max(minPos, maxPos);
            const overlapEnd = Math.min(minPos + clue - 1, maxPos + clue - 1);
            
            for (let pos = overlapStart; pos <= overlapEnd; pos++) {
                if (result[pos] === this.UNKNOWN) {
                    result[pos] = this.FILLED;
                }
            }
        }
        
        for (let i = 0; i < clues.length; i++) {
            const clue = clues[i];
            const minPos = minPositions[i];
            const maxPos = maxPositions[i];
            
            for (let pos = 0; pos < minPos; pos++) {
                if (result[pos] === this.UNKNOWN) {
                    result[pos] = this.EMPTY;
                }
            }
            
            for (let pos = maxPos + clue; pos < length; pos++) {
                if (result[pos] === this.UNKNOWN) {
                    result[pos] = this.EMPTY;
                }
            }
        }
        
        return result;
    }
    
    isValidLine(line, clues) {
        const actualClues = this.generateClues(line);
        return JSON.stringify(actualClues) === JSON.stringify(clues);
    }
    
    isComplete(grid) {
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === this.UNKNOWN) {
                    return false;
                }
            }
        }
        return true;
    }
    
    hasContradiction(grid, rowClues, colClues) {
        for (let row = 0; row < grid.length; row++) {
            const line = grid[row];
            if (!this.isValidPartialLine(line, rowClues[row])) {
                return true;
            }
        }
        
        for (let col = 0; col < grid[0].length; col++) {
            const line = grid.map(row => row[col]);
            if (!this.isValidPartialLine(line, colClues[col])) {
                return true;
            }
        }
        
        return false;
    }
    
    isValidPartialLine(line, clues) {
        const groups = [];
        let currentGroup = 0;
        
        for (const cell of line) {
            if (cell === this.FILLED) {
                currentGroup++;
            } else if (cell === this.EMPTY && currentGroup > 0) {
                groups.push(currentGroup);
                currentGroup = 0;
            }
        }
        
        if (currentGroup > 0) {
            groups.push(currentGroup);
        }
        
        if (groups.length > clues.length) {
            return false;
        }
        
        for (let i = 0; i < groups.length; i++) {
            if (groups[i] > clues[i]) {
                return false;
            }
        }
        
        return true;
    }
    
    findBestGuess(grid) {
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === this.UNKNOWN) {
                    return { row, col };
                }
            }
        }
        return null;
    }
    
    copyGrid(grid) {
        return grid.map(row => [...row]);
    }
    
    solvePuzzle(rowClues, colClues, maxSolutions = 2) {
        const height = rowClues.length;
        const width = colClues.length;
        
        let grid = Array(height).fill().map(() => Array(width).fill(this.UNKNOWN));
        
        const solutions = [];
        
        const solve = (currentGrid) => {
            let changed = true;
            while (changed) {
                changed = false;
                
                for (let row = 0; row < height; row++) {
                    const newRow = this.solveLine(currentGrid[row], rowClues[row]);
                    if (JSON.stringify(newRow) !== JSON.stringify(currentGrid[row])) {
                        currentGrid[row] = newRow;
                        changed = true;
                    }
                }
                
                for (let col = 0; col < width; col++) {
                    const column = currentGrid.map(row => row[col]);
                    const newColumn = this.solveLine(column, colClues[col]);
                    if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
                        for (let row = 0; row < height; row++) {
                            currentGrid[row][col] = newColumn[row];
                        }
                        changed = true;
                    }
                }
                
                if (this.hasContradiction(currentGrid, rowClues, colClues)) {
                    return;
                }
            }
            
            if (this.isComplete(currentGrid)) {
                solutions.push(this.copyGrid(currentGrid));
                return;
            }
            
            if (solutions.length >= maxSolutions) {
                return;
            }
            
            const guess = this.findBestGuess(currentGrid);
            if (!guess) {
                return;
            }
            
            const gridFilled = this.copyGrid(currentGrid);
            gridFilled[guess.row][guess.col] = this.FILLED;
            solve(gridFilled);
            
            if (solutions.length < maxSolutions) {
                const gridEmpty = this.copyGrid(currentGrid);
                gridEmpty[guess.row][guess.col] = this.EMPTY;
                solve(gridEmpty);
            }
        };
        
        solve(grid);
        return solutions;
    }
    
    validatePuzzle(solution) {
        const { rowClues, colClues } = this.generateAllClues(solution);
        const solutions = this.solvePuzzle(rowClues, colClues, 2);
        
        if (solutions.length === 0) {
            return { status: 'UNSOLVABLE', solutions: [] };
        } else if (solutions.length > 1) {
            return { status: 'AMBIGUOUS', solutions };
        } else {
            const foundSolution = solutions[0];
            const matches = this.solutionsMatch(foundSolution, solution);
            return { 
                status: matches ? 'VALID' : 'MISMATCH', 
                solutions: [foundSolution] 
            };
        }
    }
    
    solutionsMatch(solution1, solution2) {
        if (solution1.length !== solution2.length) return false;
        if (solution1[0].length !== solution2[0].length) return false;
        
        for (let row = 0; row < solution1.length; row++) {
            for (let col = 0; col < solution1[row].length; col++) {
                // Convert both to boolean for comparison
                const val1 = solution1[row][col] === this.FILLED || solution1[row][col] === true;
                const val2 = solution2[row][col] === this.FILLED || solution2[row][col] === true;
                if (val1 !== val2) {
                    return false;
                }
            }
        }
        return true;
    }
}

// Test all puzzles
const solver = new NonogramSolver();

console.log('Comprehensive Puzzle Validation\n');

let validCount = 0;
let ambiguousCount = 0;
let invalidCount = 0;
let unsolvableCount = 0;

const results = [];

puzzleData.forEach((puzzle, index) => {
    console.log(`${index + 1}. ${puzzle.name} (${puzzle.id})`);
    
    const result = solver.validatePuzzle(puzzle.solution);
    results.push({ puzzle, result });
    
    console.log(`   Status: ${result.status}`);
    console.log(`   Solutions: ${result.solutions.length}`);
    
    if (result.status === 'VALID') {
        validCount++;
        console.log(`   ✅ Valid - uniquely solvable`);
    } else if (result.status === 'AMBIGUOUS') {
        ambiguousCount++;
        console.log(`   ⚠️ Ambiguous - ${result.solutions.length} solutions`);
    } else if (result.status === 'UNSOLVABLE') {
        unsolvableCount++;
        console.log(`   ❌ Unsolvable - no valid solution`);
    } else {
        invalidCount++;
        console.log(`   ❌ Invalid - ${result.status}`);
    }
    
    console.log('');
});

console.log('=== FINAL SUMMARY ===');
console.log(`Total puzzles: ${puzzleData.length}`);
console.log(`✅ Valid: ${validCount}`);
console.log(`⚠️ Ambiguous: ${ambiguousCount}`);
console.log(`❌ Unsolvable: ${unsolvableCount}`);
console.log(`❌ Invalid: ${invalidCount}`);

// Show problematic puzzles
const problematic = results.filter(r => r.result.status !== 'VALID');
if (problematic.length > 0) {
    console.log('\n=== PROBLEMATIC PUZZLES ===');
    problematic.forEach(({ puzzle, result }) => {
        console.log(`${puzzle.name} (${puzzle.id}): ${result.status}`);
    });
}

// Show educational puzzles specifically
const educational = results.filter(r => r.puzzle.category === 'EDUCATIONAL');
const educationalValid = educational.filter(r => r.result.status === 'VALID').length;
const educationalTotal = educational.length;

console.log(`\n=== EDUCATIONAL PUZZLES ===`);
console.log(`Total educational: ${educationalTotal}`);
console.log(`Valid educational: ${educationalValid}`);
console.log(`Educational success rate: ${((educationalValid / educationalTotal) * 100).toFixed(1)}%`);
