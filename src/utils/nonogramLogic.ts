import { CellState, Grid, Solution, Clue, NonogramPuzzle, GridSize } from '../types/game';

/**
 * Generate clues for a row or column based on the solution
 */
export function generateClues(line: boolean[]): Clue {
  const clues: number[] = [];
  let currentGroup = 0;
  
  for (const cell of line) {
    if (cell) {
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

/**
 * Generate all clues for a nonogram puzzle
 */
export function generateAllClues(solution: Solution): { rowClues: Clue[], colClues: Clue[] } {
  const height = solution.length;
  const width = solution[0]?.length || 0;
  
  const rowClues: Clue[] = [];
  const colClues: Clue[] = [];
  
  // Generate row clues
  for (let row = 0; row < height; row++) {
    rowClues.push(generateClues(solution[row]));
  }
  
  // Generate column clues
  for (let col = 0; col < width; col++) {
    const column = solution.map(row => row[col]);
    colClues.push(generateClues(column));
  }
  
  return { rowClues, colClues };
}

/**
 * Check if a line matches the given clues
 */
export function isLineValid(line: CellState[], clues: Clue, allowIncomplete = true): boolean {
  const filledCells = line.map(cell => cell === CellState.FILLED);
  const actualClues = generateClues(filledCells);
  
  if (!allowIncomplete) {
    return JSON.stringify(actualClues) === JSON.stringify(clues);
  }
  
  // For incomplete validation, check if current state could lead to solution
  if (clues[0] === 0) {
    // No filled cells should exist
    return !filledCells.includes(true);
  }
  
  // Count groups and check if they could match
  const groups: number[] = [];
  let currentGroup = 0;
  let hasEmpty = false;
  
  for (let i = 0; i < line.length; i++) {
    const cell = line[i];
    
    if (cell === CellState.FILLED) {
      currentGroup++;
    } else if (cell === CellState.MARKED || cell === CellState.EMPTY) {
      if (currentGroup > 0) {
        groups.push(currentGroup);
        currentGroup = 0;
      }
      if (cell === CellState.EMPTY) {
        hasEmpty = true;
      }
    }
  }
  
  if (currentGroup > 0) {
    groups.push(currentGroup);
  }
  
  // If line is complete (no empty cells), must match exactly
  if (!hasEmpty) {
    return JSON.stringify(groups) === JSON.stringify(clues);
  }
  
  // For incomplete lines, check if current groups could be part of solution
  if (groups.length > clues.length) {
    return false;
  }
  
  // Check if current groups are valid prefixes of clues
  for (let i = 0; i < groups.length; i++) {
    if (groups[i] > clues[i]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if the entire grid is valid
 */
export function isGridValid(grid: Grid, rowClues: Clue[], colClues: Clue[], allowIncomplete = true): boolean {
  const height = grid.length;
  const width = grid[0]?.length || 0;
  
  // Check all rows
  for (let row = 0; row < height; row++) {
    if (!isLineValid(grid[row], rowClues[row], allowIncomplete)) {
      return false;
    }
  }
  
  // Check all columns
  for (let col = 0; col < width; col++) {
    const column = grid.map(row => row[col]);
    if (!isLineValid(column, colClues[col], allowIncomplete)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if the puzzle is completely solved
 */
export function isPuzzleComplete(grid: Grid, rowClues: Clue[], colClues: Clue[]): boolean {
  const height = grid.length;
  const width = grid[0]?.length || 0;
  
  // Check if there are any empty cells
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (grid[row][col] === CellState.EMPTY) {
        return false;
      }
    }
  }
  
  // Check if the solution is valid
  return isGridValid(grid, rowClues, colClues, false);
}

/**
 * Create an empty grid of the specified size
 */
export function createEmptyGrid(size: GridSize): Grid {
  return Array(size.height).fill(null).map(() => 
    Array(size.width).fill(CellState.EMPTY)
  );
}

/**
 * Clone a grid
 */
export function cloneGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}

/**
 * Convert solution to grid (for testing/validation)
 */
export function solutionToGrid(solution: Solution): Grid {
  return solution.map(row => 
    row.map(cell => cell ? CellState.FILLED : CellState.MARKED)
  );
}

/**
 * Get possible states for a line given clues and current state
 */
export function solveLine(line: CellState[], clues: Clue): CellState[] {
  if (clues[0] === 0) {
    // No filled cells, mark all as marked
    return line.map(() => CellState.MARKED);
  }
  
  const length = line.length;
  const newLine = [...line];
  
  // Generate all possible valid arrangements
  const possibleLines = generatePossibleLines(length, clues);
  
  // Filter arrangements that match current state
  const validLines = possibleLines.filter(possible => 
    possible.every((cell, i) => 
      line[i] === CellState.EMPTY || line[i] === cell
    )
  );
  
  if (validLines.length === 0) {
    return newLine; // No valid solutions
  }
  
  // Find cells that have the same state in all valid arrangements
  for (let i = 0; i < length; i++) {
    const states = validLines.map(arrangement => arrangement[i]);
    const allSame = states.every(state => state === states[0]);
    
    if (allSame && line[i] === CellState.EMPTY) {
      newLine[i] = states[0];
    }
  }
  
  return newLine;
}

/**
 * Generate all possible valid arrangements for a line
 */
function generatePossibleLines(length: number, clues: Clue): CellState[][] {
  const arrangements: CellState[][] = [];
  
  function backtrack(pos: number, clueIndex: number, currentArrangement: CellState[]) {
    if (clueIndex >= clues.length) {
      // All clues used, fill rest with marked cells
      for (let i = pos; i < length; i++) {
        currentArrangement[i] = CellState.MARKED;
      }
      arrangements.push([...currentArrangement]);
      return;
    }
    
    if (pos >= length) {
      return; // Out of bounds
    }
    
    const clue = clues[clueIndex];
    const remainingClues = clues.slice(clueIndex + 1);
    const minSpaceNeeded = remainingClues.reduce((sum, c) => sum + c, 0) + 
                          remainingClues.length; // Space for clues + gaps
    
    // Try placing the current clue at different positions
    for (let start = pos; start <= length - clue - minSpaceNeeded; start++) {
      const arrangement = [...currentArrangement];
      
      // Mark cells before the clue as marked (empty)
      for (let i = pos; i < start; i++) {
        arrangement[i] = CellState.MARKED;
      }
      
      // Fill the clue
      for (let i = start; i < start + clue; i++) {
        arrangement[i] = CellState.FILLED;
      }
      
      // Add gap after clue (if not last clue)
      let nextPos = start + clue;
      if (clueIndex < clues.length - 1 && nextPos < length) {
        arrangement[nextPos] = CellState.MARKED;
        nextPos++;
      }
      
      backtrack(nextPos, clueIndex + 1, arrangement);
    }
  }
  
  const initialArrangement: CellState[] = new Array(length).fill(CellState.EMPTY);
  backtrack(0, 0, initialArrangement);
  
  return arrangements;
}

/**
 * Auto-solve obvious cells in the grid
 */
export function autoSolveObvious(grid: Grid, rowClues: Clue[], colClues: Clue[]): Grid {
  const newGrid = cloneGrid(grid);
  const height = newGrid.length;
  const width = newGrid[0]?.length || 0;
  let changed = true;
  
  while (changed) {
    changed = false;
    
    // Solve rows
    for (let row = 0; row < height; row++) {
      const oldLine = newGrid[row];
      const newLine = solveLine(oldLine, rowClues[row]);
      
      if (JSON.stringify(oldLine) !== JSON.stringify(newLine)) {
        newGrid[row] = newLine;
        changed = true;
      }
    }
    
    // Solve columns
    for (let col = 0; col < width; col++) {
      const oldColumn = newGrid.map(row => row[col]);
      const newColumn = solveLine(oldColumn, colClues[col]);
      
      if (JSON.stringify(oldColumn) !== JSON.stringify(newColumn)) {
        for (let row = 0; row < height; row++) {
          newGrid[row][col] = newColumn[row];
        }
        changed = true;
      }
    }
  }
  
  return newGrid;
}
