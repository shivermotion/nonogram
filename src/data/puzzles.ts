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

// New 5x5 Easy Puzzles
const starSolution: boolean[][] = [
  [false, false, true,  false, false],
  [false, true,  false, true,  false],
  [true,  false, true,  false, true ],
  [false, true,  false, true,  false],
  [false, false, true,  false, false]
];

const fishSolution: boolean[][] = [
  [false, true,  true,  false, false],
  [true,  true,  true,  true,  false],
  [true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  false],
  [false, true,  true,  false, false]
];

const appleSolution: boolean[][] = [
  [false, false, true,  false, false],
  [false, true,  true,  true,  false],
  [true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true ],
  [false, true,  true,  true,  false]
];

const moonSolution: boolean[][] = [
  [false, true,  true,  true,  false],
  [true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true ],
  [false, true,  true,  true,  false]
];

// New 10x10 Medium/Hard Puzzles
const butterflySolution: boolean[][] = [
  [false, false, false, true,  true,  true,  true,  false, false, false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  false],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, false, false, true,  true,  true,  true,  false, false, false],
  [false, false, false, false, true,  true,  false, false, false, false]
];

const trophySolution: boolean[][] = [
  [false, false, false, true,  true,  true,  true,  false, false, false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  false],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, false, false, true,  true,  true,  true,  false, false, false],
  [false, false, false, false, true,  true,  false, false, false, false]
];

const birdSolution: boolean[][] = [
  [false, false, false, true,  true,  true,  true,  false, false, false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  false],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, false, false, true,  true,  true,  true,  false, false, false],
  [false, false, false, false, true,  true,  false, false, false, false]
];

const airplaneSolution: boolean[][] = [
  [false, false, false, true,  true,  true,  true,  false, false, false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  false],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  false],
  [false, false, true,  true,  true,  true,  true,  true,  false, false],
  [false, false, false, true,  true,  true,  true,  false, false, false],
  [false, false, false, false, true,  true,  false, false, false, false]
];

// Educational Puzzles - Numbers 0-9 (5x5 block/digital style)
const number0Solution: boolean[][] = [
  [false, true,  true,  true,  false],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [false, true,  true,  true,  false]
];

const number1Solution: boolean[][] = [
  [false, false, true,  false, false],
  [false, true,  true,  false, false],
  [false, false, true,  false, false],
  [false, false, true,  false, false],
  [false, true,  true,  true,  false]
];

const number2Solution: boolean[][] = [
  [false, true,  true,  true,  false],
  [false, false, false, false, true ],
  [false, true,  true,  true,  false],
  [true,  false, false, false, false],
  [true,  true,  true,  true,  false]
];

const number3Solution: boolean[][] = [
  [true,  true,  true,  true,  false],
  [false, false, false, false, true ],
  [false, true,  true,  true,  false],
  [false, false, false, false, true ],
  [true,  true,  true,  true,  false]
];

const number4Solution: boolean[][] = [
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [true,  true,  true,  true,  true ],
  [false, false, false, false, true ],
  [false, false, false, false, true ]
];

const number5Solution: boolean[][] = [
  [true,  true,  true,  true,  true ],
  [true,  false, false, false, false],
  [true,  true,  true,  true,  false],
  [false, false, false, false, true ],
  [true,  true,  true,  true,  false]
];

const number6Solution: boolean[][] = [
  [false, true,  true,  true,  false],
  [true,  false, false, false, false],
  [true,  true,  true,  true,  false],
  [true,  false, false, false, true ],
  [false, true,  true,  true,  false]
];

const number7Solution: boolean[][] = [
  [true,  true,  true,  true,  true ],
  [false, false, false, false, true ],
  [false, false, false, true,  false],
  [false, false, true,  false, false],
  [false, true,  false, false, false]
];

const number8Solution: boolean[][] = [
  [false, true,  true,  true,  false],
  [true,  false, false, false, true ],
  [false, true,  true,  true,  false],
  [true,  false, false, false, true ],
  [false, true,  true,  true,  false]
];

const number9Solution: boolean[][] = [
  [false, true,  true,  true,  false],
  [true,  false, false, false, true ],
  [false, true,  true,  true,  true ],
  [false, false, false, false, true ],
  [false, true,  true,  true,  false]
];

// Educational Puzzles - Letters A-Z (5x5 block/capital style)
const letterASolution: boolean[][] = [
  [false, true,  true,  true,  false],
  [true,  false, false, false, true ],
  [true,  true,  true,  true,  true ],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ]
];

const letterBSolution: boolean[][] = [
  [true,  true,  true,  true,  false],
  [true,  false, false, false, true ],
  [true,  true,  true,  true,  false],
  [true,  false, false, false, true ],
  [true,  true,  true,  true,  false]
];

const letterCSolution: boolean[][] = [
  [false, true,  true,  true,  false],
  [true,  false, false, false, false],
  [true,  false, false, false, false],
  [true,  false, false, false, false],
  [false, true,  true,  true,  false]
];

const letterDSolution: boolean[][] = [
  [true,  true,  true,  true,  false],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [true,  true,  true,  true,  false]
];

const letterESolution: boolean[][] = [
  [true,  true,  true,  true,  true ],
  [true,  false, false, false, false],
  [true,  true,  true,  true,  false],
  [true,  false, false, false, false],
  [true,  true,  true,  true,  true ]
];

const letterFSolution: boolean[][] = [
  [true,  true,  true,  true,  true ],
  [true,  false, false, false, false],
  [true,  true,  true,  true,  false],
  [true,  false, false, false, false],
  [true,  false, false, false, false]
];

const letterGSolution: boolean[][] = [
  [false, true,  true,  true,  false],
  [true,  false, false, false, false],
  [true,  false, true,  true,  true ],
  [true,  false, false, false, true ],
  [false, true,  true,  true,  false]
];

const letterHSolution: boolean[][] = [
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [true,  true,  true,  true,  true ],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ]
];

const letterISolution: boolean[][] = [
  [true,  true,  true,  true,  true ],
  [false, false, true,  false, false],
  [false, false, true,  false, false],
  [false, false, true,  false, false],
  [true,  true,  true,  true,  true ]
];

const letterJSolution: boolean[][] = [
  [true,  true,  true,  true,  true ],
  [false, false, false, true,  false],
  [false, false, false, true,  false],
  [true,  false, false, true,  false],
  [false, true,  true,  false, false]
];

const letterKSolution: boolean[][] = [
  [true,  false, false, false, true ],
  [true,  false, false, true,  false],
  [true,  true,  true,  false, false],
  [true,  false, false, true,  false],
  [true,  false, false, false, true ]
];

const letterLSolution: boolean[][] = [
  [true,  false, false, false, false],
  [true,  false, false, false, false],
  [true,  false, false, false, false],
  [true,  false, false, false, false],
  [true,  true,  true,  true,  true ]
];

const letterMSolution: boolean[][] = [
  [true,  false, false, false, true ],
  [true,  true,  false, true,  true ],
  [true,  false, true,  false, true ],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ]
];

const letterNSolution: boolean[][] = [
  [true,  false, false, false, true ],
  [true,  true,  false, false, true ],
  [true,  false, true,  false, true ],
  [true,  false, false, true,  true ],
  [true,  false, false, false, true ]
];

const letterOSolution: boolean[][] = [
  [false, true,  true,  true,  false],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [false, true,  true,  true,  false]
];

const letterPSolution: boolean[][] = [
  [true,  true,  true,  true,  false],
  [true,  false, false, false, true ],
  [true,  true,  true,  true,  false],
  [true,  false, false, false, false],
  [true,  false, false, false, false]
];

const letterQSolution: boolean[][] = [
  [false, true,  true,  true,  false],
  [true,  false, false, false, true ],
  [true,  false, true,  false, true ],
  [true,  false, false, true,  true ],
  [false, true,  true,  true,  true ]
];

const letterRSolution: boolean[][] = [
  [true,  true,  true,  true,  false],
  [true,  false, false, false, true ],
  [true,  true,  true,  true,  false],
  [true,  false, false, true,  false],
  [true,  false, false, false, true ]
];

const letterSSolution: boolean[][] = [
  [false, true,  true,  true,  true ],
  [true,  false, false, false, false],
  [false, true,  true,  true,  false],
  [false, false, false, false, true ],
  [true,  true,  true,  true,  false]
];

const letterTSolution: boolean[][] = [
  [true,  true,  true,  true,  true ],
  [false, false, true,  false, false],
  [false, false, true,  false, false],
  [false, false, true,  false, false],
  [false, false, true,  false, false]
];

const letterUSolution: boolean[][] = [
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [false, true,  true,  true,  false]
];

const letterVSolution: boolean[][] = [
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [false, true,  false, true,  false],
  [false, false, true,  false, false]
];

const letterWSolution: boolean[][] = [
  [true,  false, false, false, true ],
  [true,  false, false, false, true ],
  [true,  false, true,  false, true ],
  [true,  true,  false, true,  true ],
  [true,  false, false, false, true ]
];

const letterXSolution: boolean[][] = [
  [true,  false, false, false, true ],
  [false, true,  false, true,  false],
  [false, false, true,  false, false],
  [false, true,  false, true,  false],
  [true,  false, false, false, true ]
];

const letterYSolution: boolean[][] = [
  [true,  false, false, false, true ],
  [false, true,  false, true,  false],
  [false, false, true,  false, false],
  [false, false, true,  false, false],
  [false, false, true,  false, false]
];

const letterZSolution: boolean[][] = [
  [true,  true,  true,  true,  true ],
  [false, false, false, true,  false],
  [false, false, true,  false, false],
  [false, true,  false, false, false],
  [true,  true,  true,  true,  true ]
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
  
  // New 5x5 Easy puzzles
  createPuzzle(
    'star-5x5',
    'Star',
    Category.ABSTRACT,
    Difficulty.EASY,
    starSolution,
    'A simple star shape'
  ),
  
  createPuzzle(
    'fish-5x5',
    'Fish',
    Category.ANIMALS,
    Difficulty.EASY,
    fishSolution,
    'A small fish'
  ),
  
  createPuzzle(
    'apple-5x5',
    'Apple',
    Category.FOOD,
    Difficulty.EASY,
    appleSolution,
    'A tasty apple'
  ),
  
  createPuzzle(
    'moon-5x5',
    'Moon',
    Category.NATURE,
    Difficulty.EASY,
    moonSolution,
    'A full moon'
  ),
  
  // New 10x10 Medium/Hard puzzles
  createPuzzle(
    'butterfly-10x10',
    'Butterfly',
    Category.ANIMALS,
    Difficulty.MEDIUM,
    butterflySolution,
    'A beautiful butterfly'
  ),
  
  createPuzzle(
    'trophy-10x10',
    'Trophy',
    Category.OBJECTS,
    Difficulty.MEDIUM,
    trophySolution,
    'A winner\'s trophy'
  ),
  
  createPuzzle(
    'bird-10x10',
    'Bird',
    Category.ANIMALS,
    Difficulty.HARD,
    birdSolution,
    'A flying bird'
  ),
  
  createPuzzle(
    'airplane-10x10',
    'Airplane',
    Category.VEHICLES,
    Difficulty.MEDIUM,
    airplaneSolution,
    'An airplane in flight'
  ),

  // Educational Puzzles - Mixed Random Order (Numbers 0-9 & Letters A-Z)
  createPuzzle(
    'letter_m_5x5',
    'Letter M',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterMSolution,
    'The letter M'
  ),
  createPuzzle(
    'number_7_5x5',
    'Number 7',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    number7Solution,
    'The number 7'
  ),
  createPuzzle(
    'letter_a_5x5',
    'Letter A',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterASolution,
    'The letter A'
  ),
  createPuzzle(
    'number_3_5x5',
    'Number 3',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    number3Solution,
    'The number 3'
  ),
  createPuzzle(
    'letter_t_5x5',
    'Letter T',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterTSolution,
    'The letter T'
  ),
  createPuzzle(
    'number_9_5x5',
    'Number 9',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    number9Solution,
    'The number 9'
  ),
  createPuzzle(
    'letter_s_5x5',
    'Letter S',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterSSolution,
    'The letter S'
  ),
  createPuzzle(
    'number_1_5x5',
    'Number 1',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    number1Solution,
    'The number 1'
  ),
  createPuzzle(
    'letter_e_5x5',
    'Letter E',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterESolution,
    'The letter E'
  ),
  createPuzzle(
    'number_5_5x5',
    'Number 5',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    number5Solution,
    'The number 5'
  ),
  createPuzzle(
    'letter_r_5x5',
    'Letter R',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterRSolution,
    'The letter R'
  ),
  createPuzzle(
    'number_0_5x5',
    'Number 0',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    number0Solution,
    'The number 0'
  ),
  createPuzzle(
    'letter_i_5x5',
    'Letter I',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterISolution,
    'The letter I'
  ),
  createPuzzle(
    'number_8_5x5',
    'Number 8',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    number8Solution,
    'The number 8'
  ),
  createPuzzle(
    'letter_o_5x5',
    'Letter O',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterOSolution,
    'The letter O'
  ),
  createPuzzle(
    'number_2_5x5',
    'Number 2',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    number2Solution,
    'The number 2'
  ),
  createPuzzle(
    'letter_n_5x5',
    'Letter N',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterNSolution,
    'The letter N'
  ),
  createPuzzle(
    'number_6_5x5',
    'Number 6',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    number6Solution,
    'The number 6'
  ),
  createPuzzle(
    'letter_h_5x5',
    'Letter H',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterHSolution,
    'The letter H'
  ),
  createPuzzle(
    'number_4_5x5',
    'Number 4',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    number4Solution,
    'The number 4'
  ),
  createPuzzle(
    'letter_l_5x5',
    'Letter L',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterLSolution,
    'The letter L'
  ),
  createPuzzle(
    'letter_d_5x5',
    'Letter D',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterDSolution,
    'The letter D'
  ),
  createPuzzle(
    'letter_c_5x5',
    'Letter C',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterCSolution,
    'The letter C'
  ),
  createPuzzle(
    'letter_u_5x5',
    'Letter U',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterUSolution,
    'The letter U'
  ),
  createPuzzle(
    'letter_p_5x5',
    'Letter P',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterPSolution,
    'The letter P'
  ),
  createPuzzle(
    'letter_f_5x5',
    'Letter F',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterFSolution,
    'The letter F'
  ),
  createPuzzle(
    'letter_g_5x5',
    'Letter G',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterGSolution,
    'The letter G'
  ),
  createPuzzle(
    'letter_w_5x5',
    'Letter W',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterWSolution,
    'The letter W'
  ),
  createPuzzle(
    'letter_y_5x5',
    'Letter Y',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterYSolution,
    'The letter Y'
  ),
  createPuzzle(
    'letter_b_5x5',
    'Letter B',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterBSolution,
    'The letter B'
  ),
  createPuzzle(
    'letter_v_5x5',
    'Letter V',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterVSolution,
    'The letter V'
  ),
  createPuzzle(
    'letter_k_5x5',
    'Letter K',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterKSolution,
    'The letter K'
  ),
  createPuzzle(
    'letter_j_5x5',
    'Letter J',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterJSolution,
    'The letter J'
  ),
  createPuzzle(
    'letter_x_5x5',
    'Letter X',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterXSolution,
    'The letter X'
  ),
  createPuzzle(
    'letter_q_5x5',
    'Letter Q',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterQSolution,
    'The letter Q'
  ),
  createPuzzle(
    'letter_z_5x5',
    'Letter Z',
    Category.EDUCATIONAL,
    Difficulty.EASY,
    letterZSolution,
    'The letter Z'
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
