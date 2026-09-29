# CARTOON SUPER CUP 256 — Project & Architecture Plan

## 1. Executive Overview
CARTOON SUPER CUP 256 is a client-side knockout tournament web application built with Next.js (App Router), TypeScript, and Tailwind CSS. The system pits 256 iconic childhood cartoon and anime series against each other across 8 elimination rounds (255 total battles) to crown 1 ultimate Champion.

---

## 2. System Architecture

```
                                  ┌────────────────────────┐
                                  │   User Interface UI    │
                                  │  (React / Next App)    │
                                  └───────────┬────────────┘
                                              │
                                              ▼
                                  ┌────────────────────────┐
                                  │    useTournament()     │
                                  │      Custom Hook       │
                                  └───────────┬────────────┘
                                              │
                                              ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                              Pure Tournament Engine                                    │
 │  ┌──────────────────────┐   ┌──────────────────────┐   ┌────────────────────────────┐  │
 │  │   generateBracket    │   │    advanceWinner     │   │     tournamentStorage      │  │
 │  └──────────────────────┘   └──────────────────────┘   └────────────────────────────┘  │
 └────────────────────────────────────────────┬───────────────────────────────────────────┘
                                              │
                                              ▼
                                  ┌────────────────────────┐
                                  │   LocalStorage State   │
                                  │  (cartoon-super-cup)   │
                                  └────────────────────────┘
```

### Key Principles
1. **Decoupled Business Logic**: The tournament engine (`src/lib/tournament/`) contains zero React hooks or UI code. It can be tested independently or executed in Node/WebSockets.
2. **Deterministic Bracket**: Once initialized, seeds and match ordering are deterministic.
3. **Pure State Transitions**: `selectWinner` and `undoLastChoice` produce new immutable `TournamentState` objects.

---

## 3. Tournament Lifecycle

1. **Initialization (`Round 1`)**:
   - 256 cartoons shuffled (via `Full Random` or `Balanced Pot Allocation`).
   - 128 initial matches populated (`r1-m0` to `r1-m127`).
2. **Match Execution**:
   - Player picks contestant A or B (or presses `A`/`D` keys).
   - Match records `winnerId` and appends decision to `historyStack`.
3. **Round Transition**:
   - Upon finishing match 128, Round 2 (`Round of 128`) auto-populates 64 matches with Round 1 winners.
   - Triggers `RoundCompleteModal` UI highlight.
4. **Grand Final & Champion**:
   - Round 8 (Grand Final) determines 1 Champion.
   - State marked `completed: true`. Saved to LocalStorage history.

---

## 4. State Structure

```typescript
interface TournamentState {
  tournamentId: string;
  createdAt: number;
  mode: "full-random" | "balanced";
  currentRound: number; // 1 to 8
  currentMatch: number; // 0-indexed within current round
  rounds: TournamentRound[];
  championId?: number;
  completed: boolean;
  historyStack?: Array<{
    round: number;
    match: number;
    winnerId: number;
  }>;
}
```

---

## 5. Persistence & Storage Strategy

- **`cartoon-super-cup-state`**: Stores current in-flight state. Reloading resumes at exact match and round.
- **`cartoon-super-cup-history`**: Stores up to 5 recently completed tournaments with dates, champions, and runners-up.

---

## 6. Future Architecture: Realtime Friend Mode

While MVP is 100% client-side, the engine is designed for easy server-side multiplayer expansion:

```
[ Room Host ] ───► Create Room (e.g. Code "K7X92")
                        │
                        ▼
                 [ WebSocket / Redis ]
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
  [ Player 1 ]                     [ Player 2 ]
  Votes A (Gravity Falls)          Votes B (Adventure Time)
        │                               │
        └───────────────┬───────────────┘
                        ▼
              Majority Vote Tally
       (Gravity Falls 3 vs Adventure 2)
                        │
                        ▼
              Engine `advanceWinner`
```

1. Host calls `createTournament()` on server.
2. Server broadcasts `getCurrentMatch()` to room members via WebSockets / SSE.
3. Members submit vote payloads `{ roomId, matchId, choiceId }`.
4. Timer expires or all members vote -> Server tallies majority choice and calls `tournamentEngine.selectWinner(roomState, majorityWinnerId)`.
