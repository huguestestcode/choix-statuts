import { useState } from 'react';
import { statuts } from '../data/statuts';
import { StatutJuridique, StatutInfo } from '../types';

export function Comparator() {
  const [selected, setSelected] = useState<StatutJuridique[]>([
    'auto-entrepreneur',
    'eurl-is',
    'sasu',
  ]);

  const toggleStatut = (id: StatutJuridique) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectedStatuts = statuts.filter((s) => selected.includes(s.id));

  const criteria: { label: string; key: string; getValue: (s: StatutInfo) => string }[] = [
    { label: 'Nom complet', key: 'nomComplet', getValue: (s) => s.nomComplet },
    { label: 'Régime social', key: 'regimeSocial', getValue: (s) => s.regimeSocial },
    { label: 'Régime fiscal', key: 'regimeFiscal', getValue: (s) => s.regimeFiscal },
    { label: 'Responsabilité', key: 'responsabilite', getValue: (s) => s.responsabilite },
    { label: 'Capital minimum', key: 'capitalMinimum', getValue: (s) => s.capitalMinimum },
    { label: "Nombre d'associés", key: 'nbAssocies', getValue: (s) => s.nbAssocies },
    { label: 'Formalités', key: 'formalites', getValue: (s) => s.formalites },
    { label: 'Coût de création', key: 'coutCreation', getValue: (s) => s.coutCreation },
  ];

  return (
    <div className="comparator">
      <h2>Comparateur de statuts juridiques</h2>
      <p className="comparator-subtitle">
        Sélectionnez les statuts que vous souhaitez comparer côte à côte.
      </p>

      <div className="statut-selector">
        {statuts.map((s) => (
          <button
            key={s.id}
            className={`statut-chip ${selected.includes(s.id) ? 'active' : ''}`}
            style={
              selected.includes(s.id)
                ? { backgroundColor: s.color, borderColor: s.color }
                : { borderColor: s.color, color: s.color }
            }
            onClick={() => toggleStatut(s.id)}
          >
            {s.nom}
          </button>
        ))}
      </div>

      {selectedStatuts.length > 0 && (
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Critère</th>
                {selectedStatuts.map((s) => (
                  <th key={s.id} style={{ borderTopColor: s.color }}>
                    {s.nom}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.key}>
                  <td className="criteria-label">{c.label}</td>
                  {selectedStatuts.map((s) => (
                    <td key={s.id}>{c.getValue(s)}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="criteria-label">Avantages</td>
                {selectedStatuts.map((s) => (
                  <td key={s.id}>
                    <ul className="table-list pros">
                      {s.avantages.slice(0, 3).map((a, i) => (
                        <li key={i}>✓ {a}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="criteria-label">Inconvénients</td>
                {selectedStatuts.map((s) => (
                  <td key={s.id}>
                    <ul className="table-list cons">
                      {s.inconvenients.slice(0, 3).map((a, i) => (
                        <li key={i}>✗ {a}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="criteria-label">Idéal pour</td>
                {selectedStatuts.map((s) => (
                  <td key={s.id}>
                    <div className="table-tags">
                      {s.idealPour.map((tag, i) => (
                        <span key={i} className="mini-tag" style={{ borderColor: s.color }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
