import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  GameSession, 
  GameState, 
  CellState, 
  Grid, 
  NonogramPuzzle, 
  Position, 
  HintResult, 
  GameAction 
} from '../types/game';
import { 
  createEmptyGrid, 
  cloneGrid, 
  isPuzzleComplete, 
  isGridValid, 
  isLineValid,
  autoSolveObvious 
} from '../utils/nonogramLogic';

interface UseGameProps {
  puzzle: NonogramPuzzle;
  onGameComplete?: (session: GameSession) => void;
  onGameStateChange?: (state: GameState) => void;
  onFinalCellPlaced?: () => void;
}

export function useGame({ puzzle, onGameComplete, onGameStateChange, onFinalCellPlaced }: UseGameProps) {
  const [session, setSession] = useState<GameSession>(() => ({
    puzzleId: puzzle.id,
    currentGrid: createEmptyGrid(puzzle.size),
    startTime: Date.now(),
    elapsedTime: 0,
    hintsUsed: 0,
    state: GameState.PLAYING,
    isCompleted: false,
  }));

  const lastResumeRef = useRef(Date.now());

  // Keep last resume timestamp current on mount
  useEffect(() => {
    lastResumeRef.current = Date.now();
  }, []);

  // Notify when game state changes
  useEffect(() => {
    onGameStateChange?.(session.state);
  }, [session.state, onGameStateChange]);

  const updateCell = useCallback((position: Position, newState: CellState) => {
    setSession(prev => {
      if (prev.state !== GameState.PLAYING) {
        return prev;
      }

      const newGrid = cloneGrid(prev.currentGrid);
      const { row, col } = position;
      
      // Toggle logic for cell states
      const currentState = newGrid[row][col];
      let targetState = newState;
      
      if (currentState === newState) {
        // If clicking the same state, clear it
        targetState = CellState.EMPTY;
      }
      
      newGrid[row][col] = targetState;

      // Check if puzzle is complete by comparing against the exact solution
      const isComplete = (() => {
        for (let r = 0; r < puzzle.size.height; r++) {
          for (let c = 0; c < puzzle.size.width; c++) {
            const shouldBeFilled = puzzle.solution[r][c];
            const isFilled = newGrid[r][c] === CellState.FILLED;
            if (shouldBeFilled !== isFilled) return false;
          }
        }
        return true;
      })();
      
      const updatedSession: GameSession = {
        ...prev,
        currentGrid: newGrid,
        isCompleted: isComplete,
        state: isComplete ? GameState.WON : GameState.PLAYING,
        completionTime: isComplete
          ? prev.elapsedTime + (Date.now() - lastResumeRef.current)
          : undefined,
      };

      // Check if this was the final cell that completed the puzzle
      const wasIncomplete = !isPuzzleComplete(prev.currentGrid, puzzle.rowClues, puzzle.colClues);
      const isNowComplete = isComplete;
      
      // If puzzle was incomplete and is now complete, this was the final cell
      if (wasIncomplete && isNowComplete && onFinalCellPlaced) {
        onFinalCellPlaced();
      }

      // Notify completion
      if (isComplete && onGameComplete) {
        onGameComplete(updatedSession);
      }

      return updatedSession;
    });
  }, [puzzle.rowClues, puzzle.colClues, onGameComplete]);

  const fillCell = useCallback((position: Position) => {
    updateCell(position, CellState.FILLED);
  }, [updateCell]);

  const markCell = useCallback((position: Position) => {
    updateCell(position, CellState.MARKED);
  }, [updateCell]);

  const clearCell = useCallback((position: Position) => {
    updateCell(position, CellState.EMPTY);
  }, [updateCell]);

  const toggleCell = useCallback((position: Position) => {
    setSession(prev => {
      if (prev.state !== GameState.PLAYING) {
        return prev;
      }

      const { row, col } = position;
      const currentState = prev.currentGrid[row][col];
      
      let newState: CellState;
      switch (currentState) {
        case CellState.EMPTY:
          newState = CellState.FILLED;
          break;
        case CellState.FILLED:
          newState = CellState.MARKED;
          break;
        case CellState.MARKED:
          newState = CellState.EMPTY;
          break;
        default:
          newState = CellState.EMPTY;
      }
      
      updateCell(position, newState);
      return prev;
    });
  }, [updateCell]);

  const pauseGame = useCallback(() => {
    setSession(prev => {
      if (prev.state !== GameState.PLAYING) return prev;
      const now = Date.now();
      return {
        ...prev,
        elapsedTime: prev.elapsedTime + (now - lastResumeRef.current),
        state: GameState.PAUSED,
      };
    });
  }, []);

  const resumeGame = useCallback(() => {
    setSession(prev => ({
      ...prev,
      state: prev.state === GameState.PAUSED ? GameState.PLAYING : prev.state,
    }));
    lastResumeRef.current = Date.now();
  }, []);

  const resetGame = useCallback(() => {
    setSession({
      puzzleId: puzzle.id,
      currentGrid: createEmptyGrid(puzzle.size),
      startTime: Date.now(),
      elapsedTime: 0,
      hintsUsed: 0,
      state: GameState.PLAYING,
      isCompleted: false,
    });
    lastResumeRef.current = Date.now();
  }, [puzzle]);

  const getHint = useCallback((): HintResult | null => {
    if (session.state !== GameState.PLAYING) {
      return null;
    }

    // Try to auto-solve one step
    const solvedGrid = autoSolveObvious(session.currentGrid, puzzle.rowClues, puzzle.colClues);
    
    // Find the first difference
    for (let row = 0; row < puzzle.size.height; row++) {
      for (let col = 0; col < puzzle.size.width; col++) {
        if (session.currentGrid[row][col] !== solvedGrid[row][col]) {
          setSession(prev => ({
            ...prev,
            currentGrid: solvedGrid,
            hintsUsed: prev.hintsUsed + 1,
          }));
          
          const cellType = solvedGrid[row][col] === CellState.FILLED ? 'filled' : 'marked';
          return {
            type: 'cell',
            position: { row, col },
            message: `This cell should be ${cellType}`,
          };
        }
      }
    }

    // If no obvious moves, give a general hint
    const invalidRows = puzzle.rowClues.map((clues, index) => ({
      index,
      valid: isLineValid(session.currentGrid[index], clues, true)
    })).filter(row => !row.valid);

    if (invalidRows.length > 0) {
      const invalidRow = invalidRows[0];
      return {
        type: 'row',
        message: `Check row ${invalidRow.index + 1} - it doesn't match the clues`,
      };
    }

    const invalidCols = puzzle.colClues.map((clues, index) => ({
      index,
      valid: isLineValid(session.currentGrid.map(row => row[index]), clues, true)
    })).filter(col => !col.valid);

    if (invalidCols.length > 0) {
      const invalidCol = invalidCols[0];
      return {
        type: 'column',
        message: `Check column ${invalidCol.index + 1} - it doesn't match the clues`,
      };
    }

    return {
      type: 'completion',
      message: 'You\'re doing great! Keep going!',
    };
  }, [session, puzzle]);

  const isValidMove = useCallback((position: Position, state: CellState): boolean => {
    const newGrid = cloneGrid(session.currentGrid);
    newGrid[position.row][position.col] = state;
    return isGridValid(newGrid, puzzle.rowClues, puzzle.colClues, false);
  }, [session.currentGrid, puzzle.rowClues, puzzle.colClues]);

  const getCellState = useCallback((position: Position): CellState => {
    return session.currentGrid[position.row][position.col];
  }, [session.currentGrid]);

  const getElapsedTime = useCallback((): number => {
    if (session.state === GameState.PLAYING) {
      return session.elapsedTime + (Date.now() - lastResumeRef.current);
    }
    return session.elapsedTime;
  }, [session.elapsedTime, session.state]);

  return {
    session,
    puzzle,
    // Cell operations
    fillCell,
    markCell,
    clearCell,
    toggleCell,
    updateCell,
    getCellState,
    // Game controls
    pauseGame,
    resumeGame,
    resetGame,
    getHint,
    // Utilities
    isValidMove,
    getElapsedTime,
    // State
    isPlaying: session.state === GameState.PLAYING,
    isPaused: session.state === GameState.PAUSED,
    isCompleted: session.state === GameState.WON,
    hintsUsed: session.hintsUsed,
  };
}
