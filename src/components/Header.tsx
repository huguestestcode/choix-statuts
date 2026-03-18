import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

export function Header({ theme, onToggleTheme, currentView, onChangeView }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">⚖️</span>
          <div>
            <h1>Choix-Statuts</h1>
            <p className="logo-subtitle">Simulateur de statut juridique</p>
          </div>
        </div>

        <nav className="nav">
          {[
            { id: 'simulator', label: 'Simulateur', icon: '🧮' },
            { id: 'comparator', label: 'Comparateur', icon: '📊' },
            { id: 'guide', label: 'Guide', icon: '📚' },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onChangeView(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Changer le thème">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
