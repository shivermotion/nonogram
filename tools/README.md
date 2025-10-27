# Nonogram Puzzle Creator Tool

A developer-facing HTML tool for creating custom nonogram puzzles that can be easily integrated into the game.

## Quick Start

1. Open `tools/puzzle-creator.html` in any web browser
2. Select your desired grid size (5x5, 10x10, or 15x15)
3. Draw your puzzle by clicking and dragging on the grid
4. Right-click to erase cells
5. Click "Generate Code" to create TypeScript code
6. Copy the generated code and paste it into `src/data/puzzles.ts`

## Features

### Grid Drawing

- **Left-click and drag**: Fill cells (black)
- **Right-click**: Erase cells (white)
- **Clear Grid button**: Reset entire grid
- **Real-time updates**: Clues and info update as you draw

### Auto-Generation

- **Clues**: Automatically generated for rows and columns
- **Puzzle name**: Auto-suggested based on grid size and pattern
- **Difficulty**: Auto-set based on grid size (5x5=Easy, 10x10=Medium/Hard, 15x15=Expert)
- **Category**: Manual selection with smart suggestions

### Validation

- **Fill percentage**: Shows how much of the grid is filled
- **Warnings**: Alerts for empty, too sparse, or too dense puzzles
- **Visual feedback**: Color-coded validation status

### Code Export

- **TypeScript ready**: Generates code that matches the existing puzzle format
- **Unique IDs**: Auto-generated puzzle identifiers
- **Copy to clipboard**: One-click code copying

## Grid Size Guidelines

### 5x5 (Easy)

- **Best for**: Simple, recognizable shapes
- **Examples**: Star, heart, cross, house, tree, fish, apple, moon
- **Tips**: Keep designs simple and symmetrical
- **Fill percentage**: 20-40% recommended

### 10x10 (Medium/Hard)

- **Best for**: More detailed objects and patterns
- **Examples**: Butterfly, boat, flower, trophy, bird, airplane, key
- **Tips**: Add details but maintain clarity
- **Fill percentage**: 25-50% recommended

### 15x15 (Expert)

- **Best for**: Complex, detailed designs
- **Examples**: Detailed animals, intricate patterns, complex objects
- **Tips**: Can handle more complex patterns and fine details
- **Fill percentage**: 30-60% recommended

## Creating Good Puzzles

### Design Principles

1. **Clarity**: Make sure the final image is recognizable
2. **Balance**: Don't make puzzles too sparse or too dense
3. **Uniqueness**: Ensure the puzzle has a unique solution
4. **Progression**: Start simple, add complexity gradually

### Common Patterns

- **Symmetrical designs**: Often work well for abstract puzzles
- **Organic shapes**: Good for animals, nature, food categories
- **Geometric patterns**: Perfect for abstract and object categories
- **Recognizable objects**: Best for easy puzzles

### Validation Tips

- **Empty puzzle**: Will show warning - add some filled cells
- **Too sparse**: Less than 10% filled - consider adding more detail
- **Too dense**: More than 80% filled - may be too challenging
- **Good range**: 20-60% filled cells usually work well

## Integration Steps

1. **Create puzzle** using the tool
2. **Copy generated code** from the export section
3. **Open** `src/data/puzzles.ts`
4. **Add the solution array** near the top with other solution definitions
5. **Add the puzzle creation call** in the PUZZLES array at the bottom
6. **Test** the puzzle in the game

### Example Integration

```typescript
// Add this near other solution arrays
const myPuzzleSolution: boolean[][] = [
  [false, true, false, true, false],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [false, true, true, true, false],
  [false, false, true, false, false],
];

// Add this to the PUZZLES array
const myPuzzle = createPuzzle(
  'myPuzzle_5x5',
  'My Custom Puzzle',
  Category.ABSTRACT,
  Difficulty.EASY,
  myPuzzleSolution,
  'Custom puzzle created with puzzle creator'
);

// Then add myPuzzle to the PUZZLES array
export const PUZZLES: NonogramPuzzle[] = [
  // ... existing puzzles
  myPuzzle,
];
```

## Troubleshooting

### Common Issues

- **Puzzle not showing**: Check that the puzzle is added to the PUZZLES array
- **Clues look wrong**: Verify the solution array matches what you drew
- **Game crashes**: Ensure all required fields are filled (name, category, difficulty)

### Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile browsers**: Limited support (use desktop for best experience)

## Tips for Success

1. **Start simple**: Begin with 5x5 puzzles to get familiar
2. **Test frequently**: Generate code and test in the game often
3. **Use references**: Look at existing puzzles for inspiration
4. **Iterate**: Don't be afraid to clear and redraw
5. **Validate**: Always check the validation status before exporting

Happy puzzle creating! 🎯
