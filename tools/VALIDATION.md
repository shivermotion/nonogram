# Puzzle Validation Tool Documentation

## Overview

The Puzzle Validation Tool is a comprehensive nonogram solver and validator that ensures all puzzles in the game are uniquely solvable. It uses constraint propagation and backtracking algorithms to verify puzzle quality.

## Files

- `tools/puzzle-validator.html` - Interactive web-based validation tool
- `tools/extract-puzzles.js` - Script to extract puzzle data from TypeScript files
- `tools/test-solver.js` - Command-line testing script
- `tools/comprehensive-test.js` - Full validation test suite
- `tools/puzzle-data.json` - Extracted puzzle data in JSON format
- `tools/puzzle-data.js` - JavaScript module for browser import

## Usage

### Web Interface

1. Open `tools/puzzle-validator.html` in a web browser
2. Click "Load Puzzles" to load all puzzle data
3. Click "Validate All" to run validation on all puzzles
4. Review results showing valid, ambiguous, unsolvable, and invalid puzzles
5. Click "Export Report" to download validation results as JSON

### Command Line Testing

```bash
# Test all puzzles
node comprehensive-test.js

# Test specific solver functionality
node test-solver.js

# Extract puzzle data from TypeScript files
node extract-puzzles.js
```

## Validation Results

### Status Types

- **✅ VALID** - Puzzle is uniquely solvable and matches intended solution
- **⚠️ AMBIGUOUS** - Multiple valid solutions exist (puzzle needs refinement)
- **❌ UNSOLVABLE** - No valid solution exists (puzzle has design flaws)
- **❌ MISMATCH** - Solver found solution but it doesn't match intended design

### Current Statistics

Based on the latest validation run:

- **Total Puzzles**: 50
- **Valid**: 8 (16%)
- **Ambiguous**: 19 (38%)
- **Unsolvable**: 9 (18%)
- **Invalid**: 14 (28%)

### Educational Puzzles Performance

- **Total Educational**: 36 puzzles
- **Valid Educational**: 6 puzzles (16.7% success rate)
- **Valid Educational Puzzles**: T, E, I, L, F, Z

## Algorithm Details

### Constraint Propagation

The solver uses constraint propagation to fill cells that must be filled or empty based on clue patterns:

1. For each row/column, calculate minimum and maximum positions for each clue group
2. Fill cells in the overlap between min/max positions
3. Mark cells before min positions and after max positions as empty
4. Repeat until no more progress can be made

### Backtracking Search

When constraint propagation stalls:

1. Find an uncertain cell (marked as unknown)
2. Try filling the cell
3. Recursively solve with that assumption
4. If contradiction found, backtrack and try empty
5. Count total solutions found

### Solution Validation

The validator:

1. Generates clues from the intended solution
2. Runs the solver on those clues (without looking at the solution)
3. Compares found solution(s) with the intended solution
4. Reports validation status

## Fixing Problematic Puzzles

### Common Issues and Solutions

**Ambiguous Puzzles (Multiple Solutions)**:

- Add more filled cells to create distinctive patterns
- Break symmetry to eliminate alternative solutions
- Adjust corner/edge patterns for better constraints

**Unsolvable Puzzles (No Valid Solution)**:

- Check for impossible clue combinations
- Ensure clues match the intended pattern
- Verify the solution pattern is logically consistent

**Mismatch Puzzles**:

- Usually indicates solver bugs or data extraction issues
- Verify puzzle data extraction is correct
- Check solver implementation for edge cases

### Design Principles for Valid Puzzles

1. **Distinctive Patterns**: Use unique shapes that can't be confused
2. **Good Constraints**: Ensure clues provide enough information
3. **Avoid Symmetry**: Symmetric patterns often lead to ambiguity
4. **Test Early**: Use the validator during puzzle design
5. **Start Simple**: Begin with basic shapes and add complexity

## Integration with Development

### Adding New Puzzles

1. Design the puzzle solution in a 5x5, 10x10, or 15x15 grid
2. Add the solution array to `src/data/puzzles.ts`
3. Run `node extract-puzzles.js` to update puzzle data
4. Run `node comprehensive-test.js` to validate
5. Fix any issues before committing

### Continuous Validation

The validation tool should be run:

- Before releasing new puzzle packs
- When modifying existing puzzles
- During puzzle design process
- As part of automated testing

## Technical Notes

- Nonogram solving is NP-complete but small puzzles (5x5) solve quickly
- 10x10 and 15x15 puzzles may take longer but still under 1 second each
- The solver uses JavaScript for portability and ease of integration
- All puzzle data is extracted from TypeScript source files

## Troubleshooting

### Common Issues

**"Error loading puzzle data"**:

- Ensure `puzzle-data.js` exists (run `extract-puzzles.js`)
- Check file permissions and paths

**"No solutions found"**:

- Verify puzzle data extraction is correct
- Check for syntax errors in puzzle definitions
- Ensure solver implementation is working

**"All puzzles showing as invalid"**:

- Check data type consistency (boolean vs number)
- Verify clue generation is working correctly
- Test with known valid puzzles first

### Performance

- Large puzzles (15x15) may take longer to solve
- Ambiguous puzzles stop early when multiple solutions found
- Consider puzzle complexity when designing new puzzles

## Future Enhancements

- Visual puzzle editor integrated with validator
- Automatic puzzle generation with validation
- Performance optimizations for larger puzzles
- Integration with puzzle difficulty rating system
- Batch puzzle fixing tools
