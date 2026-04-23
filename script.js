const logs = [];

const players = {
  Stepan: {
    code: '852456',
    displayName: 'Štěpán',
    letters: [],
    puzzles: [
      {
        prompt: 'a) Sofii je 12\nb) Zdenkovi je 9\nKolik je Sofii * Vaškovy * Zdenkovi * Jendovi',
        answer: '1944',
        letter: 'H',
      },
      {
        prompt: 'Kolik je 0 ve jméně „samuel“ vynásobit kolik je 1 ve jméně „martin“',
        answer: '528',
        letter: 'J',
      },
      {
        prompt: 'Zadaný kód: PQO47A\na) Caligula šel své kroky a potom šel dalších 10 kroků',
        answer: 'CDB47N',
        letter: 'T',
      },
    ],
  },
  Martin: {
    code: '654258',
    displayName: 'Martin',
    letters: [],
    puzzles: [
      {
        prompt: 'a) Vaškovy je 3\nb) Zdenkovi je 9\nKolik je Vaškovi * Zdenkovi * Jendovi * Sofii',
        answer: '1944',
        letter: 'L',
      },
      {
        prompt: 'Číslo které mi dal Mendělev * 142 + 6',
        answer: '1000',
        letter: 'M',
      },
      {
        prompt: 'Kód je JBN77Q\nNejslavnější český panovník má číslo, vzal ho, vynásobil 6 a potom posunul všechna písmena o to číslo a čísla vynásobil 2',
        answer: 'LDP154S',
        letter: 'Q',
      },
    ],
  },
};

const state = {
  playerKey: null,
  step: 0,
};

const app = document.getElementById('app');

function init() {
  renderPlayerSelection();
}

function renderPlayerSelection() {
  state.playerKey = null;
  state.step = 0;

  app.innerHTML = `
    <section class="card">
      <div class="status-chip">Vyber hráče</div>
      <div class="button-grid">
        <button type="button" onclick="selectPlayer('Stepan')">Štěpán</button>
        <button type="button" onclick="selectPlayer('Martin')">Martin</button>
      </div>
    </section>
  `;
}

function selectPlayer(playerKey) {
  if (!players[playerKey]) {
    return;
  }

  state.playerKey = playerKey;
  state.step = 0;
  players[playerKey].letters = [];
  renderCodeEntry();
}

function renderCodeEntry(message = '') {
  const player = players[state.playerKey];
  app.innerHTML = `
    <section class="card">
      <div class="status-chip">Hráč: ${player.displayName}</div>
      <p>Zadej svůj speciální kód pro pokračování.</p>
      <label for="codeInput">Kód</label>
      <input id="codeInput" type="text" placeholder="Zadej kód" autocomplete="off" />
      <div style="margin-top: 18px; display: flex; gap: 12px; flex-wrap: wrap;">
        <button type="button" onclick="checkPlayerCode()">Potvrdit</button>
        <button type="button" class="secondary" onclick="renderPlayerSelection()">Zpět</button>
      </div>
      ${message ? `<div class="message error">${message}</div>` : ''}
    </section>
  `;

  document.getElementById('codeInput').focus();
}

function checkPlayerCode() {
  const codeInput = document.getElementById('codeInput');
  if (!codeInput) return;

  const entered = codeInput.value.trim();
  const player = players[state.playerKey];

  if (entered === player.code) {
    renderPuzzle();
  } else {
    renderCodeEntry('Špatný kód. Zkus to prosím znovu.');
  }
}

function renderPuzzle(message = '') {
  const player = players[state.playerKey];
  const puzzle = player.puzzles[state.step];

  if (!puzzle) {
    renderFinal();
    return;
  }

  app.innerHTML = `
    <section class="card">
      <div class="status-chip">Hráč: ${player.displayName} • Úloha ${state.step + 1}</div>
      <div class="puzzle-text">${puzzle.prompt}</div>
      <label for="answerInput">Tvoje odpověď</label>
      <input id="answerInput" type="text" placeholder="Napiš číslo nebo kód" autocomplete="off" />
      <div style="margin-top: 18px; display: flex; gap: 12px; flex-wrap: wrap;">
        <button type="button" onclick="checkPuzzleAnswer()">Odeslat</button>
        <button type="button" class="secondary" onclick="renderPlayerSelection()">Zpět na výběr hráče</button>
      </div>
      ${message ? `<div class="message ${message.type}">${message.text}</div>` : ''}
      <div style="margin-top: 18px; color: var(--muted);">
        Získaná písmena: ${player.letters.length > 0 ? player.letters.join(', ') : 'zatím žádná'}
      </div>
    </section>
  `;

  document.getElementById('answerInput').focus();
}

function checkPuzzleAnswer() {
  const answerInput = document.getElementById('answerInput');
  if (!answerInput) return;

  const answer = answerInput.value.trim();
  const player = players[state.playerKey];
  const puzzle = player.puzzles[state.step];

  const isCorrect = answer === puzzle.answer;
  logAttempt(state.playerKey, state.step + 1, answer, isCorrect ? 'correct' : 'incorrect');

  if (isCorrect) {
    player.letters.push(puzzle.letter);
    state.step += 1;

    if (state.step >= player.puzzles.length) {
      renderFinal();
    } else {
      renderPuzzle({
        type: 'success',
        text: `Správně! Tvoje písmeno je: ${puzzle.letter}`,
      });
    }
  } else {
    renderPuzzle({
      type: 'error',
      text: 'Špatná odpověď, zkus to znovu.',
    });
  }
}

function renderFinal() {
  const player = players[state.playerKey];
  const code = player.letters.join('');

  app.innerHTML = `
    <section class="card">
      <div class="status-chip">Hráč: ${player.displayName} • Finále</div>
      <div class="message success">
        <strong>Gratuluju! Získal jsi všechna písmena.</strong><br />
        Pošli mi svůj kód na Instagram.
      </div>
      <div class="card" style="margin-top: 18px; background: rgba(15, 23, 42, 0.95);">
        <p><strong>Tvůj kód je:</strong></p>
        <p style="font-size: 1.6rem; letter-spacing: 0.22em; margin: 0;">${code}</p>
      </div>
      <div style="margin-top: 18px; display: flex; gap: 12px; flex-wrap: wrap;">
        <button type="button" onclick="renderPlayerSelection()">Hrát znovu</button>
      </div>
    </section>
  `;
}

function logAttempt(playerKey, puzzleNumber, answer, result) {
  const entry = {
    timestamp: new Date().toISOString(),
    player: players[playerKey].displayName,
    puzzle: puzzleNumber,
    answer,
    result,
  };

  logs.push(entry);
  console.log('Log:', entry);
}

function showPuzzleLogs() {
  console.log(logs);
}

window.showPuzzleLogs = showPuzzleLogs;
window.logs = logs;
window.selectPlayer = selectPlayer;
window.checkPlayerCode = checkPlayerCode;
window.checkPuzzleAnswer = checkPuzzleAnswer;

init();
