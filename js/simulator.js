const TEAMS = {
  // Group A
  "Mexico": "🇲🇽", "South Korea": "🇰🇷", "South Africa": "🇿🇦", "Czechia": "🇨🇿",
  // Group B
  "Switzerland": "🇨🇭", "Canada": "🇨🇦", "Bosnia and Herzegovina": "🇧🇦", "Qatar": "🇶🇦",
  // Group C
  "Brazil": "🇧🇷", "Morocco": "🇲🇦", "Haiti": "🇭🇹", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  // Group D
  "United States": "🇺🇸", "Paraguay": "🇵🇾", "Australia": "🇦🇺", "Turkey": "🇹🇷",
  // Group E
  "Germany": "🇩🇪", "Curacao": "🇨🇼", "Ivory Coast": "🇨🇮", "Ecuador": "🇪🇨",
  // Group F
  "Netherlands": "🇳🇱", "Japan": "🇯🇵", "Sweden": "🇸🇪", "Tunisia": "🇹🇳",
  // Group G
  "Belgium": "🇧🇪", "Egypt": "🇪🇬", "Iran": "🇮🇷", "New Zealand": "🇳🇿",
  // Group H
  "Spain": "🇪🇸", "Cape Verde": "🇨🇻", "Saudi Arabia": "🇸🇦", "Uruguay": "🇺🇾",
  // Group I
  "France": "🇫🇷", "Senegal": "🇸🇳", "Iraq": "🇮🇶", "Norway": "🇳🇴",
  // Group J
  "Argentina": "🇦🇷", "Algeria": "🇩🇿", "Austria": "🇦🇹", "Jordan": "🇯🇴",
  // Group K
  "Portugal": "🇵🇹", "DR Congo": "🇨🇩", "Uzbekistan": "🇺🇿", "Colombia": "🇨🇴",
  // Group L
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croatia": "🇭🇷", "Ghana": "🇬🇭", "Panama": "🇵🇦"
};

function calculateStandings() {
  const standings = {};
  Object.keys(groups).forEach(g => {
    standings[g] = {};
    groups[g].teams.forEach(t => {
      standings[g][t] = { pts: 0, gf: 0, ga: 0, gd: 0, played: 0 };
    });
  });

  completedMatches.forEach(m => {
    const s = standings[m.group];
    if (m.goals1 > m.goals2) {
      s[m.team1].pts += 3;
    } else if (m.goals1 < m.goals2) {
      s[m.team2].pts += 3;
    } else {
      s[m.team1].pts += 1;
      s[m.team2].pts += 1;
    }
    s[m.team1].gf += m.goals1; s[m.team1].ga += m.goals2;
    s[m.team2].gf += m.goals2; s[m.team2].ga += m.goals1;
    s[m.team1].gd = s[m.team1].gf - s[m.team1].ga;
    s[m.team2].gd = s[m.team2].gf - s[m.team2].ga;
    s[m.team1].played += 1;
    s[m.team2].played += 1;
  });

  const sorted = {};
  Object.keys(standings).forEach(g => {
    sorted[g] = Object.entries(standings[g])
      .map(([team, stats]) => ({ team, ...stats }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  });

  return sorted;
}

function renderStandings() {
  const container = document.getElementById('standingsContainer');
  if (!container) return;
  container.innerHTML = '';

  const standings = calculateStandings();

  Object.keys(standings).forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group-table';
    groupDiv.innerHTML = `<h4>Group ${group}</h4>`;

    const table = document.createElement('table');
    table.innerHTML = `
  <tr><th>Team</th><th>MP</th><th>Pts</th><th>GD</th></tr>
  ${standings[group].map(t => `
    <tr>
      <td>${TEAMS[t.team] || ''} ${t.team}</td>
      <td>${t.played}</td>
      <td>${t.pts}</td>
      <td>${t.gd > 0 ? '+' : ''}${t.gd}</td>
    </tr>
  `).join('')}
`;
    groupDiv.appendChild(table);
    container.appendChild(groupDiv);
  });
}

let thirdPlacePicks = {};
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
    // R32 - load directly from knockouts.js
    knockouts.r32.map(m => ({ t1: m.team1, t2: m.team2, winner: null, id: m.id, date: m.date })),
    // R16
    knockouts.r16.map(m => ({ t1: null, t2: null, winner: null, id: m.id, date: m.date, from: m.from })),
    // QF
    knockouts.qf.map(m => ({ t1: null, t2: null, winner: null, id: m.id, date: m.date, from: m.from })),
    // SF
    knockouts.sf.map(m => ({ t1: null, t2: null, winner: null, id: m.id, date: m.date, from: m.from })),
    // Final
    knockouts.final.map(m => ({ t1: null, t2: null, winner: null, id: m.id, date: m.date, from: m.from })),
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
        const baseHeight = 110;
        const gap = 12;
        const totalUnit = (baseHeight + gap * 2) * Math.pow(1.85, rIdx);
        wrapper.style.height = totalUnit + 'px';
        wrapper.style.justifyContent = 'center';
      }

      const matchEl = document.createElement('div');
      matchEl.className = 'match';

      const headerEl = document.createElement('div');
      headerEl.className = 'match-header';
      headerEl.innerHTML = `<span class="match-id">Match ${match.id}</span><span class="match-date">${match.date || ''}${match.time && match.time !== 'TBD' ? ' · ' + match.time : ''}</span>`;
      matchEl.appendChild(headerEl);

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

  match.winner = teamName;

  if (rIdx < rounds.length - 1) {
    const currentId = match.id;
    const nextRound = rounds[rIdx + 1];
    const nextMatchIdx = nextRound.findIndex(m => m.from && m.from.includes(currentId));

    if (nextMatchIdx !== -1) {
      const nextMatch = nextRound[nextMatchIdx];
      const slot = nextMatch.from[0] === currentId ? 't1' : 't2';

      if (nextMatch[slot] !== teamName) {
        clearDownstream(rIdx + 1, nextMatchIdx);
      }
      nextMatch[slot] = teamName;
    }
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


renderStandings();
initRounds();
renderBracket();
