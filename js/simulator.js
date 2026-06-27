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
// rounds[5] = 3rd Place (1 match)

const ROUND_NAMES = ["Round of 32", "Round of 16", "Quarter Finals", "Semi Finals", "Final", "3rd Place"];
const STEP_IDS = ["step-r32", "step-r16", "step-qf", "step-sf", "step-f", "step-bronze"];

function initRounds() {
  rounds = [
    knockouts.r32.map(m => ({ t1: m.team1, t2: m.team2, winner: null, id: m.id, date: m.date, time: m.time })),
    [
      { t1: null, t2: null, winner: null, id: 89, date: "July 4", time: "5:00 PM ET", from: [74, 77] },
      { t1: null, t2: null, winner: null, id: 90, date: "July 4", time: "1:00 PM ET", from: [73, 75] },
      { t1: null, t2: null, winner: null, id: 93, date: "July 6", time: "3:00 PM ET", from: [83, 84] },
      { t1: null, t2: null, winner: null, id: 94, date: "July 6", time: "8:00 PM ET", from: [81, 82] },
      { t1: null, t2: null, winner: null, id: 91, date: "July 5", time: "4:00 PM ET", from: [76, 78] },
      { t1: null, t2: null, winner: null, id: 92, date: "July 5", time: "8:00 PM ET", from: [79, 80] },
      { t1: null, t2: null, winner: null, id: 95, date: "July 7", time: "12:00 PM ET", from: [86, 88] },
      { t1: null, t2: null, winner: null, id: 96, date: "July 7", time: "4:00 PM ET", from: [85, 87] },
    ],
    [
      { t1: null, t2: null, winner: null, id: 97, date: "July 9", time: "4:00 PM ET", from: [89, 90] },
      { t1: null, t2: null, winner: null, id: 98, date: "July 10", time: "3:00 PM ET", from: [93, 94] },
      { t1: null, t2: null, winner: null, id: 99, date: "July 11", time: "5:00 PM ET", from: [91, 92] },
      { t1: null, t2: null, winner: null, id: 100, date: "July 11", time: "9:00 PM ET", from: [95, 96] },
    ],
    [
      { t1: null, t2: null, winner: null, id: 101, date: "July 14", time: "3:00 PM ET", from: [97, 98] },
      { t1: null, t2: null, winner: null, id: 102, date: "July 15", time: "3:00 PM ET", from: [99, 100] },
    ],
    [
      { t1: null, t2: null, winner: null, id: 104, date: "July 19", time: "3:00 PM ET", from: [101, 102] },
    ],
    [
      { t1: null, t2: null, winner: null, id: 103, date: "July 18", time: "5:00 PM ET", from: [101, 102], isBronze: true },
    ],
  ];
}

function renderBracket() {
  const bracket = document.getElementById('bracket');
  if (!bracket) return;
  bracket.innerHTML = '';

  // Calculate total height for each round based on number of matches
  const roundHeights = rounds.map(round => {
    if (round.length === 0) return 0;
    // Base height per match: larger for later rounds
    const baseHeight = round.length <= 2 ? 140 : round.length <= 4 ? 100 : round.length <= 8 ? 80 : 65;
    const gap = round.length <= 2 ? 20 : round.length <= 4 ? 14 : round.length <= 8 ? 10 : 6;
    return (baseHeight + gap) * round.length - gap;
  });

  // Find max height to align all rounds
  const maxHeight = Math.max(...roundHeights);

  rounds.forEach((round, rIdx) => {
    const col = document.createElement('div');
    col.className = 'round-col';
    
    // Special class for final rounds
    if (rIdx >= 4) {
      col.classList.add('final-col');
    }

    const title = document.createElement('div');
    title.className = 'round-title';
    title.textContent = ROUND_NAMES[rIdx];
    col.appendChild(title);

    const matchHeight = rIdx === 0 ? 65 : rIdx === 1 ? 80 : rIdx === 2 ? 100 : rIdx === 3 ? 120 : 140;
    const gap = rIdx === 0 ? 6 : rIdx === 1 ? 10 : rIdx === 2 ? 14 : rIdx === 3 ? 20 : 24;

    round.forEach((match, mIdx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'match-wrapper';
      
      // Calculate spacing to align all columns
      const totalMatchesInRound = round.length;
      const totalHeight = maxHeight;
      const matchUnitHeight = (totalHeight - (totalMatchesInRound - 1) * gap) / totalMatchesInRound;
      
      wrapper.style.height = matchUnitHeight + 'px';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.padding = (gap / 2) + 'px 0';

      const matchEl = document.createElement('div');
      matchEl.className = 'match';
      matchEl.style.width = '100%';
      matchEl.style.height = (matchUnitHeight - gap) + 'px';
      matchEl.style.display = 'flex';
      matchEl.style.flexDirection = 'column';
      matchEl.style.justifyContent = 'center';

      const headerEl = document.createElement('div');
      headerEl.className = 'match-header';
      let matchLabel;
      if (match.id === 101) matchLabel = 'SF 1';
      else if (match.id === 102) matchLabel = 'SF 2';
      else if (match.id === 103) matchLabel = '3rd Place';
      else if (match.id === 104) matchLabel = '🏆 FINAL';
      else matchLabel = `M${match.id}`;
      
      headerEl.innerHTML = `<span class="match-id">${matchLabel}</span><span class="match-date">${match.date || ''}${match.time && match.time !== 'TBD' ? ' · ' + match.time : ''}</span>`;
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

  // Don't allow picking if match is TBD
  if (!match.t1 || !match.t2) return;

  match.winner = teamName;

  // Update next round
  if (rIdx < 3) { // R32 -> R16, R16 -> QF, QF -> SF
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

  // SF losers go to 3rd Place (index 5)
  if (rIdx === 3) {
    const bronzeMatch = rounds[5][0];
    const loser = match.t1 === teamName ? match.t2 : match.t1;
    // Determine which slot based on which semi-final
    if (mIdx === 0) {
      bronzeMatch.t1 = loser;
    } else {
      bronzeMatch.t2 = loser;
    }
  }

  // Final winner (index 4) is champion
  if (rIdx === 4) {
    // Champion is set, nothing else to do
  }

  renderBracket();
}

function clearDownstream(rIdx, mIdx) {
  if (rIdx >= rounds.length) return;
  const match = rounds[rIdx][mIdx];
  const oldWinner = match.winner;
  match.winner = null;

  if (rIdx < 4 && oldWinner) { // Only clear up to SF
    const nextMatchIdx = Math.floor(mIdx / 2);
    const nextSlot = mIdx % 2 === 0 ? 't1' : 't2';
    const nextMatch = rounds[rIdx + 1][nextMatchIdx];
    if (nextMatch && nextMatch[nextSlot] === oldWinner) {
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

    const roundComplete = rounds[i] ? rounds[i].every(m => m.winner !== null) : false;
    const prevComplete = i === 0 || (rounds[i - 1] && rounds[i - 1].every(m => m.winner !== null));

    if (roundComplete) el.classList.add('done');
    else if (prevComplete) el.classList.add('active');
  });
}

function checkChampion() {
  const final = rounds[4][0];
  const display = document.getElementById('championDisplay');
  if (final && final.winner) {
    document.getElementById('championName').textContent = final.winner;
    document.getElementById('championFlag').textContent = TEAMS[final.winner] || '🏳️';
    if (display) {
      display.style.display = 'block';
      display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } else {
    if (display) {
      display.style.display = 'none';
    }
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

        if (rIdx < 3) { // R32 -> SF
          const currentId = match.id;
          const nextRound = rounds[rIdx + 1];
          const nextMatchIdx = nextRound.findIndex(m => m.from && m.from.includes(currentId));
          if (nextMatchIdx !== -1) {
            const nextMatch = nextRound[nextMatchIdx];
            const slot = nextMatch.from[0] === currentId ? 't1' : 't2';
            nextMatch[slot] = winner;
          }
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
const resetBtn = document.getElementById('resetBtn');
const randomBtn = document.getElementById('randomBtn');

if (resetBtn) resetBtn.addEventListener('click', resetBracket);
if (randomBtn) randomBtn.addEventListener('click', randomSimulate);

// Only render if elements exist
if (document.getElementById('standingsContainer')) {
  renderStandings();
}
if (document.getElementById('bracket')) {
  initRounds();
  renderBracket();
}
