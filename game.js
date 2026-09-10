// ==================== CONSTANTS ====================
const CATS_PER_GAME = 6;
const QS_PER_CAT = 5;
const DOLLAR_INCREMENT = 200;
const SIMILARITY_THRESHOLD = 0.7;
const CUSTOM_COLORS = [
  ["#ff6b6b", "#ee5a24"], ["#48dbfb", "#0abde3"], ["#feca57", "#fdcb6e"],
  ["#ff9ff3", "#f368e0"], ["#54a0ff", "#2e86de"], ["#00d2d3", "#00b894"],
  ["#5f27cd", "#341f97"], ["#ff9f43", "#e17055"]
];

// ==================== GAME STATE ====================
let selectedMode = '1v1';
let selectedPreset = 'mixed';
let selectedTimer = 15;
let customCategories = null;
let parsedImportData = null;

let state = {
  competitors: [],
  currentCompetitor: 0,
  categories: [],
  board: [],
  round: 1,
  timerInterval: null,
  currentCatIdx: -1,
  currentQIdx: -1
};

// ==================== TEXT NORMALIZATION ====================
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

// ==================== FUZZY MATCHING ====================
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

function similarity(s1, s2) {
  s1 = normalize(s1);
  s2 = normalize(s2);
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;
  const maxLen = Math.max(s1.length, s2.length);
  return 1 - levenshtein(s1, s2) / maxLen;
}

function checkAnswer(playerAnswer, question) {
  const norm = normalize(playerAnswer);
  const correct = normalize(question.a);

  if (norm === correct) return true;
  if (similarity(norm, correct) >= SIMILARITY_THRESHOLD) return true;

  for (const alt of question.alt) {
    const altNorm = normalize(alt);
    if (norm === altNorm || similarity(norm, altNorm) >= SIMILARITY_THRESHOLD) return true;
  }
  return false;
}

// ==================== UI HELPERS ====================
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function selectPreset(preset) {
  selectedPreset = preset;
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('selected'));
  const btn = document.querySelector(`[data-preset="${preset}"]`);
  if (btn) btn.classList.add('selected');
}

function selectTimer(seconds) {
  selectedTimer = seconds;
  document.querySelectorAll('.timer-opt').forEach(btn => btn.classList.remove('selected'));
  const btn = document.querySelector(`[data-time="${seconds}"]`);
  if (btn) btn.classList.add('selected');
}

// ==================== MODE SELECTION ====================
function selectMode(mode) {
  selectedMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('selected'));
  const btn = document.querySelector(`[data-mode="${mode}"]`);
  if (btn) btn.classList.add('selected');

  document.getElementById('custom-team-config').classList.toggle('hidden', mode !== 'custom');
  document.getElementById('ffa-config').classList.toggle('hidden', mode !== 'ffa');

  renderPlayerInputs();
  updateInstructions();
}

function updateInstructions() {
  const el = document.getElementById('instructions-text');
  const texts = {
    '1v1': `Two players take turns picking questions from the board.<br>
      The active player types their answer and hits <span class="key">Enter</span> or clicks Submit.<br>
      The robot judge checks your answer — set your timer above!<br>
      Correct = earn the money. Wrong = lose it and turn passes.`,
    '2v2': `Two teams of two battle it out!<br>
      Teams take turns picking questions. Any team member can answer.<br>
      The answering player rotates within each team after every question.<br>
      Correct = earn the money. Wrong = lose it and turn passes.`,
    '3v3': `Two teams of three go head to head!<br>
      Teams take turns picking questions. Any team member can answer.<br>
      The answering player rotates within each team after every question.<br>
      Correct = earn the money. Wrong = lose it and turn passes.`,
    'ffa': `Every player for themselves!<br>
      Players take turns picking and answering questions.<br>
      The robot judge checks your answer — set your timer above!<br>
      Correct = earn the money. Wrong = lose it and turn passes.`,
    'custom': `Custom teams compete for the highest score!<br>
      Teams take turns picking questions. Any team member can answer.<br>
      The answering player rotates within each team after every question.<br>
      Correct = earn the money. Wrong = lose it and turn passes.`
  };
  el.innerHTML = texts[selectedMode] || texts['1v1'];
}

// ==================== PLAYER INPUT RENDERING ====================
function renderPlayerInputs() {
  const container = document.getElementById('player-config');
  container.innerHTML = '';

  if (selectedMode === '1v1') {
    renderIndividualInputs(container, 2);
  } else if (selectedMode === 'ffa') {
    const count = parseInt(document.getElementById('ffa-players-count').value) || 2;
    renderIndividualInputs(container, count);
  } else if (selectedMode === '2v2') {
    renderTeamInputs(container, 2, 2);
  } else if (selectedMode === '3v3') {
    renderTeamInputs(container, 2, 3);
  } else if (selectedMode === 'custom') {
    const teamCount = parseInt(document.getElementById('custom-teams-count').value) || 2;
    const memberCount = parseInt(document.getElementById('custom-members-count').value) || 2;
    renderTeamInputs(container, teamCount, memberCount);
  }
}

function renderIndividualInputs(container, count) {
  const ffaDiv = document.createElement('div');
  ffaDiv.className = 'ffa-inputs';
  for (let i = 0; i < count; i++) {
    const color = CUSTOM_COLORS[i % CUSTOM_COLORS.length][0];
    const row = document.createElement('div');
    row.className = 'ffa-row';
    row.innerHTML = `
      <span class="ffa-label" style="color: ${color}">PLAYER ${i + 1}:</span>
      <input type="text" class="member-input ffa-input player-name-input"
        placeholder="Name" maxlength="15" data-player="${i}">
    `;
    ffaDiv.appendChild(row);
  }
  container.appendChild(ffaDiv);
}

function renderTeamInputs(container, teamCount, memberCount) {
  for (let t = 0; t < teamCount; t++) {
    const color = CUSTOM_COLORS[t % CUSTOM_COLORS.length][0];
    const block = document.createElement('div');
    block.className = 'team-block';
    block.style.borderColor = color + '40';

    let membersHtml = '';
    for (let m = 0; m < memberCount; m++) {
      membersHtml += `
        <div class="member-row">
          <span class="member-label">P${m + 1}:</span>
          <input type="text" class="member-input player-name-input"
            placeholder="Name" maxlength="15" data-team="${t}" data-player="${m}">
        </div>
      `;
    }

    block.innerHTML = `
      <div class="team-header">
        <div class="team-color-dot" style="background: ${color}"></div>
        <input type="text" class="team-name-input team-title-input"
          placeholder="Team ${t + 1}" maxlength="20" data-team="${t}"
          style="border-color: ${color}40">
      </div>
      <div class="member-rows">${membersHtml}</div>
    `;
    container.appendChild(block);
  }
}

function updateCustomConfig() {
  renderPlayerInputs();
}

function updateFFAConfig() {
  renderPlayerInputs();
}

// ==================== BUILD COMPETITORS FROM INPUTS ====================
function buildCompetitorsFromInputs() {
  if (selectedMode === '1v1' || selectedMode === 'ffa') {
    const inputs = document.querySelectorAll('.player-name-input');
    const competitors = [];
    inputs.forEach((input, i) => {
      competitors.push({
        name: input.value.trim() || `Player ${i + 1}`,
        score: 0,
        members: [],
        currentMemberIdx: 0
      });
    });
    return competitors;
  }

  // Team modes
  const teamBlocks = document.querySelectorAll('.team-block');
  const competitors = [];
  teamBlocks.forEach((block, t) => {
    const titleInput = block.querySelector('.team-title-input');
    const memberInputs = block.querySelectorAll('.player-name-input');
    const members = [];
    memberInputs.forEach((input, m) => {
      members.push(input.value.trim() || `P${m + 1}`);
    });
    competitors.push({
      name: titleInput.value.trim() || `Team ${t + 1}`,
      score: 0,
      members: members,
      currentMemberIdx: 0
    });
  });
  return competitors;
}

// ==================== RENDER SCORE CARDS ====================
function renderScoreCards() {
  const container = document.getElementById('scores-container');
  container.innerHTML = '';

  state.competitors.forEach((comp, i) => {
    const color = CUSTOM_COLORS[i % CUSTOM_COLORS.length][0];
    const card = document.createElement('div');
    card.className = 'player-score';
    card.id = `score-card-${i}`;
    card.style.borderColor = color;
    card.style.background = `linear-gradient(135deg, ${color}33, ${color}11)`;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'player-name-display';
    nameDiv.style.color = color;
    nameDiv.textContent = comp.name;

    const scoreDiv = document.createElement('div');
    scoreDiv.className = 'score-value';
    scoreDiv.id = `score-value-${i}`;
    scoreDiv.textContent = '$0';

    card.appendChild(nameDiv);
    card.appendChild(scoreDiv);

    if (comp.members.length > 0) {
      const membersDiv = document.createElement('div');
      membersDiv.className = 'player-members';
      membersDiv.textContent = comp.members.join(' & ');
      card.appendChild(membersDiv);
    }

    container.appendChild(card);
  });
}

// ==================== START GAME ====================
function startGame() {
  state.competitors = buildCompetitorsFromInputs();
  state.currentCompetitor = 0;
  state.round = 1;

  if (selectedPreset === 'mixed') {
    const allSubs = [];
    ALL_CATEGORIES.forEach(cat => {
      cat.subcategories.forEach(sub => {
        allSubs.push({ ...sub, parentColor: cat.color, parentName: cat.name });
      });
    });
    const shuffled = allSubs.sort(() => Math.random() - 0.5);
    state.categories = shuffled.slice(0, CATS_PER_GAME);
  } else if (selectedPreset === 'custom' && customCategories) {
    state.categories = customCategories.slice(0, CATS_PER_GAME);
  } else {
    const targetName = PRESET_MAP[selectedPreset];
    const targetCat = ALL_CATEGORIES.find(c => c.name === targetName);
    state.categories = targetCat.subcategories.map(sub => ({
      ...sub,
      parentColor: targetCat.color,
      parentName: targetCat.name
    }));
  }

  state.board = state.categories.map(cat => {
    return cat.questions.map((q, i) => ({ ...q, value: (i + 1) * DOLLAR_INCREMENT, answered: false }));
  });

  const numCols = state.categories.length;
  const gridCols = `repeat(${numCols}, 1fr)`;
  document.getElementById('category-row').style.gridTemplateColumns = gridCols;
  document.getElementById('board').style.gridTemplateColumns = gridCols;
  document.getElementById('round-number').textContent = state.round;

  renderScoreCards();
  showScreen('game');
  renderBoard();
  updateUI();
}

// ==================== RENDER BOARD ====================
function renderBoard() {
  const catRow = document.getElementById('category-row');
  const boardEl = document.getElementById('board');
  catRow.innerHTML = '';
  boardEl.innerHTML = '';

  state.categories.forEach((sub) => {
    const div = document.createElement('div');
    div.className = 'category-cell';
    div.textContent = sub.name;
    div.style.background = `linear-gradient(135deg, ${sub.parentColor[0]}, ${sub.parentColor[1]})`;
    catRow.appendChild(div);
  });

  for (let qi = 0; qi < QS_PER_CAT; qi++) {
    for (let ci = 0; ci < state.categories.length; ci++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = `$${(qi + 1) * DOLLAR_INCREMENT}`;

      if (state.board[ci][qi].answered) {
        cell.classList.add('answered');
      } else {
        cell.addEventListener('click', () => {
          if (typeof onlineState !== 'undefined' && onlineState.isOnline && !onlineState.isHost) {
            // Client: send pick to host
            onlinePickQuestion(ci, qi);
          } else {
            pickQuestion(ci, qi);
          }
        });
      }
      boardEl.appendChild(cell);
    }
  }
}

// ==================== UPDATE CELL AFTER ANSWER ====================
function updateCell(catIdx, qIdx) {
  const boardEl = document.getElementById('board');
  const cells = boardEl.querySelectorAll('.cell');
  const cellIndex = qIdx * state.categories.length + catIdx;

  if (cells[cellIndex]) {
    cells[cellIndex].classList.add('answered');
    cells[cellIndex].onclick = null;
    cells[cellIndex].style.cursor = 'not-allowed';
  }
}

// ==================== UPDATE UI ====================
function updateUI() {
  // Update scores
  state.competitors.forEach((comp, i) => {
    const scoreEl = document.getElementById(`score-value-${i}`);
    if (scoreEl) scoreEl.textContent = `$${comp.score}`;
  });

  // Highlight active competitor
  document.querySelectorAll('.player-score').forEach(card => card.classList.remove('active'));
  const activeCard = document.getElementById(`score-card-${state.currentCompetitor}`);
  if (activeCard) activeCard.classList.add('active');

  // Update turn text
  const turnText = document.getElementById('turn-text');
  const comp = state.competitors[state.currentCompetitor];
  const color = CUSTOM_COLORS[state.currentCompetitor % CUSTOM_COLORS.length][0];

  if (comp.members.length > 0) {
    const memberName = comp.members[comp.currentMemberIdx];
    turnText.innerHTML = `<span style="color: ${color}">${comp.name}</span>'s turn to pick! <span style="font-size: 0.8em; opacity: 0.7">(${escapeHtml(memberName)} answering)</span>`;
  } else {
    turnText.innerHTML = `<span style="color: ${color}">${comp.name}</span>'s turn to pick!`;
  }

  document.querySelectorAll('.cell:not(.answered)').forEach(c => c.classList.remove('disabled'));
}

// ==================== GET CURRENT ANSWERER NAME ====================
function getCurrentAnswererName() {
  const comp = state.competitors[state.currentCompetitor];
  if (comp.members.length > 0) {
    return comp.members[comp.currentMemberIdx];
  }
  return comp.name;
}

// ==================== PICK QUESTION ====================
function pickQuestion(catIdx, qIdx) {
  if (state.board[catIdx][qIdx].answered) return;

  // Online client: send pick request to host instead of handling locally
  if (typeof onlineState !== 'undefined' && onlineState.isOnline && !onlineState.isHost) {
    onlinePickQuestion(catIdx, qIdx);
    return;
  }

  state.currentCatIdx = catIdx;
  state.currentQIdx = qIdx;
  const question = state.board[catIdx][qIdx];
  const sub = state.categories[catIdx];

  document.getElementById('modal-category').textContent = `${sub.parentName} \u2014 ${sub.name}`;
  document.getElementById('modal-value').textContent = `$${question.value}`;
  document.getElementById('modal-question').textContent = question.q;

  // Show who is answering
  const answeringAs = document.getElementById('answering-as');
  const comp = state.competitors[state.currentCompetitor];
  if (comp.members.length > 0) {
    const color = CUSTOM_COLORS[state.currentCompetitor % CUSTOM_COLORS.length][0];
    answeringAs.innerHTML = `Answering as: <strong style="color: ${color}">${escapeHtml(comp.members[comp.currentMemberIdx])}</strong>`;
    answeringAs.classList.remove('hidden');
  } else {
    answeringAs.classList.add('hidden');
  }

  document.getElementById('answer-section').classList.remove('hidden');
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('answer-input').value = '';

  // Online host: hide answer input when it's a remote player's turn
  if (typeof onlineState !== 'undefined' && onlineState.isOnline && onlineState.isHost && state.currentCompetitor !== 0) {
    document.getElementById('answer-section').classList.add('hidden');
  }

  document.getElementById('question-modal').classList.add('active');
  startTimer();

  // Online host: broadcast question to all clients
  if (typeof onlineState !== 'undefined' && onlineState.isOnline && onlineState.isHost) {
    broadcast({
      type: 'question-picked',
      catIdx, qIdx,
      category: `${sub.parentName} — ${sub.name}`,
      value: question.value,
      questionText: question.q,
      answeringPlayer: getCurrentAnswererName(),
      answeringPlayerIdx: state.currentCompetitor,
      answeringAs: comp.members.length > 0 ? comp.members[comp.currentMemberIdx] : null
    });
  }

  setTimeout(() => document.getElementById('answer-input').focus(), 100);
}

// ==================== TIMER ====================
function startTimer() {
  if (selectedTimer === 0) {
    document.getElementById('timer-bar').style.width = '100%';
    document.getElementById('timer-bar').style.background = 'linear-gradient(90deg, #00d2d3, #00b894)';
    document.getElementById('timer-text').textContent = 'OFF';
    return;
  }

  // Online host: broadcast timer start to clients
  if (typeof onlineState !== 'undefined' && onlineState.isOnline && onlineState.isHost) {
    broadcast({ type: 'timer-start', duration: selectedTimer });
  }

  let timeLeft = selectedTimer;
  const bar = document.getElementById('timer-bar');
  const txt = document.getElementById('timer-text');
  bar.style.width = '100%';
  bar.style.background = 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb)';
  txt.textContent = `${timeLeft}s`;

  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    timeLeft--;
    txt.textContent = `${timeLeft}s`;
    bar.style.width = `${(timeLeft / selectedTimer) * 100}%`;
    if (timeLeft <= 3) bar.style.background = 'linear-gradient(90deg, #ff6b6b, #ee5a24)';
    if (timeLeft <= 0) {
      clearInterval(state.timerInterval);
      handleTimeUp();
    }
  }, 1000);
}

function handleTimeUp() {
  const q = state.board[state.currentCatIdx][state.currentQIdx];
  q.answered = true;
  state.competitors[state.currentCompetitor].score -= q.value;
  updateCell(state.currentCatIdx, state.currentQIdx);
  showResult(false, q.a, true);

  // Online host: broadcast result to all clients
  if (typeof onlineState !== 'undefined' && onlineState.isOnline && onlineState.isHost) {
    broadcast({
      type: 'answer-result',
      correct: false,
      correctAnswer: q.a,
      timedOut: true,
      newScore: state.competitors[state.currentCompetitor].score,
      catIdx: state.currentCatIdx,
      qIdx: state.currentQIdx
    });
  }
}

// ==================== SUBMIT ANSWER ====================
function submitAnswer() {
  const input = document.getElementById('answer-input');
  const answer = input.value.trim();
  if (!answer) return;

  // Online client: send answer to host instead of handling locally
  if (typeof onlineState !== 'undefined' && onlineState.isOnline && !onlineState.isHost) {
    onlineSubmitAnswer();
    return;
  }

  clearInterval(state.timerInterval);
  const q = state.board[state.currentCatIdx][state.currentQIdx];
  const correct = checkAnswer(answer, q);

  q.answered = true;
  if (correct) {
    state.competitors[state.currentCompetitor].score += q.value;
  } else {
    state.competitors[state.currentCompetitor].score -= q.value;
  }

  updateCell(state.currentCatIdx, state.currentQIdx);
  showResult(correct, q.a);

  // Online host: broadcast result to all clients
  if (typeof onlineState !== 'undefined' && onlineState.isOnline && onlineState.isHost) {
    broadcast({
      type: 'answer-result',
      correct,
      correctAnswer: q.a,
      timedOut: false,
      newScore: state.competitors[state.currentCompetitor].score,
      catIdx: state.currentCatIdx,
      qIdx: state.currentQIdx
    });
  }
}

function showResult(correct, correctAnswer, timedOut = false) {
  document.getElementById('answer-section').classList.add('hidden');
  document.getElementById('result-section').classList.remove('hidden');

  const icon = document.getElementById('result-icon');
  const text = document.getElementById('result-text');
  const answerEl = document.getElementById('correct-answer');

  if (timedOut) {
    icon.textContent = '\u23F0';
    text.textContent = 'TIME\'S UP!';
    text.className = 'result-text incorrect';
  } else if (correct) {
    icon.textContent = '\u2705';
    text.textContent = 'CORRECT!';
    text.className = 'result-text correct';
  } else {
    icon.textContent = '\u274C';
    text.textContent = 'WRONG!';
    text.className = 'result-text incorrect';
  }

  answerEl.textContent = 'The answer was: ';
  const span = document.createElement('span');
  span.textContent = correctAnswer.toUpperCase();
  answerEl.appendChild(span);
  updateUI();
}

// ==================== CLOSE MODAL (TURN CYCLING) ====================
function closeModal() {
  clearInterval(state.timerInterval);
  document.getElementById('question-modal').classList.remove('active');

  // Online host: use online turn cycling
  if (typeof onlineState !== 'undefined' && onlineState.isOnline && onlineState.isHost) {
    onlineCloseModal();
    return;
  }

  // Online client: close modal and tell host to cycle turn
  if (typeof onlineState !== 'undefined' && onlineState.isOnline && !onlineState.isHost) {
    sendToHost({ type: 'client-continue' });
    return;
  }

  // Cycle to next competitor
  state.currentCompetitor = (state.currentCompetitor + 1) % state.competitors.length;

  // If team mode, advance the current member within the NEW current team
  const comp = state.competitors[state.currentCompetitor];
  if (comp.members.length > 0) {
    comp.currentMemberIdx = (comp.currentMemberIdx + 1) % comp.members.length;
  }

  updateUI();

  const totalQ = state.categories.length * QS_PER_CAT;
  const answeredQ = state.board.reduce((sum, cat) => sum + cat.filter(q => q.answered).length, 0);
  if (answeredQ >= totalQ) {
    setTimeout(showGameOver, 500);
  }
}

// ==================== GAME OVER ====================
function showGameOver() {
  showScreen('gameover');

  const maxScore = Math.max(...state.competitors.map(c => c.score));
  const winners = state.competitors
    .map((c, i) => ({ name: c.name, score: c.score, idx: i }))
    .filter(c => c.score === maxScore);

  const display = document.getElementById('winner-display');
  if (winners.length > 1) {
    display.textContent = "IT'S A TIE!";
  } else {
    display.textContent = `${winners[0].name} WINS!`;
  }

  const scoresDiv = document.getElementById('final-scores');
  scoresDiv.innerHTML = '';

  // Sort by score descending
  const sorted = [...state.competitors].map((c, i) => ({ ...c, origIdx: i }))
    .sort((a, b) => b.score - a.score);

  sorted.forEach((comp) => {
    const color = CUSTOM_COLORS[comp.origIdx % CUSTOM_COLORS.length][0];
    const card = document.createElement('div');
    card.className = 'final-score-card';
    card.style.borderColor = color;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.style.color = color;
    nameDiv.textContent = comp.name;

    const scoreDiv = document.createElement('div');
    scoreDiv.className = 'score';
    scoreDiv.textContent = `$${comp.score}`;

    card.appendChild(nameDiv);
    card.appendChild(scoreDiv);

    if (comp.members.length > 0) {
      const membersDiv = document.createElement('div');
      membersDiv.className = 'members-list';
      membersDiv.textContent = comp.members.join(' & ');
      card.appendChild(membersDiv);
    }

    scoresDiv.appendChild(card);
  });
}

function playAgain() {
  state = {
    competitors: [],
    currentCompetitor: 0,
    categories: [],
    board: [],
    round: 1,
    timerInterval: null,
    currentCatIdx: -1,
    currentQIdx: -1
  };
  renderPlayerInputs();
  showScreen('landing');
}

// ==================== CSV IMPORT ====================
function openImportModal() {
  document.getElementById('import-modal').classList.add('active');
  document.getElementById('import-preview').classList.add('hidden');
  document.getElementById('import-error').classList.add('hidden');
  document.getElementById('confirm-import-btn').disabled = true;
  parsedImportData = null;

  const dropZone = document.getElementById('drop-zone');
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);
}

function closeImportModal() {
  document.getElementById('import-modal').classList.remove('active');
  parsedImportData = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('drop-zone').classList.add('drop-zone-active');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('drop-zone').classList.remove('drop-zone-active');
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('drop-zone').classList.remove('drop-zone-active');

  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].name.endsWith('.csv')) {
    readCSVFile(files[0]);
  } else {
    showImportError('Please drop a .csv file');
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) readCSVFile(file);
}

function readCSVFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    parseCSV(text);
  };
  reader.onerror = function() {
    showImportError('Failed to read file');
  };
  reader.readAsText(file);
}

function parseCSV(text) {
  const errorEl = document.getElementById('import-error');
  errorEl.classList.add('hidden');

  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

  if (lines.length < 2) {
    showImportError('CSV must have a header row and at least one question');
    return;
  }

  const header = lines[0].toLowerCase().replace(/"/g, '').trim();
  const requiredCols = ['category', 'subcategory', 'question', 'answer'];
  const hasRequiredCols = requiredCols.every(col => header.includes(col));

  if (!hasRequiredCols) {
    showImportError('CSV must have columns: Category, Subcategory, Question, Answer');
    return;
  }

  const categoryMap = {};
  const categoryOrder = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields.length < 4) continue;

    const [cat, sub, q, a, alts] = fields.map(f => f.trim().replace(/^"|"$/g, ''));

    if (!cat || !sub || !q || !a) continue;

    if (!categoryMap[cat]) {
      categoryMap[cat] = {};
      categoryOrder.push(cat);
    }
    if (!categoryMap[cat][sub]) {
      categoryMap[cat][sub] = [];
    }

    const altList = alts ? alts.split('|').map(s => s.trim()).filter(s => s) : [];
    categoryMap[cat][sub].push({ q, a: a.toLowerCase(), alt: altList });
  }

  const validCats = categoryOrder.filter(cat => {
    const subs = Object.keys(categoryMap[cat]);
    return subs.length >= 1 && subs.some(sub => categoryMap[cat][sub].length >= 1);
  });

  if (validCats.length === 0) {
    showImportError('No valid categories found. Check your CSV format.');
    return;
  }

  parsedImportData = validCats.map((cat, i) => ({
    name: cat,
    color: CUSTOM_COLORS[i % CUSTOM_COLORS.length],
    parentColor: CUSTOM_COLORS[i % CUSTOM_COLORS.length],
    parentName: cat,
    subcategories: Object.keys(categoryMap[cat]).map(sub => ({
      name: sub,
      parentColor: CUSTOM_COLORS[i % CUSTOM_COLORS.length],
      parentName: cat,
      questions: categoryMap[cat][sub].slice(0, QS_PER_CAT)
    }))
  }));

  const totalQuestions = parsedImportData.reduce((sum, cat) =>
    sum + cat.subcategories.reduce((s, sub) => s + sub.questions.length, 0), 0);

  showImportPreview(validCats, categoryMap, totalQuestions);
  document.getElementById('confirm-import-btn').disabled = false;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

function showImportPreview(cats, categoryMap, totalQuestions) {
  const previewEl = document.getElementById('import-preview');
  const titleEl = document.getElementById('preview-title');
  const countEl = document.getElementById('preview-count');
  const catsEl = document.getElementById('preview-categories');

  previewEl.classList.remove('hidden');
  titleEl.textContent = 'Preview:';
  countEl.textContent = `${totalQuestions} questions in ${cats.length} categories`;

  catsEl.innerHTML = '';
  cats.forEach(cat => {
    const subs = Object.keys(categoryMap[cat]);
    const catDiv = document.createElement('div');
    catDiv.className = 'preview-category';
    catDiv.innerHTML = `<strong>${escapeHtml(cat)}</strong> \u2014 ${subs.length} subcategory${subs.length !== 1 ? 'ies' : 'y'}`;
    catsEl.appendChild(catDiv);
  });
}

function showImportError(msg) {
  const errorEl = document.getElementById('import-error');
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
  document.getElementById('import-preview').classList.add('hidden');
  document.getElementById('confirm-import-btn').disabled = true;
  parsedImportData = null;
}

function confirmImport() {
  if (!parsedImportData) return;
  customCategories = parsedImportData;
  selectedPreset = 'custom';

  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('selected'));
  const customBtn = document.querySelector('[data-preset="custom"]');
  if (customBtn) {
    customBtn.classList.add('selected');
    const label = customBtn.querySelector('.preset-label');
    if (label) label.textContent = `CUSTOM (${parsedImportData.length} CATS)`;
  }

  closeImportModal();
}

function downloadTemplate() {
  const template = `Category,Subcategory,Question,Answer,Alternatives (pipe-separated)
"My Category","Subcategory 1","This is a question","the answer","alt1|alt2"
"My Category","Subcategory 1","Another question","another answer",""
"My Category","Subcategory 1","Third question","third answer",""
"My Category","Subcategory 1","Fourth question","fourth answer",""
"My Category","Subcategory 1","Fifth question","fifth answer",""
"My Category","Subcategory 2","Question one","answer one",""
"My Category","Subcategory 2","Question two","answer two",""
"My Category","Subcategory 2","Question three","answer three",""
"My Category","Subcategory 2","Question four","answer four",""
"My Category","Subcategory 2","Question five","answer five",""
"Another Category","Subcategory A","Some question","some answer",""
"Another Category","Subcategory A","Other question","other answer",""
"Another Category","Subcategory A","Yet another question","yet another answer",""
"Another Category","Subcategory A","One more question","one more answer",""
"Another Category","Subcategory A","Final question","final answer",""
"Another Category","Subcategory B","First question","first answer",""
"Another Category","Subcategory B","Second question","second answer",""
"Another Category","Subcategory B","Third question","third answer",""
"Another Category","Subcategory B","Fourth question","fourth answer",""
"Another Category","Subcategory B","Fifth question","fifth answer",""`;

  const blob = new Blob([template], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jeopardy-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('question-modal');
  if (!modal.classList.contains('active')) return;

  if (e.key === 'Enter') {
    const answerSection = document.getElementById('answer-section');
    const resultSection = document.getElementById('result-section');

    if (!answerSection.classList.contains('hidden')) {
      submitAnswer();
    } else if (!resultSection.classList.contains('hidden')) {
      closeModal();
    }
  }
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  renderPlayerInputs();
});
