import { SimulationResult } from '../types';
import { formatMoney, formatPercent } from '../utils/calculator';
import { statuts } from '../data/statuts';
import { BarChart } from './BarChart';

interface ResultsProps {
  results: SimulationResult[];
  onReset: () => void;
  onViewDetail: (statut: string) => void;
}

export function Results({ results, onReset, onViewDetail }: ResultsProps) {
  if (results.length === 0) return null;

  const best = results[0];

  return (
    <div className="results">
      <div className="results-header">
        <h2>Résultats de la simulation</h2>
        <button className="btn btn-secondary" onClick={onReset}>
          ↻ Nouvelle simulation
        </button>
      </div>

      {/* Recommendation banner */}
      <div className="recommendation-banner">
        <div className="recommendation-icon">🏆</div>
        <div className="recommendation-text">
          <h3>Statut recommandé : {best.statutNom}</h3>
          <p>
            Revenu net estimé : <strong>{formatMoney(best.revenuNet)}/an</strong> soit{' '}
            <strong>{formatMoney(best.revenuNetMensuel)}/mois</strong>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => onViewDetail(best.statut)}>
          Voir le détail
        </button>
      </div>

      {/* Chart comparison */}
      <div className="chart-section">
        <h3>Comparaison des revenus nets annuels</h3>
        <BarChart results={results} />
      </div>

      {/* Results cards */}
      <div className="results-grid">
        {results.map((result, index) => {
          const info = statuts.find((s) => s.id === result.statut);
          return (
            <div
              key={result.statut}
              className={`result-card ${result.recommande ? 'recommended' : ''}`}
              style={{ '--accent': info?.color } as React.CSSProperties}
            >
              {result.recommande && <div className="badge-recommended">Recommandé</div>}
              <div className="result-rank">#{index + 1}</div>

              <h3 style={{ color: info?.color }}>{result.statutNom}</h3>
              <p className="result-regime">{info?.regimeSocial} · {info?.regimeFiscal}</p>

              <div className="result-main-figure">
                <span className="result-net">{formatMoney(result.revenuNetMensuel)}</span>
                <span className="result-unit">/mois net</span>
              </div>

              <div className="result-details">
                <div className="result-row">
                  <span>CA annuel</span>
                  <span>{formatMoney(result.revenuBrut)}</span>
                </div>
                <div className="result-row">
                  <span>Cotisations sociales</span>
                  <span className="negative">-{formatMoney(result.cotisationsSociales)}</span>
                </div>
                <div className="result-row">
                  <span>Taux cotisations</span>
                  <span>{formatPercent(result.tauxCotisations)}</span>
                </div>
                <div className="result-row">
                  <span>Impôt sur le revenu</span>
                  <span className="negative">-{formatMoney(result.impotRevenu)}</span>
                </div>
                {result.impotSociete > 0 && (
                  <div className="result-row">
                    <span>Impôt sur les sociétés</span>
                    <span className="negative">-{formatMoney(result.impotSociete)}</span>
                  </div>
                )}
                <div className="result-row total">
                  <span>Revenu net annuel</span>
                  <span className="positive">{formatMoney(result.revenuNet)}</span>
                </div>
              </div>

              <div className="protection-scores">
                <div className="score-item">
                  <span className="score-label">Retraite</span>
                  <div className="score-dots">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`dot ${i <= result.protectionRetraite ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="score-item">
                  <span className="score-label">Santé</span>
                  <div className="score-dots">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`dot ${i <= result.protectionMaladie ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button className="btn btn-outline" onClick={() => onViewDetail(result.statut)}>
                Détail complet →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
