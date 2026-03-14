import React, { useState } from 'react';
import ChatAssistant from './components/ChatAssistant';
import Dashboard from './components/Dashboard';

function App() {
  const [view, setView] = useState('landing'); // landing ou dashboard

  const services = [
    { title: "Funilaria", desc: "Restauração completa de lataria com acabamento original." },
    { title: "Pintura", desc: "Pintura automotiva de alta performance e durabilidade." },
    { title: "Polimento Técnico", desc: "Remoção de riscos e restauração do brilho máximo." },
    { title: "Higienização", desc: "Limpeza profunda interna para conforto e saúde." },
    { title: "Mecânica", desc: "Manutenção preventiva e corretiva especializada." },
    { title: "Polimento Comercial", desc: "Realce no visual do veículo com agilidade." }
  ];

  return (
    <div className="App">
      <nav style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '2px' }}>STETICAR</h2>
        <div>
          <button onClick={() => setView('landing')} style={{ background: 'none', border: 'none', color: view === 'landing' ? 'var(--primary)' : 'white', cursor: 'pointer', marginRight: '2rem' }}>Início</button>
          <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: view === 'dashboard' ? 'var(--primary)' : 'white', cursor: 'pointer' }}>Dashboard</button>
        </div>
      </nav>

      {view === 'landing' ? (
        <main>
          <section className="hero">
            <h1>Estética Automotiva de Elite</h1>
            <p>A StetiCar cuida do seu veículo com o profissionalismo e a paixão que ele merece. Transformações que impressionam.</p>
            <button className="cta-button">Solicitar Orçamento</button>
          </section>

          <section className="premium-container">
            <h2 style={{ textAlign: 'center', fontSize: '3rem', margin: '5rem 0' }}>Nossos Serviços</h2>
            <div className="services-grid">
              {services.map((s, i) => (
                <div key={i} className="service-card glass">
                  <h3>{s.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <footer style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
            <p>&copy; 2026 StetiCar Estética Automotiva. Todos os direitos reservados.</p>
          </footer>
        </main>
      ) : (
        <Dashboard />
      )}

      <ChatAssistant />
    </div>
  );
}

export default App;
