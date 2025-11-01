import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Image as RNImage } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  State as GestureState,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Svg, { Path, Defs, LinearGradient, Stop, SvgXml } from 'react-native-svg';
import { CellState, Position, NonogramPuzzle } from '../types/game';
import { hapticLight, hapticMedium } from '../utils/haptics';
import StoneChipParticles, { StoneChipParticlesRef } from './StoneChipParticles';

const windowDimensions = Dimensions.get('window');
const screenWidth = windowDimensions.width;
const screenHeight = windowDimensions.height;

// SVG Icon Components
const CheckSquareIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Path
      stroke="none"
      fill="#167DA8"
      d="M6 0 L26 0 Q32 0 32 6 L32 26 Q32 32 26 32 L6 32 Q0 32 0 26 L0 6 Q0 0 6 0 M30 26 L30 6 Q30 2 26 2 L6 2 Q2 2 2 6 L2 26 Q2 30 6 30 L26 30 Q30 30 30 26"
    />
    <Path
      stroke="none"
      fill="#36BDF7"
      d="M30 26 Q30 30 26 30 L6 30 Q2 30 2 26 L2 6 Q2 2 6 2 L26 2 Q30 2 30 6 L30 26 M28 6 Q28 4 26 4 L6 4 Q4 4 4 6 L4 26 Q4 28 6 28 L26 28 Q28 28 28 26 L28 6"
    />
    <Path
      stroke="none"
      fill="#1C9FD7"
      d="M28 6 L28 26 Q28 28 26 28 L6 28 Q4 28 4 26 L4 6 Q4 4 6 4 L26 4 Q28 4 28 6"
    />
  </Svg>
);

const CrossIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18">
    <Path
      stroke="none"
      fill="#871023"
      d="M6.85 1.15 L9 3.3 11.15 1.15 11.2 1.15 Q12.35 0 14 0 L14.05 0 Q15.65 0 16.85 1.15 L16.85 1.2 Q18 2.35 18 4 L18 4.05 Q18 5.65 16.85 6.85 L14.7 9 16.85 11.15 16.85 11.2 Q18 12.35 18 14 L18 14.05 Q18 15.65 16.85 16.85 15.65 18 14.05 18 L14 18 Q12.35 18 11.2 16.85 L11.15 16.85 9 14.7 6.85 16.85 Q5.65 18 4.05 18 L4 18 Q2.35 18 1.2 16.85 L1.15 16.85 Q0 15.65 0 14.05 L0 14 Q0 12.35 1.15 11.2 L1.15 11.15 3.3 9 1.15 6.85 Q0 5.65 0 4.05 L0 4 Q0 2.35 1.15 1.2 L1.2 1.15 Q2.35 0 4 0 L4.05 0 Q5.65 0 6.85 1.15 M5.45 15.45 L9 11.85 12.6 15.45 Q13.15 16 14 16 14.85 16 15.45 15.45 16 14.85 16 14 16 13.15 15.45 12.6 L11.85 9 15.45 5.45 Q16 4.85 16 4 16 3.15 15.45 2.6 14.85 2 14 2 13.15 2 12.6 2.6 L9 6.15 5.45 2.6 Q4.85 2 4 2 3.15 2 2.6 2.6 2 3.15 2 4 2 4.85 2.6 5.45 L6.15 9 2.6 12.6 Q2 13.15 2 14 2 14.85 2.6 15.45 3.15 16 4 16 4.85 16 5.45 15.45"
    />
    <Path
      stroke="none"
      fill="#FF627B"
      d="M5.45 15.45 Q4.85 16 4 16 3.15 16 2.6 15.45 2 14.85 2 14 2 13.15 2.6 12.6 L6.15 9 2.6 5.45 Q2 4.85 2 4 2 3.15 2.6 2.6 3.15 2 4 2 4.85 2 5.45 2.6 L9 6.15 12.6 2.6 Q13.15 2 14 2 14.85 2 15.45 2.6 16 3.15 16 4 16 4.85 15.45 5.45 L11.85 9 15.45 12.6 Q16 13.15 16 14 16 14.85 15.45 15.45 14.85 16 14 16 13.15 16 12.6 15.45 L9 11.85 5.45 15.45"
    />
  </Svg>
);

const AnimatedMarkIcon: React.FC<{ size: number }> = ({ size }) => {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.05, { duration: 120 }),
      withTiming(1, { duration: 100 })
    );
    opacity.value = withTiming(1, { duration: 180 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={style}>
      <CrossIcon size={size} />
    </Animated.View>
  );
};

const FlatButtonIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path
      stroke="none"
      fill="#36BDF7"
      d="M27.45 4.05 L27.2 4.05 26.8 4.05 26.55 4.05 26 4 6 4 Q4.35 4 4.1 5.3 L4.05 5.5 4 6 4 24 4.05 24.55 4.05 24.8 4.05 25.2 4.05 25.45 4 26 4 54 Q4 56 6 56 L26 56 26.55 56 26.8 55.95 27.2 55.95 27.45 56 28 56 58 56 Q60 56 60 54 L60 26 60 25.45 59.95 25.2 59.95 24.8 60 24.55 60 24 60 6 59.95 5.3 60 5.35 Q59.65 4 58 4 L28 4 27.45 4.05 M61.95 25.2 L62 26 62 54 Q62 58 58 58 L28 58 27.2 57.95 26.8 57.95 26 58 6 58 Q2 58 2 54 L2 26 2.05 25.2 2.05 24.8 2 24 2 6 2.1 5.05 Q2.5 2 6 2 L26 2 26.8 2.05 27.2 2.05 28 2 58 2 Q61.5 2 61.95 5.05 L62 6 62 24 61.95 24.8 61.95 25.2"
    />
    <Path
      stroke="none"
      fill="#1C9FD7"
      d="M27.45 4.05 L28 4 58 4 Q59.65 4 60 5.35 L59.95 5.3 60 6 60 24 60 24.55 59.95 24.8 59.95 25.2 60 25.45 60 26 60 54 Q60 56 58 56 L28 56 27.45 56 27.2 55.95 26.8 55.95 26.55 56 26 56 6 56 Q4 56 4 54 L4 26 4.05 25.45 4.05 25.2 4.05 24.8 4.05 24.55 4 24 4 6 4.05 5.5 4.1 5.3 Q4.35 4 6 4 L26 4 26.55 4.05 26.8 4.05 27.2 4.05 27.45 4.05"
    />
    <Path
      stroke="none"
      fill="#167DA8"
      d="M61.95 25.2 L61.95 24.8 62 24 62 6 61.95 5.05 Q61.5 2 58 2 L28 2 27.2 2.05 26.8 2.05 26 2 6 2 Q2.5 2 2.1 5.05 L2 6 2 24 2.05 24.8 2.05 25.2 2 26 2 54 Q2 58 6 58 L26 58 26.8 57.95 27.2 57.95 28 58 58 58 Q62 58 62 54 L62 26 61.95 25.2 M0 24.75 L0 6 Q0 0 6 0 L26 0 27 0.05 28 0 58 0 Q64 0 64 6 L64 24.75 63.95 25 64 25.4 64 54.25 Q63.85 60 58 60 L28 60 27 59.95 26 60 6 60 Q0.15 60 0 54.25 L0 25.4 0.05 25 0 24.75"
    />
    <Path
      stroke="none"
      fill="#FF0000"
      d="M0 24.75 L0.05 25 0 25.4 0 24.75 M64 24.75 L64 25.4 63.95 25 64 24.75"
    />
    <Path
      stroke="none"
      fill="#146587"
      d="M64 54.25 L64 58 Q64 64 58 64 L28 64 27 63.95 26 64 6 64 Q0 64 0 58 L0 54.25 Q0.15 60 6 60 L26 60 27 59.95 28 60 58 60 Q63.85 60 64 54.25"
    />
  </Svg>
);

const GradientButtonIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Defs>
      <LinearGradient
        gradientUnits="userSpaceOnUse"
        x1="-819.2"
        x2="819.2"
        gradientTransform="matrix(0 0.03411865234375 -0.03173828125 0 176 30)"
        id="gradient0"
      >
        <Stop offset="0" stopColor="#35BAF3" />
        <Stop offset="1" stopColor="#1EA7E1" />
      </LinearGradient>
    </Defs>
    <Path
      stroke="none"
      fill="#36BDF7"
      d="M62 6 L62 54 Q62 58 58 58 L6 58 Q2 58 2 54 L2 6 2.1 5.05 Q2.5 2 6 2 L58 2 Q61.5 2 61.95 5.05 L62 6 M6 4 Q4.35 4 4.1 5.3 L4.05 5.5 4 6 4 54 Q4 56 6 56 L27.45 56 28 56 58 56 Q60 56 60 54 L60 24.55 60 24 60 6 59.95 5.3 60 5.35 Q59.65 4 58 4 L6 4"
    />
    <Path
      stroke="none"
      fill="url(#gradient0)"
      d="M6 4 L58 4 Q59.65 4 60 5.35 L59.95 5.3 60 6 60 24 60 24.55 60 54 Q60 56 58 56 L28 56 27.45 56 6 56 Q4 56 4 54 L4 6 4.05 5.5 4.1 5.3 Q4.35 4 6 4"
    />
    <Path
      stroke="none"
      fill="#167DA8"
      d="M0 54.25 L0 6 Q0 0 6 0 L58 0 Q64 0 64 6 L64 54.25 Q63.85 60 58 60 L6 60 Q0.15 60 0 54.25 M62 6 L61.95 5.05 Q61.5 2 58 2 L6 2 Q2.5 2 2.1 5.05 L2 6 2 54 Q2 58 6 58 L58 58 Q62 58 62 54 L62 6"
    />
    <Path
      stroke="none"
      fill="#146587"
      d="M64 54.25 L64 58 Q64 64 58 64 L6 64 Q0 64 0 58 L0 54.25 Q0.15 60 6 60 L58 60 Q63.85 60 64 54.25"
    />
  </Svg>
);

const AnimatedCellIcon: React.FC<{
  rowIndex: number;
  colIndex: number;
  cellSize: number;
  isAnimating: boolean;
}> = ({ rowIndex, colIndex, cellSize, isAnimating }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isAnimating) {
      // Start with flat button (scale down, no lift)
      scale.value = 0.95;
      translateY.value = 2;
      shadowOpacity.value = 0.1;

      // Animate to gradient button (scale up, lift up)
      scale.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(-2, { duration: 200 });
      shadowOpacity.value = withTiming(0.3, { duration: 200 });

      // Slight bounce effect
      scale.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }
  }, [isAnimating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: translateY.value * 2,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: 4,
    elevation: shadowOpacity.value * 8,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <FlatButtonIcon size={cellSize} />
    </Animated.View>
  );
};

interface GameGridProps {
  puzzle: NonogramPuzzle;
  grid: CellState[][];
  onCellPress: (position: Position) => void;
  onCellLongPress?: (position: Position) => void;
  disabled?: boolean;
  showErrors?: boolean;
  cellSize?: number;
  showSolution?: boolean;
  inputMode?: 'fill' | 'mark'; // To determine if we're filling or marking
  highlightedRowIndex?: number | null;
  highlightedColIndex?: number | null;
  pointerType?: 'row' | 'col' | 'cell';
  pointerTarget?: { row?: number; col?: number } | null;
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
  inputMode = 'fill',
  highlightedRowIndex = null,
  highlightedColIndex = null,
  pointerType,
  pointerTarget = null,
}) => {
  const { size } = puzzle;
  const isDraggingRef = useRef(false);
  const visitedCellsRef = useRef<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());
  const prevCellRef = useRef<{ row: number; col: number } | null>(null);
  const gridSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const gridContainerRef = useRef<View>(null);
  const particlesRef = useRef<StoneChipParticlesRef>(null);

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

  // Breathing glow for highlighted edges
  const glow = useSharedValue(0.4);
  useEffect(() => {
    glow.value = withRepeat(
      withSequence(withTiming(1, { duration: 1400 }), withTiming(0.4, { duration: 1400 })),
      -1,
      true
    );
  }, []);
  const glowOpacityStyle = useAnimatedStyle(() => ({ opacity: glow.value }));
  const glowShadowOpacityStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glow.value, [0.4, 1], [0.2, 0.6]),
  }));
  const handAnim = useSharedValue(0);
  useEffect(() => {
    handAnim.value = withRepeat(
      withSequence(withTiming(1, { duration: 700 }), withTiming(0, { duration: 700 })),
      -1,
      true
    );
  }, []);

  const POINTER_HAND_SVG = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 960 1200\"><path d=\"M660,390v120h-60V390H660z\"/><path d=\"M570,390v120h-60V390H570z\"/><path d=\"M480,390v120h-30v-30h-30v-90H480z\"/><path d=\"M660,720v120H330V720h30v30h60v-30h-60v-30h-60v-30h-30V510h30v-30h120v60h-60v30h-30v30h30v-30h60v-30h60v-30h30v30h60v-30  h30v30h60v150h-30v30H510v30h120v-30H660z\"/><rect x=\"360\" y=\"840\" width=\"270\" height=\"30\"/><rect x=\"330\" y=\"180\" width=\"60\" height=\"270\"/></svg>`;

  const handRowStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: -40 + interpolate(handAnim.value, [0, 1], [0, -6]),
    top:
      pointerTarget?.row !== undefined ? pointerTarget.row * cellSize + cellSize / 2 - 18 : -1000,
    transform: [{ rotate: '90deg' }],
  }));
  const handColStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left:
      pointerTarget?.col !== undefined ? pointerTarget.col * cellSize + cellSize / 2 - 18 : -1000,
    top: -40 + interpolate(handAnim.value, [0, 1], [0, -6]),
    transform: [{ rotate: '90deg' }],
  }));
  const handCellStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left:
      pointerTarget?.col !== undefined ? pointerTarget.col * cellSize + cellSize / 2 - 20 : -1000,
    top:
      pointerTarget?.row !== undefined ? pointerTarget.row * cellSize + cellSize / 2 - 20 : -1000,
    transform: [
      { rotate: '90deg' },
      { scale: 0.95 + interpolate(handAnim.value, [0, 1], [0, 0.1]) },
    ],
  }));

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

  const spawnParticlesAtCell = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!gridContainerRef.current || !particlesRef.current) {
        console.log('Cannot spawn particles: missing refs');
        return;
      }

      // Calculate cell center position relative to the grid container
      // The particles container is positioned absolutely within GameGrid container
      // So we need coordinates relative to that container
      const cellX = (colIndex + 0.5) * cellSize;
      const cellY = (rowIndex + 0.5) * cellSize;

      console.log('Spawning particles at cell:', { cellX, cellY, rowIndex, colIndex, cellSize });

      // Spawn particles at cell center
      if (particlesRef.current) {
        particlesRef.current.spawnParticles(cellX, cellY);
      }
    },
    [cellSize]
  );

  const renderRow = (rowIndex: number) => {
    return (
      <View key={rowIndex} style={styles.row}>
        {Array.from({ length: size.width }).map((_, colIndex) => {
          const wasFilled = grid[rowIndex][colIndex] === CellState.FILLED;

          return (
            <TouchableOpacity
              key={`${rowIndex}-${colIndex}`}
              style={getCellStyle(rowIndex, colIndex)}
              onPress={event => {
                if (!disabled) {
                  console.log('tap cell', { row: rowIndex, col: colIndex });
                  hapticLight(); // Haptic feedback for cell tap
                  const cellKey = `${rowIndex}-${colIndex}`;

                  // Check if we're filling and the cell will become filled
                  const willBeFilled = inputMode === 'fill' && !wasFilled;

                  // Add to animating cells
                  setAnimatingCells(prev => new Set(prev).add(cellKey));

                  // Remove from animating cells after animation completes
                  setTimeout(() => {
                    setAnimatingCells(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(cellKey);
                      return newSet;
                    });
                  }, 300);

                  // Spawn particles if filling a cell (optimistic - spawn immediately)
                  if (willBeFilled) {
                    spawnParticlesAtCell(rowIndex, colIndex);
                  }

                  onCellPress({ row: rowIndex, col: colIndex });
                }
              }}
              onLongPress={() => {
                if (!disabled) {
                  hapticMedium(); // Haptic feedback for long press (toggle)
                  onCellLongPress?.({ row: rowIndex, col: colIndex });
                }
              }}
              activeOpacity={disabled ? 1 : 0.7}
              disabled={disabled}
            >
              {grid[rowIndex][colIndex] === CellState.FILLED &&
                (animatingCells.has(`${rowIndex}-${colIndex}`) ? (
                  <AnimatedCellIcon
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    cellSize={cellSize}
                    isAnimating={true}
                  />
                ) : (
                  <GradientButtonIcon size={cellSize} />
                ))}
              {grid[rowIndex][colIndex] === CellState.MARKED && (
                <AnimatedMarkIcon size={cellSize * 0.6} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const processCell = useCallback(
    (r: number, c: number) => {
      if (r < 0 || r >= size.height || c < 0 || c >= size.width) return;
      const key = `${r}-${c}`;
      if (!visitedCellsRef.current.has(key)) {
        visitedCellsRef.current.add(key);
        hapticLight(); // Haptic feedback for drag cell interaction
        console.log('processCell (drag)', { row: r, col: c });

        const wasFilled = grid[r][c] === CellState.FILLED;
        const willBeFilled = inputMode === 'fill' && !wasFilled;

        const cellKey = `${r}-${c}`;
        setAnimatingCells(prev => new Set(prev).add(cellKey));
        setTimeout(() => {
          setAnimatingCells(prev => {
            const next = new Set(prev);
            next.delete(cellKey);
            return next;
          });
        }, 300);

        // Spawn particles if filling during drag - always from cell center
        if (willBeFilled) {
          spawnParticlesAtCell(r, c);
        }

        onCellPress({ row: r, col: c });
      }
    },
    [onCellPress, size.height, size.width, grid, inputMode, spawnParticlesAtCell]
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
        ref={gridContainerRef}
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
      {(highlightedRowIndex !== null || highlightedColIndex !== null) && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            width: actualGridWidth,
            height: actualGridHeight,
          }}
        >
          {highlightedRowIndex !== null && (
            <>
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    left: 0,
                    top: highlightedRowIndex * cellSize - 2,
                    width: actualGridWidth,
                    height: 4,
                    backgroundColor: '#36BDF7',
                    shadowColor: '#167DA8',
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 6,
                    elevation: 6,
                    borderRadius: 2,
                  },
                  glowOpacityStyle,
                  glowShadowOpacityStyle,
                ]}
              />
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    left: 0,
                    top: (highlightedRowIndex + 1) * cellSize - 2,
                    width: actualGridWidth,
                    height: 4,
                    backgroundColor: '#36BDF7',
                    shadowColor: '#167DA8',
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 6,
                    elevation: 6,
                    borderRadius: 2,
                  },
                  glowOpacityStyle,
                  glowShadowOpacityStyle,
                ]}
              />
            </>
          )}
          {highlightedColIndex !== null && (
            <>
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    top: 0,
                    left: highlightedColIndex * cellSize - 2,
                    width: 4,
                    height: actualGridHeight,
                    backgroundColor: '#36BDF7',
                    shadowColor: '#167DA8',
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 6,
                    elevation: 6,
                    borderRadius: 2,
                  },
                  glowOpacityStyle,
                  glowShadowOpacityStyle,
                ]}
              />
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    top: 0,
                    left: (highlightedColIndex + 1) * cellSize - 2,
                    width: 4,
                    height: actualGridHeight,
                    backgroundColor: '#36BDF7',
                    shadowColor: '#167DA8',
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 6,
                    elevation: 6,
                    borderRadius: 2,
                  },
                  glowOpacityStyle,
                  glowShadowOpacityStyle,
                ]}
              />
            </>
          )}
        </View>
      )}
      {pointerType && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            width: actualGridWidth,
            height: actualGridHeight,
          }}
        >
          {pointerType === 'row' && pointerTarget?.row !== undefined && (
            <Animated.View style={handRowStyle}>
              <SvgXml xml={POINTER_HAND_SVG} width={36} height={36} />
            </Animated.View>
          )}
          {pointerType === 'col' && pointerTarget?.col !== undefined && (
            <Animated.View style={handColStyle}>
              <SvgXml xml={POINTER_HAND_SVG} width={36} height={36} />
            </Animated.View>
          )}
          {pointerType === 'cell' &&
            pointerTarget?.row !== undefined &&
            pointerTarget?.col !== undefined && (
              <Animated.View style={handCellStyle}>
                <SvgXml xml={POINTER_HAND_SVG} width={40} height={40} />
              </Animated.View>
            )}
        </View>
      )}
      <StoneChipParticles ref={particlesRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: '#333',
    padding: 2,
    borderRadius: 4,
    overflow: 'visible', // Allow particles to overflow container
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
    backgroundColor: '#fff',
  },
  markedCell: {
    backgroundColor: '#fff',
  },
  solutionCell: {
    backgroundColor: '#4ade80', // Green color to show solution
    opacity: 0.8,
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GameGrid;
