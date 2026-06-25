import { lazy, Suspense, useMemo, useState } from 'react';
import { fixtures, sortedTeams } from './data';
import './styles.css';

const InsightsPanel = lazy(() => import('./InsightsPanel'));

export default function App() {
  const [query, setQuery] = useState('Which team has the strongest current form?');
  const topTeam = sortedTeams[0];
  const summary = useMemo(() => `${topTeam.name} lead with ${topTeam.wins * 3 + topTeam.draws} points and a +${topTeam.goalsFor - topTeam.goalsAgainst} goal difference.`, [topTeam]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="hero">
        <nav className="nav" aria-label="Primary navigation">
          <span className="brand" aria-label="Just AI World Cup home">⚽ Just AI World Cup</span>
          <div className="nav-links">
            <a href="#standings">Standings</a>
            <a href="#fixtures">Fixtures</a>
            <a href="#insights">AI Insights</a>
          </div>
        </nav>
        <section className="hero-grid">
          <div>
            <p className="eyebrow">Production tournament dashboard</p>
            <h1>Track the AI World Cup with clarity, speed, and secure AI insights.</h1>
            <p className="lede">A responsive scoreboard for standings, fixtures, tournament state, and optional server-side OpenAI analysis.</p>
            <a className="button" href="#standings">View standings</a>
          </div>
          <aside className="stat-card" aria-label="Tournament leader summary">
            <span className="stat-label">Current leader</span>
            <strong>{topTeam.name}</strong>
            <p>{summary}</p>
          </aside>
        </section>
      </header>

      <main id="main" className="content">
        <section id="standings" className="panel" aria-labelledby="standings-title">
          <div className="section-heading">
            <p className="eyebrow">Live board</p>
            <h2 id="standings-title">Group standings</h2>
          </div>
          <div className="table-wrap" role="region" aria-label="Scrollable standings table" tabIndex={0}>
            <table>
              <thead>
                <tr><th scope="col">Team</th><th scope="col">Region</th><th scope="col">P</th><th scope="col">W</th><th scope="col">D</th><th scope="col">L</th><th scope="col">GD</th><th scope="col">Pts</th><th scope="col">Form</th></tr>
              </thead>
              <tbody>
                {sortedTeams.map((team) => (
                  <tr key={team.id}>
                    <th scope="row">{team.name}</th><td>{team.region}</td><td>{team.played}</td><td>{team.wins}</td><td>{team.draws}</td><td>{team.losses}</td><td>{team.goalsFor - team.goalsAgainst}</td><td>{team.wins * 3 + team.draws}</td>
                    <td><span className="form" aria-label={`${team.name} form: ${team.form.join(', ')}`}>{team.form.join(' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="fixtures" className="panel" aria-labelledby="fixtures-title">
          <div className="section-heading"><p className="eyebrow">Next up</p><h2 id="fixtures-title">Knockout fixtures</h2></div>
          <div className="cards">
            {fixtures.map((fixture) => (
              <article className="fixture-card" key={fixture.id}>
                <p className="eyebrow">{fixture.stage}</p>
                <h3>{fixture.home} <span aria-hidden="true">vs</span><span className="sr-only"> versus </span> {fixture.away}</h3>
                <p>{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(fixture.date))}</p>
                <p>{fixture.venue}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="insights" className="panel" aria-labelledby="insights-title">
          <div className="section-heading"><p className="eyebrow">Secure server route</p><h2 id="insights-title">AI match insight</h2></div>
          <label htmlFor="insight-query">Ask a tournament question</label>
          <textarea id="insight-query" value={query} onChange={(event) => setQuery(event.target.value)} rows={3} />
          <Suspense fallback={<p role="status">Loading insight tools…</p>}>
            <InsightsPanel query={query} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
