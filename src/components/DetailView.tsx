import { SimulationResult } from '../types';
import { statuts } from '../data/statuts';
import { formatMoney, formatPercent } from '../utils/calculator';

interface DetailViewProps {
  result: SimulationResult;
  onBack: () => void;
}

export function DetailView({ result, onBack }: DetailViewProps) {
  const info = statuts.find((s) => s.id === result.statut)!;
  const total = result.cotisationsSociales;

  const detailItems = [
    { label: 'Maladie-Maternité', value: result.details.maladie, color: '#ef4444' },
    { label: 'Retraite de base', value: result.details.retraiteBase, color: '#f59e0b' },
    { label: 'Retraite complémentaire', value: result.details.retraiteComplementaire, color: '#f97316' },
    { label: 'Invalidité-Décès', value: result.details.invaliditeDeces, color: '#8b5cf6' },
    { label: 'Allocations familiales', value: result.details.allocationsFamiliales, color: '#3b82f6' },
    { label: 'CSG', value: result.details.csg, color: '#6366f1' },
    { label: 'CRDS', value: result.details.crds, color: '#a855f7' },
    { label: 'Formation professionnelle', value: result.details.formationPro, color: '#14b8a6' },
  ].filter((d) => d.value > 0);

  return (
    <div className="detail-view">
      <button className="btn btn-secondary back-btn" onClick={onBack}>
        ← Retour aux résultats
      </button>

      <div className="detail-header" style={{ borderColor: info.color }}>
        <h2 style={{ color: info.color }}>{info.nomComplet}</h2>
        <p className="detail-description">{info.description}</p>

        <div className="detail-badges">
          <span className="badge">{info.regimeSocial}</span>
          <span className="badge">{info.regimeFiscal}</span>
          <span className="badge">{info.formalites}</span>
          <span className="badge">Capital : {info.capitalMinimum}</span>
        </div>
      </div>

      <div className="detail-grid">
        {/* Financial summary */}
        <div className="detail-card">
          <h3>Synthèse financière</h3>
          <div className="finance-summary">
            <div className="finance-row">
              <span>Chiffre d'affaires</span>
              <span className="bold">{formatMoney(result.revenuBrut)}</span>
            </div>
            <div className="finance-row sub">
              <span>Cotisations sociales</span>
              <span className="negative">- {formatMoney(result.cotisationsSociales)}</span>
            </div>
            <div className="finance-row sub">
              <span>Taux effectif</span>
              <span>{formatPercent(result.tauxCotisations)}</span>
            </div>
            <div className="finance-row sub">
              <span>Impôt sur le revenu</span>
              <span className="negative">- {formatMoney(result.impotRevenu)}</span>
            </div>
            {result.impotSociete > 0 && (
              <div className="finance-row sub">
                <span>Impôt sur les sociétés</span>
                <span className="negative">- {formatMoney(result.impotSociete)}</span>
              </div>
            )}
            <div className="finance-row total">
              <span>Revenu net annuel</span>
              <span className="positive bold">{formatMoney(result.revenuNet)}</span>
            </div>
            <div className="finance-row highlight">
              <span>Revenu net mensuel</span>
              <span className="positive bold">{formatMoney(result.revenuNetMensuel)}</span>
            </div>
          </div>
        </div>

        {/* Cotisations breakdown - Donut chart */}
        <div className="detail-card">
          <h3>Détail des cotisations sociales</h3>
          <div className="donut-chart-container">
            <svg viewBox="0 0 200 200" className="donut-chart">
              {(() => {
                let offset = 0;
                const radius = 70;
                const circumference = 2 * Math.PI * radius;
                return detailItems.map((item) => {
                  const percent = total > 0 ? item.value / total : 0;
                  const dashLength = circumference * percent;
                  const element = (
                    <circle
                      key={item.label}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke={item.color}
                      strokeWidth="24"
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={-offset}
                      transform="rotate(-90 100 100)"
                    />
                  );
                  offset += dashLength;
                  return element;
                });
              })()}
              <text x="100" y="95" textAnchor="middle" className="donut-total">
                {formatMoney(total)}
              </text>
              <text x="100" y="115" textAnchor="middle" className="donut-label">
                Total cotisations
              </text>
            </svg>
          </div>
          <div className="donut-legend">
            {detailItems.map((item) => (
              <div key={item.label} className="donut-legend-item">
                <span className="legend-dot" style={{ backgroundColor: item.color }} />
                <span className="legend-text">{item.label}</span>
                <span className="legend-value">{formatMoney(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avantages */}
        <div className="detail-card">
          <h3>Avantages</h3>
          <ul className="pros-list">
            {info.avantages.map((a, i) => (
              <li key={i}>
                <span className="icon-pro">✓</span> {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Inconvénients */}
        <div className="detail-card">
          <h3>Inconvénients</h3>
          <ul className="cons-list">
            {info.inconvenients.map((a, i) => (
              <li key={i}>
                <span className="icon-con">✗</span> {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Idéal pour */}
        <div className="detail-card full-width">
          <h3>Idéal pour</h3>
          <div className="ideal-tags">
            {info.idealPour.map((tag, i) => (
              <span key={i} className="ideal-tag" style={{ borderColor: info.color, color: info.color }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="detail-card full-width">
          <h3>Caractéristiques</h3>
          <div className="characteristics">
            <div className="char-item">
              <span className="char-label">Responsabilité</span>
              <span className="char-value">{info.responsabilite}</span>
            </div>
            <div className="char-item">
              <span className="char-label">Capital minimum</span>
              <span className="char-value">{info.capitalMinimum}</span>
            </div>
            <div className="char-item">
              <span className="char-label">Nombre d'associés</span>
              <span className="char-value">{info.nbAssocies}</span>
            </div>
            <div className="char-item">
              <span className="char-label">Formalités</span>
              <span className="char-value">{info.formalites}</span>
            </div>
            <div className="char-item">
              <span className="char-label">Coût de création</span>
              <span className="char-value">{info.coutCreation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
