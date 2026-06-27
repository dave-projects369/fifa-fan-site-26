const completedMatches = [
  // June 11
  { team1: "Mexico", team2: "South Africa", goals1: 2, goals2: 0, group: "A" },
  { team1: "South Korea", team2: "Czechia", goals1: 2, goals2: 1, group: "A" },
  // June 12
  { team1: "Canada", team2: "Bosnia and Herzegovina", goals1: 1, goals2: 1, group: "B" },
  { team1: "United States", team2: "Paraguay", goals1: 4, goals2: 1, group: "D" },
  // June 13
  { team1: "Qatar", team2: "Switzerland", goals1: 1, goals2: 1, group: "B" },
  { team1: "Brazil", team2: "Morocco", goals1: 1, goals2: 1, group: "C" },
  { team1: "Scotland", team2: "Haiti", goals1: 1, goals2: 0, group: "C" },
  // June 14
  { team1: "Australia", team2: "Turkey", goals1: 2, goals2: 0, group: "D" },
  { team1: "Germany", team2: "Curacao", goals1: 7, goals2: 1, group: "E" },
  { team1: "Netherlands", team2: "Japan", goals1: 2, goals2: 2, group: "F" },
  { team1: "Ivory Coast", team2: "Ecuador", goals1: 1, goals2: 0, group: "E" },
  { team1: "Sweden", team2: "Tunisia", goals1: 5, goals2: 1, group: "F" },
  // June 15
  { team1: "Spain", team2: "Cape Verde", goals1: 0, goals2: 0, group: "H" },
  { team1: "Belgium", team2: "Egypt", goals1: 1, goals2: 1, group: "G" },
  { team1: "Saudi Arabia", team2: "Uruguay", goals1: 1, goals2: 1, group: "H" },
  { team1: "Iran", team2: "New Zealand", goals1: 2, goals2: 2, group: "G" },
  // June 16
  { team1: "France", team2: "Senegal", goals1: 3, goals2: 1, group: "I" },
  { team1: "Norway", team2: "Iraq", goals1: 4, goals2: 1, group: "I" },
  { team1: "Argentina", team2: "Algeria", goals1: 3, goals2: 0, group: "J" },
  // June 17
  { team1: "Austria", team2: "Jordan", goals1: 3, goals2: 1, group: "J" },
  { team1: "Portugal", team2: "DR Congo", goals1: 1, goals2: 1, group: "K" },
  { team1: "England", team2: "Croatia", goals1: 4, goals2: 2, group: "L" },
  { team1: "Ghana", team2: "Panama", goals1: 1, goals2: 0, group: "L" },
  { team1: "Colombia", team2: "Uzbekistan", goals1: 3, goals2: 1, group: "K" },
  // June 18
  { team1: "Czechia", team2: "South Africa", goals1: 1, goals2: 1, group: "A" },
  { team1: "Switzerland", team2: "Bosnia and Herzegovina", goals1: 4, goals2: 1, group: "B" },
  { team1: "Canada", team2: "Qatar", goals1: 6, goals2: 0, group: "B" },
  { team1: "Mexico", team2: "South Korea", goals1: 1, goals2: 0, group: "A" },
  // June 19
  { team1: "United States", team2: "Australia", goals1: 2, goals2: 0, group: "D" },
  { team1: "Morocco", team2: "Scotland", goals1: 1, goals2: 0, group: "C" },
  { team1: "Brazil", team2: "Haiti", goals1: 3, goals2: 0, group: "C" },
  { team1: "Paraguay", team2: "Turkey", goals1: 1, goals2: 0, group: "D" },
  // June 20
  { team1: "Netherlands", team2: "Sweden", goals1: 5, goals2: 1, group: "F" },
  { team1: "Germany", team2: "Ivory Coast", goals1: 2, goals2: 1, group: "E" },
  { team1: "Ecuador", team2: "Curacao", goals1: 0, goals2: 0, group: "E" },
  // June 21
  { team1: "Japan", team2: "Tunisia", goals1: 4, goals2: 0, group: "F" },
  { team1: "Spain", team2: "Saudi Arabia", goals1: 4, goals2: 0, group: "H" },
  { team1: "Belgium", team2: "Iran", goals1: 0, goals2: 0, group: "G" },
  { team1: "Uruguay", team2: "Cape Verde", goals1: 2, goals2: 2, group: "H" },
  { team1: "Egypt", team2: "New Zealand", goals1: 3, goals2: 1, group: "G" },
  // June 22
  { team1: "Argentina", team2: "Austria", goals1: 2, goals2: 0, group: "J" },
  { team1: "France", team2: "Iraq", goals1: 3, goals2: 0, group: "I" },
  { team1: "Norway", team2: "Senegal", goals1: 3, goals2: 2, group: "I" },
  { team1: "Algeria", team2: "Jordan", goals1: 2, goals2: 1, group: "J" },
  // June 23
  { team1: "Portugal", team2: "Uzbekistan", goals1: 5, goals2: 0, group: "K" },
  { team1: "England", team2: "Ghana", goals1: 0, goals2: 0, group: "L" },
  { team1: "Croatia", team2: "Panama", goals1: 1, goals2: 0, group: "L" },
  { team1: "Colombia", team2: "DR Congo", goals1: 1, goals2: 0, group: "K" },
  // June 24
  { team1: "Switzerland", team2: "Canada", goals1: 2, goals2: 1, group: "B" },
  { team1: "Bosnia and Herzegovina", team2: "Qatar", goals1: 3, goals2: 1, group: "B" },
  { team1: "Brazil", team2: "Scotland", goals1: 3, goals2: 0, group: "C" },
  { team1: "Morocco", team2: "Haiti", goals1: 4, goals2: 2, group: "C" },
  { team1: "Mexico", team2: "Czechia", goals1: 3, goals2: 0, group: "A" },
  { team1: "South Africa", team2: "South Korea", goals1: 1, goals2: 0, group: "A" },
  // June 25
  { team1: "Curacao", team2: "Ivory Coast", goals1: 0, goals2: 2, group: "E" },
  { team1: "Ecuador", team2: "Germany", goals1: 2, goals2: 1, group: "E" },
  { team1: "Japan", team2: "Sweden", goals1: 1, goals2: 1, group: "F" },
  { team1: "Tunisia", team2: "Netherlands", goals1: 1, goals2: 3, group: "F" },
  { team1: "Turkey", team2: "United States", goals1: 3, goals2: 2, group: "D" },
  { team1: "Paraguay", team2: "Australia", goals1: 0, goals2: 0, group: "D" },
  // June 26
  { team1: "Norway", team2: "France", goals1: 1, goals2: 4, group: "I" },
  { team1: "Senegal", team2: "Iraq", goals1: 5, goals2: 0, group: "I" },
  { team1: "Cape Verde", team2: "Saudi Arabia", goals1: 0, goals2: 0, group: "H" },
  { team1: "Uruguay", team2: "Spain", goals1: 0, goals2: 1, group: "H" },
  { team1: "New Zealand", team2: "Belgium", goals1: 1, goals2: 5, group: "G" },
  { team1: "Egypt", team2: "Iran", goals1: 1, goals2: 1, group: "G" },
];
