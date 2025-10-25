import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { NonogramPuzzle, CellState, Position } from '../types/game';
import { useGame } from '../hooks/useGame';
import GameGrid from '../components/GameGrid';
import CluesDisplay from '../components/CluesDisplay';
import DepthFog from '../components/DepthFog';
import LightRays from '../components/LightRays';
import GridBackground from '../components/GridBackground';

const windowDimensions = Dimensions.get('window');
const screenWidth = windowDimensions.width;
const screenHeight = windowDimensions.height;

interface GameScreenProps {
  puzzle: NonogramPuzzle;
  onBack: () => void;
  onComplete?: (puzzle: NonogramPuzzle, time: number, hintsUsed: number) => void;
}

enum InputMode {
  FILL = 'fill',
  MARK = 'mark',
}

export const GameScreen: React.FC<GameScreenProps> = ({ puzzle, onBack, onComplete }) => {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.FILL);
  const [showSolution, setShowSolution] = useState(false);
  const [displayTick, setDisplayTick] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);
  const [completedTime, setCompletedTime] = useState<number>(0);
  const [completedHints, setCompletedHints] = useState<number>(0);

  // Clue sizing calculation (shared) to avoid duplication
  const clueSizing = useMemo(() => {
    const actualMaxRowClues = Math.max(...puzzle.rowClues.map(clue => clue.length));
    const actualMaxColClues = Math.max(...puzzle.colClues.map(clue => clue.length));
    const theoreticalMaxRow = Math.ceil(puzzle.size.width / 2);
    const theoreticalMaxCol = Math.ceil(puzzle.size.height / 2);
    const isLargePuzzle = puzzle.size.width >= 15 || puzzle.size.height >= 15;
    const isMediumPuzzle = puzzle.size.width >= 10 || puzzle.size.height >= 10;

    let clueNumberWidth: number;
    let clueNumberHeight: number;
    let maxAllowedRowClues: number;
    let maxAllowedColClues: number;

    if (isLargePuzzle) {
      clueNumberWidth = 18;
      clueNumberHeight = 16;
      maxAllowedRowClues = Math.min(theoreticalMaxRow, Math.max(6, actualMaxRowClues));
      maxAllowedColClues = Math.min(theoreticalMaxCol, Math.max(6, actualMaxColClues));
    } else if (isMediumPuzzle) {
      clueNumberWidth = 22;
      clueNumberHeight = 18;
      maxAllowedRowClues = Math.min(theoreticalMaxRow, Math.max(5, actualMaxRowClues));
      maxAllowedColClues = Math.min(theoreticalMaxCol, Math.max(5, actualMaxColClues));
    } else {
      clueNumberWidth = 25;
      clueNumberHeight = 20;
      maxAllowedRowClues = theoreticalMaxRow;
      maxAllowedColClues = theoreticalMaxCol;
    }

    return { clueNumberWidth, clueNumberHeight, maxAllowedRowClues, maxAllowedColClues };
  }, [puzzle.size.width, puzzle.size.height, puzzle.rowClues, puzzle.colClues]);

  // Shared cell size calculation for both CluesDisplay and GameGrid
  const getOptimalCellSize = useCallback(() => {
    const { clueNumberWidth, clueNumberHeight, maxAllowedRowClues, maxAllowedColClues } =
      clueSizing;
    const estimatedRowClueWidth = maxAllowedRowClues * clueNumberWidth + 15;
    const estimatedColClueHeight = maxAllowedColClues * clueNumberHeight + 15;

    const availableWidth = screenWidth - estimatedRowClueWidth - 40; // margins
    const availableHeight = screenHeight * 0.6 - estimatedColClueHeight; // info/header area

    const baseCellSize = Math.floor(
      Math.min(availableWidth / puzzle.size.width, availableHeight / puzzle.size.height)
    );

    let minCellSize: number;
    let maxCellSize: number;
    if (puzzle.size.width >= 15 || puzzle.size.height >= 15) {
      minCellSize = 18;
      maxCellSize = 30;
    } else if (puzzle.size.width >= 10 || puzzle.size.height >= 10) {
      minCellSize = 22;
      maxCellSize = 35;
    } else {
      minCellSize = 28;
      maxCellSize = 45;
    }

    return Math.max(minCellSize, Math.min(maxCellSize, baseCellSize));
  }, [clueSizing, puzzle.size.width, puzzle.size.height]);

  const cellSize = getOptimalCellSize();

  // Calculate clue area sizes (same as CluesDisplay) - Smart sizing (shared)
  const { clueNumberWidth, clueNumberHeight, maxAllowedRowClues, maxAllowedColClues } = clueSizing;
  const rowClueWidth = useMemo(
    () => maxAllowedRowClues * clueNumberWidth + 15,
    [maxAllowedRowClues, clueNumberWidth]
  );
  const colClueHeight = useMemo(
    () => maxAllowedColClues * clueNumberHeight + 15,
    [maxAllowedColClues, clueNumberHeight]
  );

  const {
    session,
    fillCell,
    markCell,
    toggleCell,
    pauseGame,
    resumeGame,
    resetGame,
    getHint,
    getElapsedTime,
    isPlaying,
    isPaused,
    isCompleted,
    hintsUsed,
  } = useGame({
    puzzle,
    onGameComplete: completedSession => {
      setCompletedTime(completedSession.elapsedTime);
      setCompletedHints(completedSession.hintsUsed);
      setShowCompleted(true);
    },
  });

  // Local UI tick to refresh the timer text while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setDisplayTick(prev => (prev + 1) % 1_000_000);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCellPress = useCallback(
    (position: Position) => {
      if (inputMode === InputMode.FILL) {
        fillCell(position);
      } else {
        markCell(position);
      }
    },
    [inputMode, fillCell, markCell]
  );

  const handleCellLongPress = useCallback(
    (position: Position) => {
      // Long press toggles through all states
      toggleCell(position);
    },
    [toggleCell]
  );

  const handleHint = useCallback(() => {
    const hint = getHint();
    if (hint) {
      Alert.alert('Hint', hint.message);
    } else {
      Alert.alert('No hints available', 'Try to find some obvious cells first!');
    }
  }, [getHint]);

  const handleReset = useCallback(() => {
    Alert.alert('Reset Game', 'Are you sure you want to start over?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetGame },
    ]);
  }, [resetGame]);

  const subtitleText = useMemo(
    () => `${puzzle.size.width}×${puzzle.size.height} • ${puzzle.difficulty}`,
    [puzzle.size.width, puzzle.size.height, puzzle.difficulty]
  );

  const filledCount = useMemo(
    () => session.currentGrid.flat().filter(cell => cell !== CellState.EMPTY).length,
    [session.currentGrid]
  );

  const handlePause = useCallback(() => {
    if (isPlaying) {
      pauseGame();
    } else if (isPaused) {
      resumeGame();
    }
  }, [isPlaying, isPaused, pauseGame, resumeGame]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FF' }}>
      <DepthFog visible intensity={0.1} color="#2D1B3D" />
      <GridBackground spacing={64} thickness={6} color="#F8F9FF" />
      <LightRays visible rayCount={3} intensity={1} color="#F8F9FF" />

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Image
              source={require('../../assets/kenney_ui-pack/PNG/Blue/Default/arrow_basic_w_small.png')}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>{puzzle.name}</Text>
            <Text style={styles.subtitle}>{subtitleText}</Text>
          </View>

          <TouchableOpacity onPress={handlePause} style={styles.headerButton}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Game Info */}
        <View style={styles.gameInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText} key={displayTick}>
              {formatTime(getElapsedTime())}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="help-circle-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{hintsUsed}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{filledCount}</Text>
          </View>
        </View>

        {/* Game Area */}
        <View style={styles.gameArea}>
          {isPaused ? (
            <View style={styles.pausedOverlay}>
              <Text style={styles.pausedText}>Game Paused</Text>
              <TouchableOpacity onPress={resumeGame} style={styles.resumeButton}>
                <Text style={styles.resumeButtonText}>Resume</Text>
              </TouchableOpacity>
            </View>
          ) : showCompleted ? (
            <View style={styles.pausedOverlay}>
              <Text style={styles.pausedText}>Level Completed!</Text>
              <Text style={styles.subtitle}>Time: {formatTime(completedTime)}</Text>
              <Text style={styles.subtitle}>Hints: {completedHints}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => {
                    setShowCompleted(false);
                    onComplete?.(puzzle, completedTime, completedHints);
                  }}
                  style={styles.actionButton}
                >
                  <Ionicons name="chevron-forward-outline" size={20} color="#007AFF" />
                  <Text style={styles.actionButtonText}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowCompleted(false);
                    resetGame();
                  }}
                  style={styles.actionButton}
                >
                  <Ionicons name="refresh-outline" size={20} color="#007AFF" />
                  <Text style={styles.actionButtonText}>Replay</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.gameContent}>
              <View style={styles.puzzleLayout}>
                <CluesDisplay
                  puzzle={puzzle}
                  grid={session.currentGrid}
                  showValidation={true}
                  cellSize={cellSize}
                  renderGrid={() => (
                    <GameGrid
                      puzzle={puzzle}
                      grid={session.currentGrid}
                      onCellPress={handleCellPress}
                      onCellLongPress={handleCellLongPress}
                      disabled={!isPlaying}
                      cellSize={cellSize}
                      showSolution={showSolution}
                    />
                  )}
                />
              </View>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Input Mode Toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, inputMode === InputMode.FILL && styles.modeButtonActive]}
              onPress={() => setInputMode(InputMode.FILL)}
            >
              <View style={styles.fillIcon} />
              <Text
                style={[
                  styles.modeButtonText,
                  inputMode === InputMode.FILL && styles.modeButtonTextActive,
                ]}
              >
                Fill
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeButton, inputMode === InputMode.MARK && styles.modeButtonActive]}
              onPress={() => setInputMode(InputMode.MARK)}
            >
              <Ionicons
                name="close"
                size={16}
                color={inputMode === InputMode.MARK ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  inputMode === InputMode.MARK && styles.modeButtonTextActive,
                ]}
              >
                Mark
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleHint} style={styles.actionButton}>
              <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>Hint</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowSolution(!showSolution)}
              style={styles.actionButton}
            >
              <Ionicons name="eye-outline" size={20} color={showSolution ? '#FF9500' : '#666'} />
              <Text style={[styles.actionButtonText, { color: showSolution ? '#FF9500' : '#333' }]}>
                Debug
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleReset} style={styles.actionButton}>
              <Ionicons name="refresh-outline" size={20} color="#FF3B30" />
              <Text style={styles.actionButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  puzzleLayout: {
    flex: 1,
    width: '100%',
    minWidth: '100%',
  },
  gridContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  pausedOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pausedText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 4,
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  fillIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
});

export default GameScreen;
