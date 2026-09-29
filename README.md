# CARTOON SUPER CUP 256 🏆

> 256 Cartoons. 255 Battles. 1 Ultimate Champion.

**CARTOON SUPER CUP 256** is a nostalgic knockout tournament web app where players pit 256 iconic childhood cartoon & anime series against each other across 8 elimination rounds to determine their ultimate champion.

---

## 🌟 Key Features

- **256 Iconic Contestants**: Complete dataset spanning Cartoon Network, Disney, Nickelodeon, Classic Cartoons, Childhood Anime, BiBi TV / Chinese Animation, Superhero Series, Adult Animation, European Cartoons, and Toy Battle series.
- **8 Elimination Rounds**: Round of 256 → 128 → 64 → 32 → Sweet 16 → Quarterfinal → Semifinal → Grand Final (255 total battles).
- **Dual Randomization Modes**:
  - **Balanced Mode**: Cross-category matchmaking avoiding early top-tier category collisions.
  - **Full Random Mode**: Total chaotic Fisher-Yates shuffle.
- **Lightning-Fast Gameplay & Keyboard Controls**:
  - <kbd>A</kbd> / <kbd>←</kbd> Select Left Cartoon
  - <kbd>D</kbd> / <kbd>→</kbd> Select Right Cartoon
  - <kbd>Z</kbd> Undo previous choice
- **LocalStorage Persistence**: Auto-saves every match choice. Progress is never lost on refresh.
- **Interactive Bracket Viewer**: Filter by round (`256 | 128 | 64 | 32 | 16 | 8 | 4 | FINAL`) to inspect all match outcomes.
- **Champion Screen & Share Result**: View Champion path, defeated opponents, final four, and copy formatted share text to clipboard.
- **Responsive & Nostalgic Design System**: Retro TV / Arcade aesthetic with 3px black borders, tactile card press shadows, and custom fallback poster generator.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Pure CSS Retro Design System
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library
- **State & Storage**: Pure Client Engine + LocalStorage

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/quizz-cartoon.git
cd quizz-cartoon
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Unit Tests
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Homepage with Hero, Mode Selector & Stats
│   ├── play/page.tsx     # Active Match Arena & Selection Screen
│   ├── bracket/page.tsx  # Interactive Round & Match Bracket Viewer
│   ├── results/page.tsx  # Hall of Champions & Tournament History
│   └── globals.css       # Retro cartoon design tokens & box shadows
├── components/
│   └── tournament/
│       ├── CartoonCard.tsx        # Clickable battle card with keyboard hints
│       ├── MatchView.tsx          # A vs B container & key listeners
│       ├── MatchHeader.tsx        # Round & match indicator
│       ├── ProgressBar.tsx        # Overall tournament progress
│       ├── RoundCompleteModal.tsx # Survivor showcase between rounds
│       ├── WinnerScreen.tsx       # Champion celebration & share result
│       ├── BracketView.tsx        # Round tab match filter
│       └── FallbackPoster.tsx     # Dynamic stylized image fallback
├── data/
│   └── cartoons.ts       # Curated 256 cartoons dataset
├── hooks/
│   └── useTournament.ts   # React state binding custom hook
├── lib/
│   └── tournament/
│       ├── shuffle.ts             # Fisher-Yates & Balanced shuffle
│       ├── generateBracket.ts     # 8-round knockout bracket builder
│       ├── advanceWinner.ts       # Pure match winner advancement
│       ├── tournamentEngine.ts    # Core pure tournament functions
│       └── tournamentStorage.ts   # LocalStorage helper
└── types/
    ├── cartoon.ts         # Cartoon data interface & categories
    └── tournament.ts      # Match, Round, State, Progress interfaces
```

---

## 🎮 Keyboard Shortcuts

| Key | Action |
| --- | --- |
| <kbd>A</kbd> or <kbd>←</kbd> | Choose Left Cartoon |
| <kbd>D</kbd> or <kbd>→</kbd> | Choose Right Cartoon |
| <kbd>Z</kbd> | Undo Last Choice |

---

## 🧪 Testing

The engine includes 100% test coverage for:
- 256 contestants → 8 rounds → 255 matches → 1 champion flow
- Unique ID and array length validation
- Undo across match and round boundaries
- Balanced pot distribution
- Progress percentage calculation

Run the test suite anytime:
```bash
npm test
```

---

## 🌐 Deployment to Vercel

```bash
npx vercel
```
Or push to GitHub and connect to your Vercel account for instant zero-config deployment!
