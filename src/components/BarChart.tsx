import { SimulationResult } from '../types';
import { formatMoney } from '../utils/calculator';
import { statuts } from '../data/statuts';

interface BarChartProps {
  results: SimulationResult[];
}

export function BarChart({ results }: BarChartProps) {
  const maxValue = Math.max(...results.map((r) => r.revenuBrut), 1);

  return (
    <div className="bar-chart">
      {results.map((result) => {
        const info = statuts.find((s) => s.id === result.statut);
        const color = info?.color || '#666';
        const cotisWidth = (result.cotisationsSociales / maxValue) * 100;
        const irWidth = (result.impotRevenu / maxValue) * 100;
        const isWidth = (result.impotSociete / maxValue) * 100;
        const netWidth = (Math.max(0, result.revenuNet) / maxValue) * 100;

        return (
          <div key={result.statut} className="bar-row">
            <div className="bar-label">{result.statutNom}</div>
            <div className="bar-container">
              <div className="bar-stacked">
                <div
                  className="bar-segment bar-net"
                  style={{ width: `${netWidth}%`, backgroundColor: color }}
                  title={`Net: ${formatMoney(result.revenuNet)}`}
                />
                <div
                  className="bar-segment bar-cotisations"
                  style={{ width: `${cotisWidth}%` }}
                  title={`Cotisations: ${formatMoney(result.cotisationsSociales)}`}
                />
                <div
                  className="bar-segment bar-ir"
                  style={{ width: `${irWidth}%` }}
                  title={`IR: ${formatMoney(result.impotRevenu)}`}
                />
                {result.impotSociete > 0 && (
                  <div
                    className="bar-segment bar-is"
                    style={{ width: `${isWidth}%` }}
                    title={`IS: ${formatMoney(result.impotSociete)}`}
                  />
                )}
              </div>
              <span className="bar-value">{formatMoney(result.revenuNet)}</span>
            </div>
          </div>
        );
      })}
      <div className="bar-legend">
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: 'var(--color-primary)' }} />
          Revenu net
        </span>
        <span className="legend-item">
          <span className="legend-color legend-cotisations" />
          Cotisations
        </span>
        <span className="legend-item">
          <span className="legend-color legend-ir" />
          Impôt revenu
        </span>
        <span className="legend-item">
          <span className="legend-color legend-is" />
          Impôt sociétés
        </span>
      </div>
    </div>
  );
}
