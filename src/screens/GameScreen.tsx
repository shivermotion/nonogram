import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { NonogramPuzzle, CellState, Position } from '../types/game';
import { useGame } from '../hooks/useGame';
import GameGrid from '../components/GameGrid';
import CluesDisplay from '../components/CluesDisplay';
import DepthFog from '../components/DepthFog';
import LightRays from '../components/LightRays';
import GridBackground from '../components/GridBackground';
import LevelCompleteOverlay from '../components/LevelCompleteOverlay';
import { playCompletion, playLevelCompleteMusic } from '../utils/audio';
import { hapticLight, hapticMedium, hapticSelection, hapticSuccess } from '../utils/haptics';

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
  const [completedTime, setCompletedTime] = useState<number>(0);
  const [completedHints, setCompletedHints] = useState<number>(0);
  const [showLevelCompleteOverlay, setShowLevelCompleteOverlay] = useState(false);

  // Pause overlay animation values
  const pauseOverlayOpacity = useSharedValue(0);
  const pauseTitleOpacity = useSharedValue(0);
  const pauseTitleScale = useSharedValue(0.5);
  const pauseTitleTranslateY = useSharedValue(30);
  const pauseButtonOpacity = useSharedValue(0);
  const pauseButtonTranslateY = useSharedValue(30);

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
      clueNumberWidth = 16; // Reduced from 18
      clueNumberHeight = 14; // Reduced from 16
      maxAllowedRowClues = Math.min(theoreticalMaxRow, Math.max(6, actualMaxRowClues));
      maxAllowedColClues = Math.min(theoreticalMaxCol, Math.max(6, actualMaxColClues));
    } else if (isMediumPuzzle) {
      clueNumberWidth = 18; // Reduced from 22
      clueNumberHeight = 16; // Reduced from 18
      maxAllowedRowClues = Math.min(theoreticalMaxRow, Math.max(5, actualMaxRowClues));
      maxAllowedColClues = Math.min(theoreticalMaxCol, Math.max(5, actualMaxColClues));
    } else {
      clueNumberWidth = 20; // Reduced from 25
      clueNumberHeight = 18; // Reduced from 20
      maxAllowedRowClues = theoreticalMaxRow;
      maxAllowedColClues = theoreticalMaxCol;
    }

    return { clueNumberWidth, clueNumberHeight, maxAllowedRowClues, maxAllowedColClues };
  }, [puzzle.size.width, puzzle.size.height, puzzle.rowClues, puzzle.colClues]);

  // Shared cell size calculation for both CluesDisplay and GameGrid
  const getOptimalCellSize = useCallback(() => {
    const { clueNumberWidth, clueNumberHeight, maxAllowedRowClues, maxAllowedColClues } =
      clueSizing;
    const estimatedRowClueWidth = maxAllowedRowClues * clueNumberWidth + 10; // Reduced from 15
    const estimatedColClueHeight = maxAllowedColClues * clueNumberHeight + 10; // Reduced from 15

    const availableWidth = screenWidth - estimatedRowClueWidth - 40; // margins
    const availableHeight = screenHeight * 0.8 - estimatedColClueHeight; // Increased from 0.75 to 0.8

    const baseCellSize = Math.floor(
      Math.min(availableWidth / puzzle.size.width, availableHeight / puzzle.size.height)
    );

    let minCellSize: number;
    let maxCellSize: number;
    if (puzzle.size.width >= 15 || puzzle.size.height >= 15) {
      minCellSize = 20; // Reduced to ensure it fits
      maxCellSize = Math.min(35, baseCellSize); // Cap at 35px or calculated size
    } else if (puzzle.size.width >= 10 || puzzle.size.height >= 10) {
      minCellSize = 25; // Reduced to ensure it fits
      maxCellSize = Math.min(45, baseCellSize); // Cap at 45px or calculated size
    } else {
      minCellSize = 30; // Reduced to ensure it fits
      maxCellSize = Math.min(55, baseCellSize); // Cap at 55px or calculated size
    }

    // Ensure the cell size never exceeds what can fit on screen
    const maxPossibleSize = Math.floor(
      Math.min(availableWidth / puzzle.size.width, availableHeight / puzzle.size.height)
    );
    return Math.max(minCellSize, Math.min(maxCellSize, maxPossibleSize));
  }, [clueSizing, puzzle.size.width, puzzle.size.height]);

  const cellSize = getOptimalCellSize();

  // Calculate clue area sizes (same as CluesDisplay) - Smart sizing (shared)
  const { clueNumberWidth, clueNumberHeight, maxAllowedRowClues, maxAllowedColClues } = clueSizing;
  const rowClueWidth = useMemo(
    () => maxAllowedRowClues * clueNumberWidth + 10, // Reduced from 15
    [maxAllowedRowClues, clueNumberWidth]
  );
  const colClueHeight = useMemo(
    () => maxAllowedColClues * clueNumberHeight + 10, // Reduced from 15
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
    onFinalCellPlaced: async () => {
      // Play completion sound and haptic feedback when final cell is placed
      hapticSuccess();
      await playCompletion();
    },
    onGameComplete: async completedSession => {
      // Play level complete music
      await playLevelCompleteMusic();

      // Show level complete overlay after a delay
      setTimeout(() => {
        setShowLevelCompleteOverlay(true);
      }, 500);

      setCompletedTime(completedSession.elapsedTime);
      setCompletedHints(completedSession.hintsUsed);
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

  const handleCompletionAnimationFinish = () => {
    // Animation complete - overlay now handles everything
  };

  const handleContinue = () => {
    setShowLevelCompleteOverlay(false);
    onComplete?.(puzzle, completedTime, completedHints);
  };

  const handleReplay = () => {
    setShowLevelCompleteOverlay(false);
    resetGame();
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

  // Pause overlay animations
  useEffect(() => {
    if (isPaused) {
      // Show pause overlay
      pauseOverlayOpacity.value = withTiming(1, { duration: 300 });
      pauseTitleOpacity.value = withDelay(100, withTiming(1, { duration: 400 }));
      pauseTitleScale.value = withDelay(
        100,
        withSequence(withTiming(1.1, { duration: 200 }), withTiming(1, { duration: 200 }))
      );
      pauseTitleTranslateY.value = withDelay(
        100,
        withTiming(0, { duration: 400, easing: Easing.out(Easing.back(1.2)) })
      );
      pauseButtonOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
      pauseButtonTranslateY.value = withDelay(
        300,
        withTiming(0, { duration: 400, easing: Easing.out(Easing.back(1.2)) })
      );
    } else {
      // Hide pause overlay
      pauseOverlayOpacity.value = withTiming(0, { duration: 200 });
      pauseTitleOpacity.value = withTiming(0, { duration: 200 });
      pauseTitleScale.value = withTiming(0.5, { duration: 200 });
      pauseTitleTranslateY.value = withTiming(30, { duration: 200 });
      pauseButtonOpacity.value = withTiming(0, { duration: 200 });
      pauseButtonTranslateY.value = withTiming(30, { duration: 200 });
    }
  }, [isPaused]);

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

      {/* Pause Overlay - Full Screen */}
      {isPaused && (
        <Animated.View
          style={[
            styles.pausedOverlay,
            {
              opacity: pauseOverlayOpacity,
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.pausedText,
              {
                opacity: pauseTitleOpacity,
                transform: [{ scale: pauseTitleScale }, { translateY: pauseTitleTranslateY }],
              },
            ]}
          >
            Game Paused
          </Animated.Text>

          <Animated.View
            style={[
              {
                opacity: pauseButtonOpacity,
                transform: [{ translateY: pauseButtonTranslateY }],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                hapticLight();
                resumeGame();
              }}
              style={styles.resumeButton}
            >
              <Text style={styles.resumeButtonText}>Resume</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}

      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              hapticLight();
              onBack();
            }}
            style={styles.headerButton}
          >
            <Image
              source={require('../../assets/kenney_ui-pack/PNG/Blue/Default/arrow_basic_w_small.png')}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>{puzzle.name}</Text>
            <Text style={styles.subtitle}>{subtitleText}</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              hapticLight();
              handlePause();
            }}
            style={styles.headerButton}
          >
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
          <View style={styles.gameContent}>
            <View style={styles.puzzleLayout}>
              <View style={styles.gridContainer}>
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
                      inputMode={inputMode}
                    />
                  )}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Input Mode Toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, inputMode === InputMode.FILL && styles.modeButtonActive]}
              onPress={() => {
                hapticSelection();
                setInputMode(InputMode.FILL);
              }}
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
              onPress={() => {
                hapticSelection();
                setInputMode(InputMode.MARK);
              }}
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
            <TouchableOpacity
              onPress={() => {
                hapticLight();
                handleHint();
              }}
              style={styles.actionButton}
            >
              <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>Hint</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                hapticLight();
                setShowSolution(!showSolution);
              }}
              style={styles.actionButton}
            >
              <Ionicons name="eye-outline" size={20} color={showSolution ? '#FF9500' : '#666'} />
              <Text style={[styles.actionButtonText, { color: showSolution ? '#FF9500' : '#333' }]}>
                Debug
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                hapticMedium();
                handleReset();
              }}
              style={styles.actionButton}
            >
              <Ionicons name="refresh-outline" size={20} color="#FF3B30" />
              <Text style={styles.actionButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Level Complete Overlay */}
        <LevelCompleteOverlay
          puzzle={puzzle}
          visible={showLevelCompleteOverlay}
          completedTime={completedTime}
          completedHints={completedHints}
          onContinue={handleContinue}
          onReplay={handleReplay}
          onAnimationComplete={handleCompletionAnimationFinish}
        />
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
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  pausedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  pausedText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Kenney-Future',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  resumeButton: {
    backgroundColor: '#167DA8',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#167DA8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#1C9FD7',
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Kenney-Future',
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
