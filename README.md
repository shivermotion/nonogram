# Nonogram Puzzle Game

A React Native nonogram puzzle game built with Expo. Nonograms (also known as picross, paint by numbers, or griddlers) are logic puzzles where you fill in grid squares based on number clues to reveal hidden pictures.

## Features

### ✅ Completed Features

- **Core Gameplay**

  - Interactive grid with touch controls
  - Fill and mark modes for different cell states
  - Real-time puzzle validation
  - Timer and hint tracking
  - Pause/resume functionality

- **Puzzle System**

  - Hand-crafted puzzle library with 7+ puzzles
  - Multiple grid sizes (5x5, 10x10, 15x15)
  - Difficulty levels (Easy, Medium, Hard, Expert)
  - Categories (Animals, Objects, Nature, Food, Vehicles, Abstract)

- **User Interface**

  - Clean, minimalist design
  - Visual clue display for rows and columns
  - Responsive layout for different screen sizes
  - Input mode toggle (Fill/Mark)
  - Visual feedback for marked cells (X pattern)

- **Game Logic**
  - Complete nonogram validation algorithms
  - Auto-solving for obvious moves (hints)
  - Line-solving logic with constraint satisfaction
  - Puzzle completion detection

### 🚧 Planned Features

- Multi-size grid support with better responsive design
- Enhanced hint system with multiple hint types
- Progress tracking and save/load functionality
- Achievements and statistics system
- User profiles and preferences
- Social features and puzzle sharing
- Performance optimizations and animations

## Installation

1. Make sure you have Node.js and Yarn installed
2. Install Expo CLI: `npm install -g @expo/cli`
3. Clone and navigate to the project:
   ```bash
   cd /Users/jasonday/repos/nonogram
   yarn install
   ```

## Running the App

Start the development server:

```bash
yarn start
```

Then use the Expo Go app on your device or run on a simulator:

- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal
- **Expo Go**: Scan QR code with your device

## How to Play

1. **Select a Puzzle**: Choose from the main menu by difficulty, category, or size
2. **Read the Clues**: Numbers on the left (rows) and top (columns) indicate consecutive filled squares
3. **Fill Squares**:
   - **Fill mode**: Tap to fill squares black
   - **Mark mode**: Tap to mark squares with X (definitely empty)
   - **Long press**: Cycle through all states
4. **Solve the Puzzle**: Complete the grid to reveal the hidden picture!

### Tips

- Use the hint system when stuck
- Mark squares you know are empty to help visualize
- Look for rows/columns with large numbers first
- The timer tracks your progress

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── GameGrid.tsx    # Interactive puzzle grid
│   └── CluesDisplay.tsx # Number clues display
├── screens/            # Main app screens
│   ├── MenuScreen.tsx  # Puzzle selection menu
│   └── GameScreen.tsx  # Main game interface
├── hooks/              # Custom React hooks
│   └── useGame.ts      # Game state management
├── utils/              # Utility functions
│   └── nonogramLogic.ts # Puzzle validation & solving
├── types/              # TypeScript type definitions
│   └── game.ts         # Core game types
└── data/               # Static game data
    └── puzzles.ts      # Puzzle library
```

## Technical Details

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Dependencies**:
  - `@react-native-async-storage/async-storage`: Local data persistence
  - `react-native-gesture-handler`: Enhanced touch interactions
  - `@expo/vector-icons`: Icon library
- **Architecture**: Clean separation of UI, logic, and data layers

## Contributing

The game follows a modular architecture making it easy to:

- Add new puzzles to `src/data/puzzles.ts`
- Implement new game features in `src/hooks/useGame.ts`
- Create additional UI components
- Add new puzzle categories or difficulties

## License

This project is for educational and demonstration purposes.
