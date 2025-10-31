import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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

  const handleAdvance = async () => {
    if (stepIndex < TUTORIAL_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      await setTutorialStatus('completed');
      onFinish();
    }
  };

  const handleSkip = async () => {
    await setTutorialStatus('skipped');
    onFinish();
  };

  const onCellPress = useCallback(
    ({ row, col }: Position) => {
      hapticLight();
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        // Simple tap toggles between EMPTY and FILLED for tutorial
        next[row][col] = next[row][col] === CellState.FILLED ? CellState.EMPTY : CellState.FILLED;
        return next;
      });
    },
    []
  );

  // Step gating logic for practice
  useEffect(() => {
    if (step?.type !== 'practice') return;
    if (step.goal === 'fillAny') {
      const anyFilled = grid.some(r => r.some(c => c === CellState.FILLED));
      if (anyFilled) {
        // auto-advance after short delay
        const t = setTimeout(() => setStepIndex(idx => Math.min(idx + 1, TUTORIAL_STEPS.length - 1)), 600);
        return () => clearTimeout(t);
      }
    }
    if (step.goal === 'fillSpecific' && step.target) {
      const { row, col } = step.target;
      if (grid[row][col] === CellState.FILLED) {
        const t = setTimeout(() => setStepIndex(idx => Math.min(idx + 1, TUTORIAL_STEPS.length - 1)), 600);
        return () => clearTimeout(t);
      }
    }
  }, [grid, step]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FF' }}>
      <DepthFog visible intensity={0.1} color="#2D1B3D" />
      <GridBackground spacing={64} thickness={6} color="#F8F9FF" />
      <LightRays visible rayCount={3} intensity={1} color="#F8F9FF" />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top', 'bottom', 'left', 'right']}>
        <View style={{ flex: 1, padding: 16 }}>
          {/* Practice Area */}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <CluesDisplay
              puzzle={puzzle}
              grid={grid}
              showValidation={true}
              renderGrid={() => (
                <GameGrid
                  puzzle={puzzle}
                  grid={grid}
                  onCellPress={onCellPress}
                  disabled={step?.type !== 'practice'}
                  inputMode={'fill'}
                />
              )}
            />
          </View>

          {/* Coach mark message at top */}
          <TutorialCoachMark visible={step?.type === 'practice'} message={step?.type === 'practice' ? step.text : ''} />

          {/* Avatar dialog at bottom */}
          <AvatarDialog
            text={step?.type === 'narrative' ? step.text : 'Try it out on the practice grid!'}
            onNext={handleAdvance}
            onSkip={handleSkip}
            nextLabel={step?.type === 'narrative' ? (stepIndex === TUTORIAL_STEPS.length - 1 ? 'Finish' : step?.nextLabel || 'Next') : 'Skip step'}
            showSkip={true}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TutorialScreen;


