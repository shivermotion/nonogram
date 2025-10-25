import React, { useRef, useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import {
  PanGestureHandler,
  State as GestureState,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { CellState, Position, NonogramPuzzle } from '../types/game';

const windowDimensions = Dimensions.get('window');
const screenWidth = windowDimensions.width;
const screenHeight = windowDimensions.height;

interface GameGridProps {
  puzzle: NonogramPuzzle;
  grid: CellState[][];
  onCellPress: (position: Position) => void;
  onCellLongPress?: (position: Position) => void;
  disabled?: boolean;
  showErrors?: boolean;
  cellSize?: number;
  showSolution?: boolean;
}

export const GameGrid: React.FC<GameGridProps> = ({
  puzzle,
  grid,
  onCellPress,
  onCellLongPress,
  disabled = false,
  showErrors = false,
  cellSize: propCellSize,
  showSolution = false,
}) => {
  const { size } = puzzle;
  const isDraggingRef = useRef(false);
  const visitedCellsRef = useRef<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const prevCellRef = useRef<{ row: number; col: number } | null>(null);
  const gridSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  const getCellFromLocal = (x: number, y: number) => {
    const { width, height } = gridSizeRef.current;
    const clampedX = Math.max(0, Math.min(x, Math.max(0, width - 1)));
    const clampedY = Math.max(0, Math.min(y, Math.max(0, height - 1)));
    const displayedCellW = width > 0 ? width / size.width : cellSize;
    const displayedCellH = height > 0 ? height / size.height : cellSize;
    const col = Math.floor(clampedX / displayedCellW);
    const row = Math.floor(clampedY / displayedCellH);
    return { row, col };
  };

  // Dynamic cell sizing based on grid size
  const getOptimalCellSize = () => {
    const maxGridSize = Math.min(screenWidth * 0.85, screenHeight * 0.5);
    const baseCellSize = Math.floor(maxGridSize / Math.max(size.width, size.height));

    // Ensure minimum readable size
    const minCellSize = 16;
    const maxCellSize = 40;

    return Math.max(minCellSize, Math.min(maxCellSize, baseCellSize));
  };

  const cellSize = propCellSize ?? getOptimalCellSize();
  const actualGridWidth = cellSize * size.width;
  const actualGridHeight = cellSize * size.height;

  const getCellStyle = (row: number, col: number) => {
    const cell = grid[row][col];
    const baseStyle: any[] = [styles.cell, { width: cellSize, height: cellSize }];

    // Add borders for visual separation
    const borderStyle: any = {};

    // Thick borders every 5 cells for better visual grouping
    if (row % 5 === 0) borderStyle.borderTopWidth = 2;
    if (col % 5 === 0) borderStyle.borderLeftWidth = 2;
    if (row === size.height - 1) borderStyle.borderBottomWidth = 2;
    if (col === size.width - 1) borderStyle.borderRightWidth = 2;

    baseStyle.push(borderStyle);

    // Cell state styles
    switch (cell) {
      case CellState.FILLED:
        baseStyle.push(styles.filledCell);
        break;
      case CellState.MARKED:
        baseStyle.push(styles.markedCell);
        break;
      case CellState.EMPTY:
      default:
        baseStyle.push(styles.emptyCell);
        break;
    }

    // Debug mode: show solution in green overlay
    if (showSolution && puzzle.solution[row][col]) {
      baseStyle.push(styles.solutionCell);
    }

    return baseStyle;
  };

  const renderRow = (rowIndex: number) => {
    return (
      <View key={rowIndex} style={styles.row}>
        {Array.from({ length: size.width }).map((_, colIndex) => (
          <TouchableOpacity
            key={`${rowIndex}-${colIndex}`}
            style={getCellStyle(rowIndex, colIndex)}
            onPress={() => {
              if (!disabled) {
                console.log('tap cell', { row: rowIndex, col: colIndex });
                onCellPress({ row: rowIndex, col: colIndex });
              }
            }}
            onLongPress={() => !disabled && onCellLongPress?.({ row: rowIndex, col: colIndex })}
            activeOpacity={disabled ? 1 : 0.7}
            disabled={disabled}
          >
            {grid[rowIndex][colIndex] === CellState.MARKED && (
              <View style={styles.markContainer}>
                <View style={[styles.markLine, styles.markLine1]} />
                <View style={[styles.markLine, styles.markLine2]} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const processCell = useCallback(
    (r: number, c: number) => {
      if (r < 0 || r >= size.height || c < 0 || c >= size.width) return;
      const key = `${r}-${c}`;
      if (!visitedCellsRef.current.has(key)) {
        visitedCellsRef.current.add(key);
        console.log('processCell (drag)', { row: r, col: c });
        onCellPress({ row: r, col: c });
      }
    },
    [onCellPress, size.height, size.width]
  );

  const handlePanEvent = useCallback(
    (e: PanGestureHandlerGestureEvent) => {
      if (disabled || !isDraggingRef.current) return;
      const { x, y, absoluteX, absoluteY } = e.nativeEvent as any;
      console.log('pan event', { x, y, absoluteX, absoluteY });
      const { row, col } = getCellFromLocal(x, y);
      const prev = prevCellRef.current;
      if (row >= 0 && row < size.height && col >= 0 && col < size.width) {
        if (prev && (prev.row !== row || prev.col !== col)) {
          const dr = row - prev.row;
          const dc = col - prev.col;
          const steps = Math.max(Math.abs(dr), Math.abs(dc));
          const stepR = dr === 0 ? 0 : dr / steps;
          const stepC = dc === 0 ? 0 : dc / steps;
          for (let i = 1; i <= steps; i++) {
            const r = Math.round(prev.row + stepR * i);
            const c = Math.round(prev.col + stepC * i);
            processCell(r, c);
          }
        } else {
          processCell(row, col);
        }
        prevCellRef.current = { row, col };
      }
    },
    [disabled, processCell, size.height, size.width]
  );

  const handlePanStateChange = useCallback(
    (e: PanGestureHandlerStateChangeEvent) => {
      const { state, x, y, absoluteX, absoluteY } = e.nativeEvent as any;
      console.log('pan state change', { state, x, y, absoluteX, absoluteY });
      if (disabled) return;
      if (state === GestureState.ACTIVE) {
        // Activate drag only after threshold (activeOffsetX/Y) exceeded
        isDraggingRef.current = true;
        setIsDragging(true);
        visitedCellsRef.current = new Set();
        prevCellRef.current = null;
      } else if (
        state === GestureState.END ||
        state === GestureState.CANCELLED ||
        state === GestureState.FAILED
      ) {
        isDraggingRef.current = false;
        setIsDragging(false);
        visitedCellsRef.current.clear();
        prevCellRef.current = null;
      }
    },
    [disabled]
  );

  const gridContent = (
    <PanGestureHandler
      enabled={!disabled}
      cancelsTouchesInView={false}
      activeOffsetX={[-8, 8]}
      activeOffsetY={[-8, 8]}
      onGestureEvent={handlePanEvent}
      onHandlerStateChange={handlePanStateChange}
    >
      <View
        style={styles.grid}
        onLayout={e => {
          const { width, height } = e.nativeEvent.layout;
          gridSizeRef.current = { width, height };
        }}
      >
        {Array.from({ length: size.height }).map((_, rowIndex) => renderRow(rowIndex))}
      </View>
    </PanGestureHandler>
  );

  return (
    <View
      style={[
        styles.container,
        {
          width: actualGridWidth + 4,
          height: actualGridHeight + 4,
        },
      ]}
    >
      {gridContent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: '#333',
    padding: 2,
    borderRadius: 4,
  },
  grid: {
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCell: {
    backgroundColor: '#fff',
  },
  filledCell: {
    backgroundColor: '#2c3e50',
  },
  markedCell: {
    backgroundColor: '#fff',
  },
  solutionCell: {
    backgroundColor: '#4ade80', // Green color to show solution
    opacity: 0.8,
  },
  markContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markLine: {
    position: 'absolute',
    backgroundColor: '#e74c3c',
    width: '70%',
    height: 2,
  },
  markLine1: {
    transform: [{ rotate: '45deg' }],
  },
  markLine2: {
    transform: [{ rotate: '-45deg' }],
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GameGrid;
