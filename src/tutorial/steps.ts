export type TutorialStep =
  | { id: string; type: 'narrative'; text: string; nextLabel?: string }
  | { id: string; type: 'practice'; text: string; goal: 'fillAny' | 'fillSpecific'; target?: { row: number; col: number } };

export const TUTORIAL_STEPS: TutorialStep[] = [
  { id: 'welcome', type: 'narrative', text: "Hey there! I'm Pixel, your guide. Let's uncover pictures with logic. Ready?", nextLabel: 'Let’s Go' },
  { id: 'what', type: 'narrative', text: 'Nonograms use numbers at row/column edges. Each number is a group of consecutive filled cells.' },
  { id: 'goal', type: 'narrative', text: 'Fill the right cells to reveal a hidden picture. Mark the rest as empty.' },
  { id: 'controls', type: 'narrative', text: 'Tap to fill. Long-press to cycle. Drag to quickly fill. Try it now!' },
  { id: 'practice-1', type: 'practice', text: 'Fill any one cell to begin.', goal: 'fillAny' },
  { id: 'practice-2', type: 'practice', text: 'Nice! Now fill the center cell to see groups form.', goal: 'fillSpecific', target: { row: 2, col: 2 } },
  { id: 'features', type: 'narrative', text: 'Pro tips: tap clues to highlight lines, use hints, pause at any time, enjoy particles & haptics!' },
  { id: 'wrap', type: 'narrative', text: 'That’s it! You’ll learn more as you play. I’ll cheer you on. Have fun!' },
];


