import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Clue, NonogramPuzzle, CellState } from '../types/game';
import { isLineValid } from '../utils/nonogramLogic';

const windowDimensions = Dimensions.get('window');
const screenWidth = windowDimensions.width;
const screenHeight = windowDimensions.height;

interface CluesDisplayProps {
  puzzle: NonogramPuzzle;
  grid?: CellState[][];
  showValidation?: boolean;
  cellSize?: number;
  renderGrid?: () => React.ReactNode;
}

export const CluesDisplay: React.FC<CluesDisplayProps> = ({
  puzzle,
  grid,
  showValidation = false,
  cellSize: propCellSize,
  renderGrid,
}) => {
  const { size, rowClues, colClues } = puzzle;

  // Use provided cellSize or calculate fallback
  const cellSize =
    propCellSize ??
    (() => {
      const maxGridSize = Math.min(screenWidth * 0.8, screenHeight * 0.6);
      return Math.floor(maxGridSize / Math.max(size.width, size.height));
    })();

  // Smart clue area sizing - fixed within bounds, responsive to screen constraints
  const actualMaxRowClues = Math.max(...rowClues.map(clue => clue.length));
  const actualMaxColClues = Math.max(...colClues.map(clue => clue.length));

  // Theoretical maximum vs actual maximum (use smaller to prevent overflow)
  const theoreticalMaxRow = Math.ceil(size.width / 2);
  const theoreticalMaxCol = Math.ceil(size.height / 2);

  // For consistency, use theoretical max but cap it based on screen constraints
  const isLargePuzzle = size.width >= 15 || size.height >= 15;
  const isMediumPuzzle = size.width >= 10 || size.height >= 10;

  let clueNumberWidth, clueNumberHeight, clueFontSize, maxAllowedRowClues, maxAllowedColClues;
  if (isLargePuzzle) {
    clueNumberWidth = 18; // Tighter spacing for larger puzzles
    clueNumberHeight = 16;
    clueFontSize = 10;
    // Cap clues to prevent overflow on large puzzles
    maxAllowedRowClues = Math.min(theoreticalMaxRow, Math.max(6, actualMaxRowClues));
    maxAllowedColClues = Math.min(theoreticalMaxCol, Math.max(6, actualMaxColClues));
  } else if (isMediumPuzzle) {
    clueNumberWidth = 22;
    clueNumberHeight = 18;
    clueFontSize = 11;
    maxAllowedRowClues = Math.min(theoreticalMaxRow, Math.max(5, actualMaxRowClues));
    maxAllowedColClues = Math.min(theoreticalMaxCol, Math.max(5, actualMaxColClues));
  } else {
    clueNumberWidth = 25;
    clueNumberHeight = 20;
    clueFontSize = 12;
    maxAllowedRowClues = theoreticalMaxRow; // Small puzzles can use full theoretical max
    maxAllowedColClues = theoreticalMaxCol;
  }

  const rowClueWidth = maxAllowedRowClues * clueNumberWidth + 15;
  const colClueHeight = maxAllowedColClues * clueNumberHeight + 15;

  const isRowValid = (rowIndex: number): boolean => {
    if (!grid || !showValidation) return true;
    return isLineValid(grid[rowIndex], rowClues[rowIndex], true);
  };

  const isColValid = (colIndex: number): boolean => {
    if (!grid || !showValidation) return true;
    const column = grid.map(row => row[colIndex]);
    return isLineValid(column, colClues[colIndex], true);
  };

  const renderRowClue = (clue: Clue, index: number) => {
    const isValid = isRowValid(index);
    const isEvenRow = index % 2 === 0;

    return (
      <View
        key={index}
        style={[
          styles.rowClue,
          {
            height: cellSize,
            width: rowClueWidth,
            backgroundColor: isValid ? (isEvenRow ? '#f8f9fa' : '#ffffff') : '#ffebee',
          },
        ]}
      >
        <Text
          style={[styles.clueText, { color: isValid ? '#333' : '#d32f2f', fontSize: clueFontSize }]}
        >
          {clue[0] === 0 ? '0' : clue.join(' ')}
        </Text>
      </View>
    );
  };

  const renderColClue = (clue: Clue, index: number) => {
    const isValid = isColValid(index);
    const isEvenCol = index % 2 === 0;

    return (
      <View
        key={index}
        style={[
          styles.colClue,
          {
            width: cellSize,
            height: colClueHeight,
            backgroundColor: isValid ? (isEvenCol ? '#f8f9fa' : '#ffffff') : '#ffebee',
          },
        ]}
      >
        {clue[0] === 0 ? (
          <Text
            style={[
              styles.clueText,
              styles.verticalText,
              { color: isValid ? '#333' : '#d32f2f', fontSize: clueFontSize },
            ]}
          >
            0
          </Text>
        ) : (
          clue.map((num, numIndex) => (
            <Text
              key={numIndex}
              style={[
                styles.clueText,
                styles.verticalText,
                { color: isValid ? '#333' : '#d32f2f', fontSize: clueFontSize },
              ]}
            >
              {num}
            </Text>
          ))
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top row: Corner + Column clues */}
      <View style={styles.topRow}>
        <View style={[styles.corner, { width: rowClueWidth, height: colClueHeight }]} />
        <View style={styles.colCluesContainer}>
          {colClues.map((clue, index) => renderColClue(clue, index))}
        </View>
      </View>

      {/* Bottom row: Row clues + Grid */}
      <View style={styles.bottomRow}>
        <View style={styles.rowCluesContainer}>
          {rowClues.map((clue, index) => renderRowClue(clue, index))}
        </View>
        {renderGrid && renderGrid()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  corner: {
    backgroundColor: '#f5f5f5',
  },
  rowCluesContainer: {
    flexDirection: 'column',
  },
  colCluesContainer: {
    flexDirection: 'row',
  },
  rowClue: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  colClue: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    borderRightWidth: 0.5,
    borderRightColor: '#ddd',
    flexDirection: 'column',
  },
  clueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  verticalText: {
    textAlign: 'center',
    marginVertical: 1,
  },
});

export default CluesDisplay;
