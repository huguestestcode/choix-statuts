import { useState } from 'react';
import { SimulationInput, SimulationResult } from './types';
import { simulateAll } from './utils/calculator';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { Questionnaire } from './components/Questionnaire';
import { Results } from './components/Results';
import { DetailView } from './components/DetailView';
import { Comparator } from './components/Comparator';
import { Guide } from './components/Guide';

type View = 'simulator' | 'comparator' | 'guide';
type SimState = 'questionnaire' | 'results' | 'detail';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<View>('simulator');
  const [simState, setSimState] = useState<SimState>('questionnaire');
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);

  const handleSimulation = (input: SimulationInput) => {
    const res = simulateAll(input);
    setResults(res);
    setSimState('results');
  };

  const handleReset = () => {
    setSimState('questionnaire');
    setResults([]);
    setSelectedDetail(null);
  };

  const handleViewDetail = (statut: string) => {
    setSelectedDetail(statut);
    setSimState('detail');
  };

  const handleBackToResults = () => {
    setSimState('results');
    setSelectedDetail(null);
  };

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        currentView={view}
        onChangeView={(v) => {
          setView(v as View);
          if (v === 'simulator') handleReset();
        }}
      />

      <main className="main-content">
        {view === 'simulator' && (
          <>
            {simState === 'questionnaire' && (
              <Questionnaire onComplete={handleSimulation} />
            )}
            {simState === 'results' && (
              <Results
                results={results}
                onReset={handleReset}
                onViewDetail={handleViewDetail}
              />
            )}
            {simState === 'detail' && selectedDetail && (
              <DetailView
                result={results.find((r) => r.statut === selectedDetail)!}
                onBack={handleBackToResults}
              />
            )}
          </>
        )}

        {view === 'comparator' && <Comparator />}
        {view === 'guide' && <Guide />}
      </main>

      <footer className="footer">
        <p>
          Choix-Statuts — Simulateur de statut juridique d'entreprise
        </p>
        <p className="footer-disclaimer">
          Outil d'aide à la décision. Consultez un professionnel pour un conseil personnalisé.
        </p>
      </footer>
    </div>
  );
}
