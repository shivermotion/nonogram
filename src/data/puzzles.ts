import { NonogramPuzzle, Category, Difficulty } from '../types/game';
import { generateAllClues } from '../utils/nonogramLogic';

// Helper function to create puzzles from solution arrays
function createPuzzle(
  id: string,
  name: string,
  category: Category,
  difficulty: Difficulty,
  solution: boolean[][],
  description?: string
): NonogramPuzzle {
  const { rowClues, colClues } = generateAllClues(solution);
  
  return {
    id,
    name,
    category,
    difficulty,
    size: {
      width: solution[0]?.length || 0,
      height: solution.length,
    },
    solution,
    rowClues,
    colClues,
    description,
  };
}

// 5x5 Easy Puzzles
const heartSolution: boolean[][] = [
  [false, true,  false, true,  false],
  [true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true ],
  [false, true,  true,  true,  false],
  [false, false, true,  false, false]
];

const crossSolution: boolean[][] = [
  [false, false, true,  false, false],
  [false, false, true,  false, false],
  [true,  true,  true,  true,  true ],
  [false, false, true,  false, false],
  [false, false, true,  false, false]
];

const houseSolution: boolean[][] = [
  [false, false, true,  false, false],
  [false, true,  true,  true,  false],
  [true,  true,  true,  true,  true ],
  [true,  false, true,  false, true ],
  [true,  false, true,  false, true ]
];

// 10x10 Medium Puzzles
const catSolution: boolean[][] = [
  [false, false, true,  true,  false, false, true,  true,  false, false],
  [false, true,  false, false, true,  true,  false, false, true,  false],
  [false, true,  false, false, false, false, false, false, true,  false],
  [false, true,  false, true,  false, false, true,  false, true,  false],
  [false, false, true,  false, false, false, false, true,  false, false],
  [false, false, false, true,  true,  true,  true,  false, false, false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, true,  true,  false, true,  true,  false, true,  true,  false],
  [true,  true,  false, false, true,  true,  false, false, true,  true ],
  [true,  false, false, false, false, false, false, false, false, true ]
];

const carSolution: boolean[][] = [
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  false],
  [true,  true,  false, true,  true,  true,  true,  false, true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [false, true,  false, true,  true,  true,  true,  false, true,  false],
  [false, false, false, true,  false, false, true,  false, false, false],
  [false, false, false, true,  false, false, true,  false, false, false],
  [false, false, false, false, false, false, false, false, false, false]
];

const flowerSolution: boolean[][] = [
  [false, false, false, true,  false, false, true,  false, false, false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, true,  true,  false, true,  true,  false, true,  true,  false],
  [true,  true,  false, false, true,  true,  false, false, true,  true ],
  [true,  false, false, true,  true,  true,  true,  false, false, true ],
  [true,  false, false, true,  true,  true,  true,  false, false, true ],
  [true,  true,  false, false, true,  true,  false, false, true,  true ],
  [false, true,  true,  false, true,  true,  false, true,  true,  false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, false, false, true,  false, false, true,  false, false, false]
];

// 15x15 Hard Puzzle
const treeSolution: boolean[][] = [
  [false, false, false, false, false, false, true,  false, false, false, false, false, false, false, false],
  [false, false, false, false, false, true,  true,  true,  false, false, false, false, false, false, false],
  [false, false, false, false, true,  true,  true,  true,  true,  false, false, false, false, false, false],
  [false, false, false, true,  true,  true,  true,  true,  true,  true,  false, false, false, false, false],
  [false, false, true,  true,  true,  true,  true,  true,  true,  true,  true,  false, false, false, false],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false, false, false],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false, false],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false],
  [false, false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false, false],
  [false, false, false, false, false, false, true,  true,  true,  false, false, false, false, false, false],
  [false, false, false, false, false, false, true,  true,  true,  false, false, false, false, false, false],
  [false, false, false, false, false, false, true,  true,  true,  false, false, false, false, false, false],
  [false, false, false, false, false, true,  true,  true,  true,  true,  false, false, false, false, false]
];

// Export all puzzles
export const PUZZLES: NonogramPuzzle[] = [
  // 5x5 Easy puzzles
  createPuzzle(
    'heart-5x5',
    'Heart',
    Category.ABSTRACT,
    Difficulty.EASY,
    heartSolution,
    'A simple heart shape'
  ),
  
  createPuzzle(
    'cross-5x5',
    'Cross',
    Category.ABSTRACT,
    Difficulty.EASY,
    crossSolution,
    'A basic cross pattern'
  ),
  
  createPuzzle(
    'house-5x5',
    'House',
    Category.OBJECTS,
    Difficulty.EASY,
    houseSolution,
    'A simple house'
  ),
  
  // 10x10 Medium puzzles
  createPuzzle(
    'cat-10x10',
    'Cat Face',
    Category.ANIMALS,
    Difficulty.MEDIUM,
    catSolution,
    'A cute cat face'
  ),
  
  createPuzzle(
    'car-10x10',
    'Car',
    Category.VEHICLES,
    Difficulty.MEDIUM,
    carSolution,
    'A side view of a car'
  ),
  
  createPuzzle(
    'flower-10x10',
    'Flower',
    Category.NATURE,
    Difficulty.MEDIUM,
    flowerSolution,
    'A blooming flower'
  ),
  
  // 15x15 Hard puzzle
  createPuzzle(
    'tree-15x15',
    'Pine Tree',
    Category.NATURE,
    Difficulty.HARD,
    treeSolution,
    'A tall pine tree'
  ),
];

// Helper functions to get puzzles by different criteria
export function getPuzzlesByDifficulty(difficulty: Difficulty): NonogramPuzzle[] {
  return PUZZLES.filter(puzzle => puzzle.difficulty === difficulty);
}

export function getPuzzlesByCategory(category: Category): NonogramPuzzle[] {
  return PUZZLES.filter(puzzle => puzzle.category === category);
}

export function getPuzzlesBySize(width: number, height: number): NonogramPuzzle[] {
  return PUZZLES.filter(puzzle => 
    puzzle.size.width === width && puzzle.size.height === height
  );
}

export function getPuzzleById(id: string): NonogramPuzzle | undefined {
  return PUZZLES.find(puzzle => puzzle.id === id);
}

export function getRandomPuzzle(): NonogramPuzzle {
  return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
}

export function getRandomPuzzleByDifficulty(difficulty: Difficulty): NonogramPuzzle | undefined {
  const puzzles = getPuzzlesByDifficulty(difficulty);
  if (puzzles.length === 0) return undefined;
  return puzzles[Math.floor(Math.random() * puzzles.length)];
}
