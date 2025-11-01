export type TutorialStep =
  | { id: string; type: 'narrative'; text: string; nextLabel?: string }
  | {
      id: string;
      type: 'practice';
      text: string;
      goal: 'fillAny' | 'fillSpecific' | 'fillRow' | 'fillCol';
      target?: { row?: number; col?: number };
    };

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    type: 'narrative',
    text: "Hey adventurer! I'm Pixel, your chipper guide. I speak fluent puzzle and 17 dialects of whimsy. Let's meet a tiny Heart and make some logic magic.",
    nextLabel: 'Let’s Go',
  },
  {
    id: 'what',
    type: 'narrative',
    text: 'Nonograms: numbers on the side tell you how many consecutive cells to fill in that line. Fill groups, leave gaps, reveal secrets. Delicious.',
  },
  {
    id: 'goal',
    type: 'narrative',
    text: 'Objective: deduce which cells are filled to reveal the picture. No guessing. Logic only. A cozy brain spa with pixel confetti.',
  },
  { id: 'excited', type: 'narrative', text: "I'm so excited to teach you! We'll go step by step and you’ll see the picture appear." },
  { id: 'lets-go', type: 'narrative', text: "Ready? Let's go!" },
  {
    id: 'fill-row-5a',
    type: 'practice',
    text: 'Start strong: fill the entire row with 5 (all filled).',
    goal: 'fillRow',
    target: { row: 1 },
  },
  {
    id: 'fill-row-5b',
    type: 'practice',
    text: 'Fill the entire row again. Full 5.',
    goal: 'fillRow',
    target: { row: 2 },
  },
  {
    id: 'explain-columns',
    type: 'narrative',
    text: 'Because both rows of 5 are filled, the two columns with clue 2 are already solved automatically.',
  },
  {
    id: 'auto-mark-note',
    type: 'narrative',
    text: 'When a row or column is fully solved, the remaining empty cells auto-mark with X. You can still change them later if needed.',
  },
  {
    id: 'fill-row-3',
    type: 'practice',
    text: 'Fill the three in the middle to satisfy that row.',
    goal: 'fillRow',
    target: { row: 3 },
  },
  {
    id: 'space-rule',
    type: 'narrative',
    text: 'Space rule: multiple clues in a line (e.g., 1 1) must be separated by at least one empty cell. Use the solved columns to place them correctly.',
  },
  {
    id: 'fill-row-11',
    type: 'practice',
    text: 'Fill the two single cells in that row as indicated by the columns.',
    goal: 'fillRow',
    target: { row: 0 },
  },
  {
    id: 'fill-row-1',
    type: 'practice',
    text: 'Fill the remaining single cell to complete the heart.',
    goal: 'fillRow',
    target: { row: 4 },
  },
  {
    id: 'outro-tip',
    type: 'narrative',
    text: 'Advanced tip: tap any row or column clue to light up its edges in the grid. Perfect for staying focused.',
  },
  {
    id: 'outro-access',
    type: 'narrative',
    text: 'You can revisit this tutorial anytime from the Menu — just tap Tutorial. Practice makes pixels!',
  },
  {
    id: 'outro-encouragement',
    type: 'narrative',
    text: 'You’ve got this. Breathe, deduce, enjoy the reveals. I’m cheering from the margins!',
  },
  {
    id: 'wrap',
    type: 'narrative',
    text: 'That’s the Heart! You used big clues first, then columns, then finished the smaller rows. That’s the flow—great work!',
  },
];


