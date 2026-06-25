export type Team = {
  id: string;
  name: string;
  region: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  form: Array<'W' | 'D' | 'L'>;
};

export type Fixture = {
  id: string;
  stage: string;
  date: string;
  home: string;
  away: string;
  venue: string;
};

export const teams: Team[] = [
  { id: 'atlas', name: 'Atlas Agents', region: 'Americas', played: 3, wins: 3, draws: 0, losses: 0, goalsFor: 9, goalsAgainst: 2, form: ['W', 'W', 'W'] },
  { id: 'nexus', name: 'Nexus Neural FC', region: 'Europe', played: 3, wins: 2, draws: 1, losses: 0, goalsFor: 7, goalsAgainst: 3, form: ['W', 'D', 'W'] },
  { id: 'samurai', name: 'Samurai Synths', region: 'Asia', played: 3, wins: 1, draws: 1, losses: 1, goalsFor: 5, goalsAgainst: 4, form: ['L', 'W', 'D'] },
  { id: 'ubuntu', name: 'Ubuntu Oracles', region: 'Africa', played: 3, wins: 1, draws: 0, losses: 2, goalsFor: 4, goalsAgainst: 6, form: ['W', 'L', 'L'] },
  { id: 'aurora', name: 'Aurora Prompts', region: 'Oceania', played: 3, wins: 0, draws: 2, losses: 1, goalsFor: 3, goalsAgainst: 5, form: ['D', 'L', 'D'] },
  { id: 'andes', name: 'Andes Autonomy', region: 'South America', played: 3, wins: 0, draws: 0, losses: 3, goalsFor: 1, goalsAgainst: 9, form: ['L', 'L', 'L'] },
];

export const fixtures: Fixture[] = [
  { id: 'sf-1', stage: 'Semi-final', date: '2026-07-03T19:00:00Z', home: 'Atlas Agents', away: 'Samurai Synths', venue: 'Prompt Arena' },
  { id: 'sf-2', stage: 'Semi-final', date: '2026-07-04T19:00:00Z', home: 'Nexus Neural FC', away: 'Ubuntu Oracles', venue: 'Inference Park' },
  { id: 'final', stage: 'Final', date: '2026-07-10T20:00:00Z', home: 'Winner SF1', away: 'Winner SF2', venue: 'Foundation Model Stadium' },
];

export const sortedTeams = [...teams].sort((a, b) => {
  const points = (team: Team) => team.wins * 3 + team.draws;
  const goalDifference = (team: Team) => team.goalsFor - team.goalsAgainst;
  return points(b) - points(a) || goalDifference(b) - goalDifference(a) || b.goalsFor - a.goalsFor;
});
