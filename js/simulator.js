// ============ WORLD CUP 2026 — ALL 48 TEAMS ============

const TEAMS = {
  // GROUP A
  "Mexico": "🇲🇽", "South Africa": "🇿🇦", "Poland": "🇵🇱", "South Korea": "🇰🇷",
  // GROUP B
  "Spain": "🇪🇸", "Croatia": "🇭🇷", "Morocco": "🇲🇦", "Senegal": "🇸🇳",  
  // GROUP C
  "USA": "🇺🇸", "Uruguay": "🇺🇾", "Panama": "🇵🇦", "Bolivia": "🇧🇴",
  // GROUP D
  "France": "🇫🇷", "Argentina": "🇦🇷", "Australia": "🇦🇺", "Saudi Arabia": "🇸🇦",
  // GROUP E
  "Germany": "🇩🇪", "Japan": "🇯🇵", "Costa Rica": "🇨🇷", "Belgium": "🇧🇪",
  // GROUP F
  "Brazil": "🇧🇷", "Colombia": "🇨🇴", "Ecuador": "🇪🇨", "Cameroon": "🇨🇲",
  // GROUP G
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Netherlands": "🇳🇱", "Serbia": "🇷🇸", "Iran": "🇮🇷",
  // GROUP H
  "Portugal": "🇵🇹", "Turkey": "🇹🇷", "Czech Republic": "🇨🇿", "Ivory Coast": "🇨🇮",
  // GROUP I
  "Italy": "🇮🇹", "Switzerland": "🇨🇭", "Chile": "🇨🇱", "Nigeria": "🇳🇬",
  // GROUP J
  "Canada": "🇨🇦", "Denmark": "🇩🇰", "Peru": "🇵🇪", "Honduras": "🇭🇳",
  // GROUP K
  "Austria": "🇦🇹", "Ukraine": "🇺🇦", "Paraguay": "🇵🇾", "Iraq": "🇮🇶",
  // GROUP L
  "New Zealand": "🇳🇿", "Venezuela": "🇻🇪", "Algeria": "🇩🇿", "Norway": "🇳🇴"
};

// Round of 32 matchups (Group winners vs runners-up)
const R32_MATCHUPS = [
  ["Mexico", "South Korea"],
  ["Spain", "Senegal"],
  ["USA", "Uruguay"],
  ["France", "Saudi Arabia"],
  ["Germany", "Belgium"],
  ["Brazil", "Cameroon"],
  ["England", "Iran"],
  ["Portugal", "Ivory Coast"],
  ["Italy", "Nigeria"],
  ["Canada", "Peru"],
  ["Austria", "Iraq"],
  ["New Zealand", "Norway"],
  ["South Africa", "Poland"],
  ["Croatia", "Morocco"],
  ["Panama", "Bolivia"],
  ["Argentina", "Australia"],
];

// State
let rounds = [];
// rounds[0] = R32 (16 matches)
// rounds[1] = R16 (8 matches)
// rounds[2] = QF (4 matches)
// rounds[3] = SF (2 matches)
// rounds[4] = Final (1 match)

const ROUND_NAMES = ["Round of 32", "Round of 16", "Quarter Finals", "Semi Finals", "Final"];
const STEP_IDS = ["step-r32", "step-r16", "step-qf", "step-sf", "step-f"];

function initRounds() {
  rounds = [
    R32_MATCHUPS.map(([t1, t2]) => ({ t1, t2, winner: null })),
    Array(8).fill(null).map(() => ({ t1: null, t2: null, winner: null })),
    Array(4).fill(null).map(() => ({ t1: null, t2: null, winner: null })),
    Array(2).fill(null).map(() => ({ t1: null, t2: null, winner: null })),
    [{ t1: null, t2: null, winner: null }]
  ];
}

function renderBracket() {
  const bracket = document.getElementById('bracket');
  bracket.innerHTML = '';

  rounds.forEach((round, rIdx) => {
    const col = document.createElement('div');
    col.className = 'round-col';

    const title = document.createElement('div');
    title.className = 'round-title';
    title.textContent = ROUND_NAMES[rIdx];
    col.appendChild(title);

    // Calculate spacing for alignment
    const spacingMultiplier = Math.pow(2, rIdx);

    round.forEach((match, mIdx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'match-wrapper';
      // Add vertical spacing to align with previous round
      if (rIdx > 0) {
        const baseHeight = 96; // approximate match height
        const gap = 16;
        const totalUnit = (baseHeight + gap * 2) * spacingMultiplier;
        wrapper.style.height = totalUnit + 'px';
        wrapper.style.justifyContent = 'center';
      }

      const matchEl = document.createElement('div');
      matchEl.className = 'match';

      const team1El = buildTeamEl(match.t1, match.winner, rIdx, mIdx, 't1');
      const vsEl = document.createElement('div');
      vsEl.className = 'match-vs';
      vsEl.textContent = 'VS';
      const team2El = buildTeamEl(match.t2, match.winner, rIdx, mIdx, 't2');

      matchEl.appendChild(team1El);
      matchEl.appendChild(vsEl);
      matchEl.appendChild(team2El);
      wrapper.appendChild(matchEl);
      col.appendChild(wrapper);
    });

    bracket.appendChild(col);
  });

  updateProgress();
  checkChampion();
}

function buildTeamEl(teamName, winner, rIdx, mIdx, slot) {
  const el = document.createElement('div');
  el.className = 'match-team';

  if (!teamName) {
    el.classList.add('tbd');
    el.innerHTML = `<span class="team-flag">❓</span><span class="team-name">TBD</span>`;
    return el;
  }

  const flag = TEAMS[teamName] || '🏳️';
  el.innerHTML = `<span class="team-flag">${flag}</span><span class="team-name">${teamName}</span>`;

  if (winner === teamName) el.classList.add('winner');
  else if (winner && winner !== teamName) el.classList.add('loser');

  if (teamName) {
    el.addEventListener('click', () => pickWinner(rIdx, mIdx, teamName));
  }

  return el;
}

function pickWinner(rIdx, mIdx, teamName) {
  const match = rounds[rIdx][mIdx];
  if (!match.t1 || !match.t2) return;

  // Set winner
  match.winner = teamName;

  // Advance to next round
  if (rIdx < rounds.length - 1) {
    const nextMatchIdx = Math.floor(mIdx / 2);
    const nextSlot = mIdx % 2 === 0 ? 't1' : 't2';
    const nextMatch = rounds[rIdx + 1][nextMatchIdx];

    // Clear downstream if changing winner
    if (nextMatch[nextSlot] !== teamName) {
      clearDownstream(rIdx + 1, nextMatchIdx);
    }

    nextMatch[nextSlot] = teamName;
  }

  renderBracket();
}

function clearDownstream(rIdx, mIdx) {
  if (rIdx >= rounds.length) return;
  const match = rounds[rIdx][mIdx];
  const oldWinner = match.winner;
  match.winner = null;

  if (rIdx < rounds.length - 1 && oldWinner) {
    const nextMatchIdx = Math.floor(mIdx / 2);
    const nextSlot = mIdx % 2 === 0 ? 't1' : 't2';
    const nextMatch = rounds[rIdx + 1][nextMatchIdx];
    if (nextMatch[nextSlot] === oldWinner) {
      nextMatch[nextSlot] = null;
      clearDownstream(rIdx + 1, nextMatchIdx);
    }
  }
}

function updateProgress() {
  STEP_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('active', 'done');

    const roundComplete = rounds[i].every(m => m.winner !== null);
    const prevComplete = i === 0 || rounds[i - 1].every(m => m.winner !== null);

    if (roundComplete) el.classList.add('done');
    else if (prevComplete) el.classList.add('active');
  });
}

function checkChampion() {
  const final = rounds[4][0];
  const display = document.getElementById('championDisplay');
  if (final.winner) {
    document.getElementById('championName').textContent = final.winner;
    document.getElementById('championFlag').textContent = TEAMS[final.winner] || '🏳️';
    display.style.display = 'block';
    display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    display.style.display = 'none';
  }
}

function resetBracket() {
  initRounds();
  renderBracket();
}

function randomSimulate() {
  initRounds();

  for (let rIdx = 0; rIdx < rounds.length; rIdx++) {
    rounds[rIdx].forEach((match, mIdx) => {
      if (match.t1 && match.t2) {
        const winner = Math.random() < 0.5 ? match.t1 : match.t2;
        match.winner = winner;

        if (rIdx < rounds.length - 1) {
          const nextMatchIdx = Math.floor(mIdx / 2);
          const nextSlot = mIdx % 2 === 0 ? 't1' : 't2';
          rounds[rIdx + 1][nextMatchIdx][nextSlot] = winner;
        }
      }
    });
  }

  renderBracket();
}

function shareResult() {
  const champion = rounds[4][0].winner;
  const flag = TEAMS[champion] || '';
  const text = `I just simulated the FIFA World Cup 2026 and my champion is ${flag} ${champion}! Try it yourself at WorldCupGolazo 🏆⚽`;

  if (navigator.share) {
    navigator.share({ title: 'My World Cup Prediction', text, url: window.location.href });
  } else {
    navigator.clipboard.writeText(text + '\n' + window.location.href)
      .then(() => alert('Copied to clipboard! Share your prediction.'));
  }
}

// ============ INIT ============
document.getElementById('resetBtn').addEventListener('click', resetBracket);
document.getElementById('randomBtn').addEventListener('click', randomSimulate);

initRounds();
renderBracket();
