# Jeopardy! 🎲

A multiplayer Jeopardy-style trivia game. Play locally on one device or online with friends across the internet!

## Features

- **Local & Online multiplayer** — play on one device or connect across the internet via PeerJS
- **5 game modes** — 1v1, 2v2, 3v3, Free-for-All, and Custom Teams (2-4 teams, 2-4 players each)
- **9 built-in categories** with 225 questions: Food & Drink, Science, History, Technology, Pop Culture, Sports, Literature, Space, and a Mixed mode
- **Fuzzy answer matching** — uses Levenshtein distance so close-enough answers count
- **Configurable timer** — choose 5s, 10s, 15s, 20s, 30s, or turn it off entirely
- **Custom question import** — load your own questions via CSV drag-and-drop
- **Shareable CSV format** — create a simple CSV template and share it with friends
- **Responsive design** — plays on desktop and mobile
- **Zero dependencies** — just open `index.html` in a browser

## Game Modes

| Mode | Players | How it works |
|------|---------|-------------|
| **1v1** | 2 | Two players alternate turns |
| **2v2** | 4 | Two teams of two, members rotate answering |
| **3v3** | 6 | Two teams of three, members rotate answering |
| **Free-for-All** | 2-6 | Every player for themselves, turns cycle through all |
| **Custom Teams** | 4-16 | 2-4 teams with 2-4 members each, editable team names |

## Quick Start — Local Play

1. Open `index.html` in any modern browser
2. Pick a game mode (1v1, 2v2, 3v3, Free-for-All, or Custom Teams)
3. Enter player/team names (optional)
4. Pick a category theme or import your own CSV
5. Set the timer
6. Click **START GAME**

## Quick Start — Online Play

1. Open `index.html` in any modern browser
2. Click **PLAY ONLINE**
3. Click **HOST A ROOM** or **JOIN A ROOM**

### Host a Room
1. Configure your game on the landing screen (mode, categories, timer)
2. Click **PLAY ONLINE** → **HOST A ROOM** → **CREATE ROOM**
3. Share the room code (e.g. `JEOPARDY-8392`) with friends
4. Wait for players to join, then click **START GAME**

### Join a Room
1. Click **PLAY ONLINE** → **JOIN A ROOM**
2. Enter the room code and your name
3. Click **JOIN** and wait for the host to start

> **Note:** Online play uses [PeerJS](https://peerjs.com) for peer-to-peer connections via WebRTC. No server setup required — uses PeerJS's free cloud signaling server.

## Custom Questions

### CSV Format

Create a CSV file with these columns:

```
Category,Subcategory,Question,Answer,Alternatives (pipe-separated)
```

**Example:**
```csv
Category,Subcategory,Question,Answer,Alternatives (pipe-separated)
"Movies","80s Films","This movie features a DeLorean time machine","back to the future",""
"Movies","80s Films","This movie has a character named E.T.","e.t.","extraterrestrial"
```

**Rules:**
- Each category needs at least 1 subcategory with at least 1 question
- For a full game, create 6+ categories with 5+ questions each
- Alternative answers are separated by `|` (pipe character)
- Answers are matched case-insensitively with fuzzy matching

### How to Import

1. Click the **Import CSV** button on the landing screen
2. Drag and drop your CSV file, or click to browse
3. Preview your categories and question count
4. Click **Use These Questions** to load them

### Template

Click **Download Template** in the import dialog to get a starter CSV file.

## How to Play

1. Competitors take turns picking questions from the board
2. The active player types their answer and hits **Enter** or clicks Submit
3. The fuzzy matcher checks your answer against the correct one
4. Correct answer = earn the dollar value. Wrong = lose it
5. After each question, turn passes to the next competitor
6. In team modes, the answering player rotates within each team
7. When all questions are answered, the competitor with the highest score wins!

## Project Structure

```
Jeapordy/
  index.html          - Main HTML structure
  style.css           - All styles and responsive design
  questions.js        - 225 built-in trivia questions
  game.js             - Game logic, CSV parser, fuzzy matching
  online.js           - Online multiplayer via PeerJS
  jeopardy-template.csv - Starter template for custom questions
  .gitignore          - Ignores IDE config files
```

## Tech Stack

- **HTML/CSS/JS** — vanilla, no frameworks
- **PeerJS** — WebRTC peer-to-peer connections for online multiplayer
- **Google Fonts** — Fredoka One + Nunito
- **Levenshtein distance** — for fuzzy answer matching
