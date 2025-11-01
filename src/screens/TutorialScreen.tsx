import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DepthFog from '../components/DepthFog';
import LightRays from '../components/LightRays';
import GridBackground from '../components/GridBackground';
import AvatarDialog from '../components/AvatarDialog';
import TutorialCoachMark from '../components/TutorialCoachMark';
import CluesDisplay from '../components/CluesDisplay';
import GameGrid from '../components/GameGrid';
import { TUTORIAL_STEPS } from '../tutorial/steps';
import { getPuzzleById } from '../data/puzzles';
import { NonogramPuzzle, Position, CellState } from '../types/game';
import { hapticLight } from '../utils/haptics';
import { playFill, playAutoMarkLine, playClick } from '../utils/audio';
import { setTutorialStatus } from '../utils/storage';

interface TutorialScreenProps {
  onFinish: () => void;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({ onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const step = TUTORIAL_STEPS[stepIndex];
  const puzzle: NonogramPuzzle = useMemo(() => getPuzzleById('heart-5x5')!, []);

  // Minimal local grid state for practice; default EMPTY
  const [grid, setGrid] = useState<CellState[][]>(
    Array(puzzle.size.height)
      .fill(null)
      .map(() => Array(puzzle.size.width).fill(CellState.EMPTY))
  );
  const [clueTapped, setClueTapped] = useState(false);
  const [highlightedRowIndex, setHighlightedRowIndex] = useState<number | null>(null);
  const [highlightedColIndex, setHighlightedColIndex] = useState<number | null>(null);

  // Use a shared cell size for both CluesDisplay and GameGrid to ensure snug fit
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const cellSize = useMemo(() => {
    // Larger shared sizing for tutorial; centered in available space
    const maxGridWidth = Math.floor(screenWidth * 0.8); // use more width on tutorial
    const maxGridHeight = Math.floor(screenHeight * 0.65);
    const byWidth = Math.floor(maxGridWidth / puzzle.size.width);
    const byHeight = Math.floor(maxGridHeight / puzzle.size.height);
    const size = Math.max(18, Math.min(56, Math.min(byWidth, byHeight)));
    return size;
  }, [screenWidth, screenHeight, puzzle.size.width, puzzle.size.height]);

  const handleAdvance = async () => {
    playClick();
    if (stepIndex < TUTORIAL_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      await setTutorialStatus('completed');
      onFinish();
    }
  };

  const handleSkip = async () => {
    playClick();
    await setTutorialStatus('skipped');
    onFinish();
  };

  const onCellPress = useCallback(
    ({ row, col }: Position) => {
      // Enforce strict interactions: only allow target cells for the current step
      if (step?.type !== 'practice') return;
      if (step.goal === 'fillRow' && step.target?.row !== undefined && row !== step.target.row)
        return;
      if (step.goal === 'fillCol' && step.target?.col !== undefined && col !== step.target.col)
        return;
      if (step.goal === 'fillSpecific' && (step.target?.row !== row || step.target?.col !== col))
        return;

      hapticLight();
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        // Allow clearing a MARKED cell on the targeted line
        if (next[row][col] === CellState.MARKED) {
          next[row][col] = CellState.EMPTY;
        } else {
          // tap toggles cell state
          next[row][col] = next[row][col] === CellState.FILLED ? CellState.EMPTY : CellState.FILLED;
          if (next[row][col] === CellState.FILLED) {
            playFill();
          }
        }

        const isRowSolved = (r: number) => {
          const solutionRow = puzzle.solution[r];
          const countFilled = next[r].filter(c => c === CellState.FILLED).length;
          const countSolution = solutionRow.filter(Boolean).length;
          const allValid = next[r].every(
            (c, i) => c !== CellState.FILLED || solutionRow[i] === true
          );
          return countFilled === countSolution && allValid;
        };
        const isColSolved = (cIdx: number) => {
          const solutionCol = puzzle.solution.map(rw => rw[cIdx]);
          const colVals = next.map(rw => rw[cIdx]);
          const countFilled = colVals.filter(c => c === CellState.FILLED).length;
          const countSolution = solutionCol.filter(Boolean).length;
          const allValid = next.every(
            (rw, ri) => rw[cIdx] !== CellState.FILLED || solutionCol[ri] === true
          );
          return countFilled === countSolution && allValid;
        };

        let playedAuto = false;
        if (isRowSolved(row)) {
          const solRow = puzzle.solution[row];
          for (let c = 0; c < solRow.length; c++) {
            if (!solRow[c] && next[row][c] === CellState.EMPTY) {
              next[row][c] = CellState.MARKED;
              if (!playedAuto) {
                playAutoMarkLine();
                playedAuto = true;
              }
            }
          }
        }
        if (isColSolved(col)) {
          for (let r = 0; r < next.length; r++) {
            if (!puzzle.solution[r][col] && next[r][col] === CellState.EMPTY) {
              next[r][col] = CellState.MARKED;
              if (!playedAuto) {
                playAutoMarkLine();
                playedAuto = true;
              }
            }
          }
        }

        return next;
      });
    },
    [step, puzzle.solution]
  );

  // Completion gating logic
  const stepCompleted = useMemo(() => {
    if (!step) return false;
    if (step.type === 'narrative') return true;
    if (step.type === 'practice') {
      if (step.goal === 'fillAny') {
        return grid.some(r => r.some(c => c === CellState.FILLED));
      }
      if (
        step.goal === 'fillSpecific' &&
        step.target?.row !== undefined &&
        step.target?.col !== undefined
      ) {
        return grid[step.target.row][step.target.col] === CellState.FILLED;
      }

      if (step.goal === 'fillRow' && step.target?.row !== undefined) {
        const r = step.target.row;
        const solutionRow = puzzle.solution[r];
        const countFilled = grid[r].filter(c => c === CellState.FILLED).length;
        const countSolution = solutionRow.filter(Boolean).length;
        const allValid = grid[r].every((c, i) => c !== CellState.FILLED || solutionRow[i] === true);
        return countFilled === countSolution && allValid;
      }
      if (step.goal === 'fillCol' && step.target?.col !== undefined) {
        const cIndex = step.target.col;
        const solutionCol = puzzle.solution.map(row => row[cIndex]);
        const countFilled = grid.map(row => row[cIndex]).filter(c => c === CellState.FILLED).length;
        const countSolution = solutionCol.filter(Boolean).length;
        const allValid = grid.every(
          (row, r) => row[cIndex] !== CellState.FILLED || solutionCol[r] === true
        );
        return countFilled === countSolution && allValid;
      }
    }
    return false;
  }, [grid, step, highlightedRowIndex, highlightedColIndex, puzzle.solution]);

  // Smooth auto-advance when a practice step is completed
  const autoAdvancedRef = useRef(false);

  useEffect(() => {
    // reset auto-advance guard when step changes
    autoAdvancedRef.current = false;
    setHighlightedRowIndex(null);
    setHighlightedColIndex(null);
  }, [stepIndex]);

  useEffect(() => {
    if (step?.type === 'practice' && stepCompleted && !autoAdvancedRef.current) {
      autoAdvancedRef.current = true;
      const t = setTimeout(() => {
        handleAdvance();
      }, 450);
      return () => clearTimeout(t);
    }
  }, [stepCompleted, step, handleAdvance]);

  // Pointer guidance for current step
  const pointer = useMemo(() => {
    if (step?.type !== 'practice') return { type: undefined, target: null } as any;
    if (step.goal === 'fillRow' && step.target?.row !== undefined) {
      return { type: 'row' as const, target: { row: step.target.row } };
    }
    if (step.goal === 'fillCol' && step.target?.col !== undefined) {
      return { type: 'col' as const, target: { col: step.target.col } };
    }
    if (step.goal === 'fillSpecific' && step.target) {
      return { type: 'cell' as const, target: { row: step.target.row, col: step.target.col } };
    }
    return { type: undefined, target: null } as any;
  }, [step]);

  // Intro step detection for centered avatar
  const INTRO_IDS = new Set([
    'welcome',
    'what',
    'goal',
    'excited',
    'lets-go',
    'outro-tip',
    'outro-access',
    'outro-encouragement',
  ]);
  const inIntro = step?.type === 'narrative' && step?.id && INTRO_IDS.has(step.id as string);

  // Auto-highlight target line for each step to guide attention
  useEffect(() => {
    if (step?.type !== 'practice') {
      setHighlightedRowIndex(null);
      setHighlightedColIndex(null);
      return;
    }
    if (step.goal === 'fillRow' && step.target?.row !== undefined) {
      setHighlightedRowIndex(step.target.row);
      setHighlightedColIndex(null);
      return;
    }
    if (step.goal === 'fillCol' && step.target?.col !== undefined) {
      setHighlightedColIndex(step.target.col);
      setHighlightedRowIndex(null);
      return;
    }
    setHighlightedRowIndex(null);
    setHighlightedColIndex(null);
  }, [step]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FF' }}>
      <DepthFog visible intensity={0.1} color="#2D1B3D" />
      <GridBackground spacing={64} thickness={6} color="#F8F9FF" />
      <LightRays visible rayCount={3} intensity={1} color="#F8F9FF" />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'transparent' }}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <View style={{ flex: 1, padding: 16 }}>
          {/* Persistent Skip button */}
          <View style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
            <TouchableOpacity onPress={handleSkip} activeOpacity={0.85}>
              <ImageBackground
                source={require('../../assets/kenney_ui-pack/PNG/Blue/Default/button_rectangle_depth_gradient.png')}
                resizeMode="stretch"
                style={{ height: 36, width: 100, justifyContent: 'center' }}
                imageStyle={{ borderRadius: 10 }}
              >
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Image
                    source={require('../../assets/icons/leave.png')}
                    style={{ width: 14, height: 14, marginRight: 6 }}
                  />
                  <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'Kenney-Future' }}>
                    Skip
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          {/* Practice Area */}
          {!inIntro && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <CluesDisplay
                puzzle={puzzle}
                grid={grid}
                showValidation={true}
                cellSize={cellSize}
                renderGrid={() => (
                  <GameGrid
                    puzzle={puzzle}
                    grid={grid}
                    onCellPress={onCellPress}
                    disabled={step?.type !== 'practice'}
                    inputMode={'fill'}
                    cellSize={cellSize}
                    highlightedRowIndex={highlightedRowIndex}
                    highlightedColIndex={highlightedColIndex}
                    pointerType={pointer.type}
                    pointerTarget={pointer.target}
                  />
                )}
              />
            </View>
          )}

          {/* Coach mark message at top */}
          {!inIntro && (
            <TutorialCoachMark
              visible={step?.type === 'practice'}
              message={step?.type === 'practice' ? step.text : ''}
              topOffset={64}
            />
          )}

          {/* Avatar dialog */}
          <AvatarDialog
            text={step?.type === 'narrative' ? step.text : 'Try it out on the practice grid!'}
            onNext={handleAdvance}
            nextLabel={
              step?.type === 'narrative'
                ? stepIndex === TUTORIAL_STEPS.length - 1
                  ? 'Finish'
                  : step?.nextLabel || 'Next'
                : 'Continue'
            }
            nextDisabled={!stepCompleted}
            onBack={() => setStepIndex(i => Math.max(0, i - 1))}
            backDisabled={stepIndex === 0}
            showSkip={false}
            variant={inIntro ? 'intro' : 'default'}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TutorialScreen;
