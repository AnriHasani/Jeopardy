// ==================== ONLINE MULTIPLAYER ====================
// Uses PeerJS for WebRTC-based peer-to-peer connections

// ==================== ONLINE STATE ====================
let onlineState = {
  isOnline: false,
  isHost: false,
  peer: null,
  connections: {},    // host: { peerId: { conn, name } }
  myConn: null,       // client: connection to host
  roomCode: '',
  playerName: '',
  players: [],        // [{id, name, ready}]
  maxPlayers: 2
};

// ==================== ONLINE MODAL ====================
function openOnlineModal() {
  document.getElementById('online-modal').classList.add('active');
  document.getElementById('online-options').classList.remove('hidden');
  document.getElementById('create-room-form').classList.add('hidden');
  document.getElementById('join-room-form').classList.add('hidden');
  document.getElementById('join-error').classList.add('hidden');
}

function closeOnlineModal() {
  document.getElementById('online-modal').classList.remove('active');
}

function showCreateRoom() {
  document.getElementById('online-options').classList.add('hidden');
  document.getElementById('create-room-form').classList.remove('hidden');
}

function showJoinRoom() {
  document.getElementById('online-options').classList.add('hidden');
  document.getElementById('join-room-form').classList.remove('hidden');
}

function backToOnlineOptions() {
  document.getElementById('create-room-form').classList.add('hidden');
  document.getElementById('join-room-form').classList.add('hidden');
  document.getElementById('online-options').classList.remove('hidden');
}

// ==================== HOST: CREATE ROOM ====================
function createRoom() {
  const roomCode = 'JEOPARDY-' + Math.floor(1000 + Math.random() * 9000);
  onlineState.roomCode = roomCode;
  onlineState.isOnline = true;
  onlineState.isHost = true;
  onlineState.players = [];
  onlineState.connections = {};

  // Determine max players from current mode
  onlineState.maxPlayers = getExpectedPlayerCount();

  // Create Peer with room code as ID
  const peer = new Peer(roomCode);
  onlineState.peer = peer;

  peer.on('open', (id) => {
    console.log('Host room created:', id);
    closeOnlineModal();
    showLobby();
    updateLobbyPlayerList();
  });

  peer.on('connection', (conn) => {
    console.log('Incoming connection:', conn.peer);

    conn.on('open', () => {
      // Wait for join message with player name
    });

    conn.on('data', (data) => {
      handleHostMessage(conn.peer, data, conn);
    });

    conn.on('close', () => {
      console.log('Player disconnected:', conn.peer);
      removePlayer(conn.peer);
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
    });
  });

  peer.on('error', (err) => {
    console.error('Peer error:', err);
    if (err.type === 'unavailable-id') {
      // Room code taken, try another
      onlineState.roomCode = 'JEOPARDY-' + Math.floor(1000 + Math.random() * 9000);
      peer.destroy();
      createRoomWithCode(onlineState.roomCode);
    }
  });
}

function createRoomWithCode(code) {
  onlineState.roomCode = code;
  onlineState.isOnline = true;
  onlineState.isHost = true;
  onlineState.players = [];
  onlineState.connections = {};
  onlineState.maxPlayers = getExpectedPlayerCount();

  const peer = new Peer(code);
  onlineState.peer = peer;

  peer.on('open', (id) => {
    console.log('Host room created:', id);
    closeOnlineModal();
    showLobby();
    updateLobbyPlayerList();
  });

  peer.on('connection', (conn) => {
    conn.on('data', (data) => {
      handleHostMessage(conn.peer, data, conn);
    });
    conn.on('close', () => {
      removePlayer(conn.peer);
    });
  });
}

function getExpectedPlayerCount() {
  switch (selectedMode) {
    case '1v1': return 2;
    case '2v2': return 4;
    case '3v3': return 6;
    case 'ffa':
      return parseInt(document.getElementById('ffa-players-count').value) || 2;
    case 'custom': {
      const teams = parseInt(document.getElementById('custom-teams-count').value) || 2;
      const members = parseInt(document.getElementById('custom-members-count').value) || 2;
      return teams * members;
    }
    default: return 2;
  }
}

// ==================== HOST: MESSAGE HANDLERS ====================
function handleHostMessage(peerId, data, conn) {
  switch (data.type) {
    case 'join':
      addPlayer(peerId, data.name, conn);
      break;

    case 'pick-question':
      handleOnlinePickQuestion(peerId, data.catIdx, data.qIdx);
      break;

    case 'submit-answer':
      handleOnlineSubmitAnswer(peerId, data.answer);
      break;
  }
}

function addPlayer(peerId, name, conn) {
  // Check if player name is already taken
  if (onlineState.players.some(p => p.name === name)) {
    conn.send({ type: 'join-rejected', reason: 'Name already taken' });
    return;
  }

  // Check if room is full
  if (onlineState.players.length >= onlineState.maxPlayers) {
    conn.send({ type: 'join-rejected', reason: 'Room is full' });
    return;
  }

  onlineState.connections[peerId] = { conn, name };
  onlineState.players.push({ id: peerId, name, ready: true });

  // Send confirmation
  conn.send({ type: 'join-accepted', roomCode: onlineState.roomCode });

  // Broadcast updated player list
  broadcastLobbyUpdate();

  // Update start button
  updateStartButton();

  console.log('Player joined:', name, '(' + peerId + ')');
}

function removePlayer(peerId) {
  const idx = onlineState.players.findIndex(p => p.id === peerId);
  if (idx !== -1) {
    onlineState.players.splice(idx, 1);
    delete onlineState.connections[peerId];
    broadcastLobbyUpdate();
    updateStartButton();
    updateLobbyPlayerList();
  }
}

function broadcastLobbyUpdate() {
  const playerNames = onlineState.players.map(p => p.name);
  broadcast({
    type: 'lobby-update',
    players: playerNames
  });
  updateLobbyPlayerList();
}

function updateStartButton() {
  const btn = document.getElementById('start-online-btn');
  if (btn) {
    const ready = onlineState.players.length >= (onlineState.maxPlayers - 1);
    btn.disabled = !ready;
    if (ready) {
      btn.innerHTML = '<span class="btn-icon">🎮</span> START GAME';
    } else {
      const needed = onlineState.maxPlayers - 1 - onlineState.players.length;
      btn.innerHTML = `<span class="btn-icon">⏳</span> WAITING (${onlineState.players.length}/${onlineState.maxPlayers - 1} joined)`;
    }
  }
}

// ==================== CLIENT: JOIN ROOM ====================
function joinRoom() {
  const nameInput = document.getElementById('join-name-input');
  const roomInput = document.getElementById('join-room-input');
  const errorEl = document.getElementById('join-error');

  const name = nameInput.value.trim();
  const roomCode = roomInput.value.trim().toUpperCase();

  if (!name) {
    showJoinError('Please enter your name');
    return;
  }
  if (!roomCode) {
    showJoinError('Please enter a room code');
    return;
  }

  onlineState.playerName = name;
  onlineState.roomCode = roomCode;
  onlineState.isOnline = true;
  onlineState.isHost = false;

  // Create peer and connect to host
  const peer = new Peer();
  onlineState.peer = peer;

  peer.on('open', () => {
    console.log('Client peer ready:', peer.id);
    const conn = peer.connect(roomCode, { metadata: { name } });
    onlineState.myConn = conn;

    conn.on('open', () => {
      // Send join message
      conn.send({ type: 'join', name });

      // Listen for messages from host
      conn.on('data', (data) => {
        handleClientMessage(data);
      });

      conn.on('close', () => {
        console.log('Disconnected from host');
        showJoinError('Disconnected from host');
      });
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      showJoinError('Could not connect to room. Check the code and try again.');
    });
  });

  peer.on('error', (err) => {
    console.error('Peer error:', err);
    if (err.type === 'peer-unavailable') {
      showJoinError('Room not found. Check the code and try again.');
    } else {
      showJoinError('Connection error: ' + err.type);
    }
  });
}

function showJoinError(msg) {
  const errorEl = document.getElementById('join-error');
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}

// ==================== CLIENT: MESSAGE HANDLERS ====================
function handleClientMessage(data) {
  switch (data.type) {
    case 'join-accepted':
      closeOnlineModal();
      showLobbyClient();
      break;

    case 'join-rejected':
      showJoinError(data.reason);
      break;

    case 'lobby-update':
      onlineState.players = data.players.map((name, i) => ({ name }));
      updateLobbyPlayerList();
      break;

    case 'game-start':
      handleClientGameStart(data);
      break;

    case 'question-picked':
      handleClientQuestionPicked(data);
      break;

    case 'answer-result':
      handleClientAnswerResult(data);
      break;

    case 'turn-update':
      handleClientTurnUpdate(data);
      break;

    case 'cell-marked':
      handleClientCellMarked(data);
      break;

    case 'game-over':
      handleClientGameOver(data);
      break;

    case 'timer-start':
      handleClientTimerStart(data);
      break;

    case 'time-up':
      handleClientTimeUp(data);
      break;
  }
}

// ==================== LOBBY UI ====================
function showLobby() {
  showScreen('online-lobby');
  document.getElementById('lobby-host-view').classList.remove('hidden');
  document.getElementById('lobby-client-view').classList.add('hidden');
  document.getElementById('room-code-display').textContent = onlineState.roomCode;
}

function showLobbyClient() {
  showScreen('online-lobby');
  document.getElementById('lobby-host-view').classList.add('hidden');
  document.getElementById('lobby-client-view').classList.remove('hidden');
}

function updateLobbyPlayerList() {
  const hostList = document.getElementById('lobby-player-list-host');
  const clientList = document.getElementById('lobby-player-list-client');

  const names = onlineState.players.map(p => p.name);
  // Add host name at the front
  if (onlineState.isHost) {
    names.unshift('You (Host)');
  }

  const html = names.map((name, i) => {
    const color = CUSTOM_COLORS[i % CUSTOM_COLORS.length][0];
    return `<div class="lobby-player" style="border-left-color: ${color}">
      <span class="lobby-player-dot" style="background: ${color}"></span>
      <span class="lobby-player-name">${escapeHtml(name)}</span>
      ${i === 0 && onlineState.isHost ? '<span class="lobby-player-host">HOST</span>' : ''}
    </div>`;
  }).join('');

  if (hostList) hostList.innerHTML = html;
  if (clientList) clientList.innerHTML = html;
}

function copyRoomCode() {
  navigator.clipboard.writeText(onlineState.roomCode).then(() => {
    const btn = document.querySelector('.copy-btn');
    const original = btn.textContent;
    btn.textContent = 'COPIED!';
    setTimeout(() => btn.textContent = original, 2000);
  }).catch(() => {
    // Fallback: select text
    const el = document.getElementById('room-code-display');
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
}

function leaveLobby() {
  if (onlineState.peer) {
    onlineState.peer.destroy();
  }
  onlineState = {
    isOnline: false,
    isHost: false,
    peer: null,
    connections: {},
    myConn: null,
    roomCode: '',
    playerName: '',
    players: [],
    maxPlayers: 2
  };
  showScreen('landing');
}

// ==================== START ONLINE GAME (HOST) ====================
function startOnlineGame() {
  if (!onlineState.isHost || onlineState.players.length < 1) return;

  // Build competitors from the host's config + joined players
  const competitors = buildOnlineCompetitors();

  // Run the same game setup as local
  state.competitors = competitors;
  state.currentCompetitor = 0;
  state.round = 1;

  // Build categories
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

  // Build board
  state.board = state.categories.map(cat => {
    return cat.questions.map((q, i) => ({ ...q, value: (i + 1) * DOLLAR_INCREMENT, answered: false }));
  });

  // Render locally (host plays like local)
  const numCols = state.categories.length;
  const gridCols = `repeat(${numCols}, 1fr)`;
  document.getElementById('category-row').style.gridTemplateColumns = gridCols;
  document.getElementById('board').style.gridTemplateColumns = gridCols;
  document.getElementById('round-number').textContent = state.round;

  renderScoreCards();
  showScreen('game');
  renderBoard();
  updateUI();

  // Broadcast game start to all clients
  broadcast({
    type: 'game-start',
    competitors: state.competitors.map(c => ({
      name: c.name,
      score: c.score,
      members: c.members,
      currentMemberIdx: c.currentMemberIdx
    })),
    categories: state.categories.map(c => ({
      name: c.name,
      parentColor: c.parentColor,
      parentName: c.parentName
    })),
    board: state.board.map(cat => cat.map(q => ({
      q: q.q,
      value: q.value,
      answered: q.answered
    }))),
    timer: selectedTimer,
    round: state.round,
    playerNames: onlineState.players.map(p => p.name)
  });

  // Determine which competitor index is the host (index 0)
  // and which are remote players
  onlineState.playerIndices = {};
  onlineState.playerIndices[onlineState.peer.id] = 0;
  onlineState.players.forEach((p, i) => {
    onlineState.playerIndices[p.id] = i + 1;
  });
}

function buildOnlineCompetitors() {
  const competitors = [];

  // Host is always first competitor
  const hostNameInput = document.querySelector('.player-name-input');
  const hostName = hostNameInput ? hostNameInput.value.trim() : 'Host';

  if (selectedMode === '1v1' || selectedMode === 'ffa') {
    competitors.push({
      name: hostName || 'Host',
      score: 0,
      members: [],
      currentMemberIdx: 0
    });

    // Add remote players
    onlineState.players.forEach(p => {
      competitors.push({
        name: p.name,
        score: 0,
        members: [],
        currentMemberIdx: 0
      });
    });
  } else {
    // Team modes - host is team 1 player 1, remote players fill remaining slots
    // For simplicity, each remote player is their own team member
    // Host gets a team with their name
    competitors.push({
      name: hostName || 'Host',
      score: 0,
      members: [],
      currentMemberIdx: 0
    });

    onlineState.players.forEach(p => {
      competitors.push({
        name: p.name,
        score: 0,
        members: [],
        currentMemberIdx: 0
      });
    });
  }

  return competitors;
}

// ==================== HOST: GAME ACTIONS ====================
function handleOnlinePickQuestion(peerId, catIdx, qIdx) {
  // Validate it's this player's turn
  const playerIdx = onlineState.playerIndices[peerId];
  if (playerIdx !== state.currentCompetitor) return;
  if (state.board[catIdx][qIdx].answered) return;

  // Run pickQuestion locally on host — it broadcasts question-picked to clients
  pickQuestion(catIdx, qIdx);
}

function handleOnlineSubmitAnswer(peerId, answer) {
  // Validate it's this player's turn to answer
  const playerIdx = onlineState.playerIndices[peerId];
  if (playerIdx !== state.currentCompetitor) return;

  // Run submitAnswer logic on host
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

  // Broadcast result to all clients
  broadcast({
    type: 'answer-result',
    correct,
    correctAnswer: q.a,
    timedOut: false,
    newScore: state.competitors[state.currentCompetitor].score,
    catIdx: state.currentCatIdx,
    qIdx: state.currentQIdx
  });

  // Show result locally on host
  showResult(correct, q.a);
}

function handleOnlineTimeUp() {
  const q = state.board[state.currentCatIdx][state.currentQIdx];
  q.answered = true;
  state.competitors[state.currentCompetitor].score -= q.value;
  updateCell(state.currentCatIdx, state.currentQIdx);

  broadcast({
    type: 'answer-result',
    correct: false,
    correctAnswer: q.a,
    timedOut: true,
    newScore: state.competitors[state.currentCompetitor].score,
    catIdx: state.currentCatIdx,
    qIdx: state.currentQIdx
  });

  showResult(false, q.a, true);
}

// ==================== HOST: CLOSE MODAL / TURN CYCLING ====================
function onlineCloseModal() {
  clearInterval(state.timerInterval);
  document.getElementById('question-modal').classList.remove('active');

  // Cycle to next competitor
  state.currentCompetitor = (state.currentCompetitor + 1) % state.competitors.length;

  // If team mode, advance the current member within the NEW current team
  const comp = state.competitors[state.currentCompetitor];
  if (comp.members.length > 0) {
    comp.currentMemberIdx = (comp.currentMemberIdx + 1) % comp.members.length;
  }

  updateUI();

  // Broadcast turn update
  broadcast({
    type: 'turn-update',
    currentCompetitor: state.currentCompetitor,
    competitors: state.competitors.map(c => ({
      name: c.name,
      score: c.score,
      members: c.members,
      currentMemberIdx: c.currentMemberIdx
    }))
  });

  // Check game over
  const totalQ = state.categories.length * QS_PER_CAT;
  const answeredQ = state.board.reduce((sum, cat) => sum + cat.filter(q => q.answered).length, 0);
  if (answeredQ >= totalQ) {
    setTimeout(() => {
      broadcast({ type: 'game-over' });
      showGameOver();
    }, 500);
  }
}

// ==================== CLIENT: GAME EVENT HANDLERS ====================
function handleClientGameStart(data) {
  // Rebuild state from host data
  state.competitors = data.competitors;
  state.currentCompetitor = 0;
  state.round = data.round;
  state.categories = data.categories;
  state.board = data.board;
  selectedTimer = data.timer;

  // Find client's competitor index
  onlineState.myCompetitorIdx = -1;
  for (let i = 0; i < data.competitors.length; i++) {
    if (data.competitors[i].name === onlineState.playerName) {
      onlineState.myCompetitorIdx = i;
      break;
    }
  }

  // Render board
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

function handleClientQuestionPicked(data) {
  state.currentCatIdx = data.catIdx;
  state.currentQIdx = data.qIdx;

  const question = state.board[data.catIdx][data.qIdx];

  document.getElementById('modal-category').textContent = data.category;
  document.getElementById('modal-value').textContent = `$${data.value}`;
  document.getElementById('modal-question').textContent = data.questionText;

  // Show who is answering
  const answeringAs = document.getElementById('answering-as');
  if (data.answeringAs) {
    const color = CUSTOM_COLORS[data.answeringPlayerIdx % CUSTOM_COLORS.length][0];
    answeringAs.innerHTML = `Answering as: <strong style="color: ${color}">${escapeHtml(data.answeringAs)}</strong>`;
    answeringAs.classList.remove('hidden');
  } else {
    answeringAs.classList.add('hidden');
  }

  // Only show answer input if it's this client's turn
  const isMyTurn = data.answeringPlayerIdx === onlineState.myCompetitorIdx;
  const answerSection = document.getElementById('answer-section');
  const resultSection = document.getElementById('result-section');

  if (isMyTurn) {
    answerSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
    document.getElementById('answer-input').value = '';
  } else {
    answerSection.classList.add('hidden');
    resultSection.classList.add('hidden');
  }

  document.getElementById('question-modal').classList.add('active');

  // Timer is started by the timer-start message from host
  // Just handle focus for the answer input
  if (isMyTurn) {
    setTimeout(() => document.getElementById('answer-input').focus(), 100);
  }
}

function handleClientAnswerResult(data) {
  clearInterval(state.timerInterval);

  // Update board cell
  state.board[data.catIdx][data.qIdx].answered = true;
  updateCell(data.catIdx, data.qIdx);

  // Update score
  state.competitors[state.currentCompetitor].score = data.newScore;
  updateUI();

  // Show result
  showResult(data.correct, data.correctAnswer, data.timedOut);
}

function handleClientTurnUpdate(data) {
  state.currentCompetitor = data.currentCompetitor;
  state.competitors = data.competitors;
  updateUI();
}

function handleClientCellMarked(data) {
  state.board[data.catIdx][data.qIdx].answered = true;
  updateCell(data.catIdx, data.qIdx);
}

function handleClientGameOver(data) {
  showGameOver();
}

function handleClientTimerStart(data) {
  startClientTimer(data.duration);
}

function handleClientTimeUp(data) {
  clearInterval(state.timerInterval);
  handleTimeUp();
}

// ==================== CLIENT TIMER ====================
function startClientTimer(duration) {
  if (duration === 0) {
    document.getElementById('timer-bar').style.width = '100%';
    document.getElementById('timer-bar').style.background = 'linear-gradient(90deg, #00d2d3, #00b894)';
    document.getElementById('timer-text').textContent = 'OFF';
    return;
  }

  let timeLeft = duration;
  const bar = document.getElementById('timer-bar');
  const txt = document.getElementById('timer-text');
  bar.style.width = '100%';
  bar.style.background = 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb)';
  txt.textContent = `${timeLeft}s`;

  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    timeLeft--;
    txt.textContent = `${timeLeft}s`;
    bar.style.width = `${(timeLeft / duration) * 100}%`;
    if (timeLeft <= 3) bar.style.background = 'linear-gradient(90deg, #ff6b6b, #ee5a24)';
    if (timeLeft <= 0) {
      clearInterval(state.timerInterval);
      // Host will send time-up message, but we can also handle locally
    }
  }, 1000);
}

// ==================== BROADCAST UTILITY ====================
function broadcast(data) {
  if (!onlineState.isHost) return;
  Object.values(onlineState.connections).forEach(({ conn }) => {
    if (conn.open) {
      conn.send(data);
    }
  });
}

function sendToHost(data) {
  if (onlineState.isHost || !onlineState.myConn) return;
  if (onlineState.myConn.open) {
    onlineState.myConn.send(data);
  }
}

// ==================== ONLINE PICK QUESTION (CLIENT) ====================
function onlinePickQuestion(catIdx, qIdx) {
  if (!onlineState.isOnline || onlineState.isHost) return;
  if (state.board[catIdx][qIdx].answered) return;

  sendToHost({
    type: 'pick-question',
    catIdx,
    qIdx
  });
}

// ==================== ONLINE SUBMIT ANSWER (CLIENT) ====================
function onlineSubmitAnswer() {
  if (!onlineState.isOnline || onlineState.isHost) return;
  const input = document.getElementById('answer-input');
  const answer = input.value.trim();
  if (!answer) return;

  clearInterval(state.timerInterval);
  input.value = '';

  sendToHost({
    type: 'submit-answer',
    answer
  });
}

// ==================== INTEGRATION WITH GAME.JS ====================
// Override functions when in online mode

const _originalPickQuestion = pickQuestion;
const _originalSubmitAnswer = submitAnswer;
const _originalStartTimer = startTimer;
const _originalCloseModal = closeModal;
const _originalHandleTimeUp = handleTimeUp;
const _originalPlayAgain = playAgain;

// We don't override pickQuestion/submitAnswer directly because the host needs
// the original functions to work locally. Instead, we add guards.

// Override playAgain to handle online cleanup
playAgain = function() {
  if (onlineState.isOnline) {
    if (onlineState.peer) {
      // Broadcast game-over to clients
      broadcast({ type: 'game-over' });
      onlineState.peer.destroy();
    }
    onlineState = {
      isOnline: false,
      isHost: false,
      peer: null,
      connections: {},
      myConn: null,
      roomCode: '',
      playerName: '',
      players: [],
      maxPlayers: 2
    };
  }

  _originalPlayAgain();
};
