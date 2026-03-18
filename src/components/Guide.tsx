import { useState } from 'react';
import { statuts } from '../data/statuts';

export function Guide() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="guide">
      <h2>Guide des statuts juridiques</h2>
      <p className="guide-subtitle">
        Tout ce que vous devez savoir pour choisir le bon statut pour votre entreprise.
      </p>

      <div className="guide-intro">
        <div className="guide-card highlight-card">
          <h3>Comment choisir son statut juridique ?</h3>
          <p>Le choix du statut juridique dépend de plusieurs critères :</p>
          <ol>
            <li><strong>Nombre d'associés</strong> — Seul ou à plusieurs ?</li>
            <li><strong>Protection du patrimoine</strong> — Quel niveau de responsabilité ?</li>
            <li><strong>Régime social</strong> — TNS (cotisations faibles, couverture moindre) ou assimilé salarié (cotisations élevées, meilleure protection) ?</li>
            <li><strong>Fiscalité</strong> — IR (transparent) ou IS (optimisation salaire/dividendes) ?</li>
            <li><strong>Évolutivité</strong> — Levée de fonds, entrée d'associés ?</li>
            <li><strong>Simplicité</strong> — Niveau de formalités et coûts de gestion acceptable ?</li>
          </ol>
        </div>

        <div className="guide-card highlight-card">
          <h3>TNS vs Assimilé Salarié</h3>
          <div className="comparison-mini">
            <div className="mini-col">
              <h4>TNS (Travailleur Non Salarié)</h4>
              <p>Cotisations ≈ 45% de la rémunération</p>
              <ul>
                <li>EURL, SARL (gérant majoritaire), EI</li>
                <li>Cotisations plus faibles</li>
                <li>Protection sociale de base</li>
                <li>Retraite plus faible</li>
              </ul>
            </div>
            <div className="mini-col">
              <h4>Assimilé salarié</h4>
              <p>Cotisations ≈ 65-80% de la rémunération</p>
              <ul>
                <li>SASU, SAS (président)</li>
                <li>Cotisations plus élevées</li>
                <li>Meilleure protection sociale</li>
                <li>Retraite du régime général</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="guide-card highlight-card">
          <h3>IR vs IS : quel régime fiscal ?</h3>
          <div className="comparison-mini">
            <div className="mini-col">
              <h4>Impôt sur le Revenu (IR)</h4>
              <ul>
                <li>Bénéfice imposé au nom du dirigeant</li>
                <li>Barème progressif (0% à 45%)</li>
                <li>Pas de double imposition</li>
                <li>Déficit imputable sur le revenu global</li>
                <li>Idéal si faibles bénéfices ou TMI basse</li>
              </ul>
            </div>
            <div className="mini-col">
              <h4>Impôt sur les Sociétés (IS)</h4>
              <ul>
                <li>15% jusqu'à 42 500€, puis 25%</li>
                <li>Optimisation salaire / dividendes</li>
                <li>Capitalisation possible des bénéfices</li>
                <li>Idéal si bénéfices importants</li>
                <li>Attention : dividendes ensuite imposés</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h3 className="section-title">Fiches détaillées par statut</h3>

      <div className="guide-accordion">
        {statuts.map((s) => (
          <div
            key={s.id}
            className={`accordion-item ${openId === s.id ? 'open' : ''}`}
            style={{ '--accent': s.color } as React.CSSProperties}
          >
            <button
              className="accordion-header"
              onClick={() => setOpenId(openId === s.id ? null : s.id)}
            >
              <span className="accordion-dot" style={{ backgroundColor: s.color }} />
              <span className="accordion-title">{s.nomComplet}</span>
              <span className="accordion-arrow">{openId === s.id ? '▲' : '▼'}</span>
            </button>

            {openId === s.id && (
              <div className="accordion-body">
                <p>{s.description}</p>

                <div className="accordion-grid">
                  <div>
                    <h4>Avantages</h4>
                    <ul className="pros-list">
                      {s.avantages.map((a, i) => (
                        <li key={i}><span className="icon-pro">✓</span> {a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Inconvénients</h4>
                    <ul className="cons-list">
                      {s.inconvenients.map((a, i) => (
                        <li key={i}><span className="icon-con">✗</span> {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="accordion-meta">
                  <span><strong>Régime social :</strong> {s.regimeSocial}</span>
                  <span><strong>Régime fiscal :</strong> {s.regimeFiscal}</span>
                  <span><strong>Capital minimum :</strong> {s.capitalMinimum}</span>
                  <span><strong>Associés :</strong> {s.nbAssocies}</span>
                  <span><strong>Formalités :</strong> {s.formalites}</span>
                  <span><strong>Coût de création :</strong> {s.coutCreation}</span>
                </div>

                <div className="ideal-tags">
                  {s.idealPour.map((tag, i) => (
                    <span key={i} className="ideal-tag" style={{ borderColor: s.color, color: s.color }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="guide-disclaimer">
        <p>
          <strong>Avertissement :</strong> Ce simulateur est un outil d'aide à la décision. Les calculs sont des estimations basées sur les barèmes en vigueur. Pour un conseil personnalisé, consultez un expert-comptable ou un avocat spécialisé.
        </p>
      </div>
    </div>
  );
}
