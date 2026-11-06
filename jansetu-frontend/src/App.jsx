import { useEffect, useState } from 'react';
import api from './services/api';
import './App.css';

function App() {

  const [backendStatus, setBackendStatus] = useState('CHECKING');
  const [message, setMessage] = useState('');

  useEffect(() => {

    const checkBackend = async () => {

      try {

        const response = await api.get('/health');

        setBackendStatus(response.data.status);
        setMessage(response.data.message);

      } catch (error) {

        console.error('Backend connection failed:', error);

        setBackendStatus('OFFLINE');
        setMessage(
          'Unable to connect with JanSetu backend.'
        );

      }
    };

    checkBackend();

  }, []);

  return (
    <div className="app">

      <header className="navbar">

        <div className="brand">
          <span className="brand-icon">J</span>
          <span>JanSetu</span>
        </div>

        <span className="brand-hindi">जनसेतु</span>

      </header>

      <main className="hero">

        <div className="hero-content">

          <span className="tagline">
            CONNECTING CITIZENS
          </span>

          <h1>
            Your City.<br />
            Your Voice.<br />
            <span>Our Responsibility.</span>
          </h1>

          <p>
            Report civic issues, track their progress,
            and help build a better community through JanSetu.
          </p>

          <button className="primary-btn">
            Explore JanSetu
          </button>

        </div>

        <div className="hero-card">

          <div className="card-icon">🏙️</div>

          <h2>Better Cities Start With You</h2>

          <p>
            From reporting potholes to tracking
            public infrastructure problems,
            make your voice count.
          </p>

          <div className="connection-status">

            <span
              className={`status-dot ${
                backendStatus === 'UP'
                  ? 'online'
                  : backendStatus === 'CHECKING'
                  ? 'checking'
                  : 'offline'
              }`}
            />

            <strong>Backend: {backendStatus}</strong>

          </div>

          <p className="status-message">
            {message}
          </p>

          <div className="color-strip">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>

      </main>

      <footer>
        © 2026 JanSetu. Connecting Citizens.
        Creating Better Communities.
      </footer>

    </div>
  );
}

export default App;