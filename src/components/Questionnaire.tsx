import { useState } from 'react';
import { SimulationInput } from '../types';
import { questions } from '../data/questions';
import { formatMoney } from '../utils/calculator';

interface QuestionnaireProps {
  onComplete: (input: SimulationInput) => void;
}

const defaultInput: SimulationInput = {
  chiffreAffaires: 60000,
  charges: 10000,
  remuneration: 3000,
  activite: 'services',
  situationFamiliale: 'celibataire',
  nbParts: 0,
  autresRevenus: 0,
  seul: true,
  protectionSociale: 'standard',
  investisseurs: false,
  chiffreAffairesCible: 'moyen',
};

export function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<SimulationInput>(defaultInput);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleChoice = (value: string) => {
    const field = currentQuestion.field;
    let parsed: unknown = value;

    if (value === 'true') parsed = true;
    else if (value === 'false') parsed = false;

    setInput((prev) => ({ ...prev, [field]: parsed }));

    // Auto advance after choice
    setTimeout(() => {
      if (step < questions.length - 1) {
        setDirection('forward');
        setStep((s) => s + 1);
      } else {
        onComplete(input);
      }
    }, 300);
  };

  const handleSlider = (value: number) => {
    setInput((prev) => ({ ...prev, [currentQuestion.field]: value }));
  };

  const goBack = () => {
    if (step > 0) {
      setDirection('backward');
      setStep((s) => s - 1);
    }
  };

  const goForward = () => {
    if (step < questions.length - 1) {
      setDirection('forward');
      setStep((s) => s + 1);
    } else {
      onComplete(input);
    }
  };

  const getValue = (): unknown => {
    return input[currentQuestion.field];
  };

  const formatSliderValue = (val: number): string => {
    if (currentQuestion.unit === '€/mois') {
      return `${formatMoney(val)}/mois`;
    }
    return formatMoney(val);
  };

  return (
    <div className="questionnaire">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span className="progress-text">
          {step + 1} / {questions.length}
        </span>
      </div>

      <div className={`question-card slide-${direction}`} key={step}>
        <div className="question-header">
          <h2>{currentQuestion.question}</h2>
          <p>{currentQuestion.description}</p>
        </div>

        {currentQuestion.type === 'choice' && currentQuestion.options && (
          <div className="choices">
            {currentQuestion.options.map((option) => {
              const isSelected = String(getValue()) === option.value;
              return (
                <button
                  key={option.value}
                  className={`choice-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleChoice(option.value)}
                >
                  <span className="choice-icon">{option.icon}</span>
                  <span className="choice-label">{option.label}</span>
                  <span className="choice-desc">{option.description}</span>
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === 'slider' && (
          <div className="slider-container">
            <div className="slider-value">{formatSliderValue(getValue() as number)}</div>
            <input
              type="range"
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={currentQuestion.step}
              value={getValue() as number}
              onChange={(e) => handleSlider(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>{formatSliderValue(currentQuestion.min!)}</span>
              <span>{formatSliderValue(currentQuestion.max!)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="question-nav">
        <button className="btn btn-secondary" onClick={goBack} disabled={step === 0}>
          ← Précédent
        </button>
        <button className="btn btn-primary" onClick={goForward}>
          {step === questions.length - 1 ? 'Voir les résultats →' : 'Suivant →'}
        </button>
      </div>
    </div>
  );
}
