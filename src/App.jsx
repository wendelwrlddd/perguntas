import React, { useState } from 'react';
import Dashboard from './components/Dashboard';

const App = () => {
    const [view, setView] = useState('quiz'); // quiz ou dashboard
    const [step, setStep] = useState(1);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        bloco1: { nomeAssistente: '' },
        bloco2: { boasVindas: 'Opção 1' },
        bloco3: { 
            descricoesPersonalizadas: '',
            servicosAtivos: ["Funilaria", "Pintura", "Polimento Técnico", "Higienização", "Mecânica", "Polimento Comercial", "Recuperação de Para-choques", "Polimento de Faróis", "Lavagem Detalhada"],
            novosServicos: ''
        },
        bloco4: {
            mensagemEncerramento: 'Opção 1',
            horarioOficina: '',
            avisoForaHorario: false,
            mensagemForaHorario: '',
            transferirHumano: 'Nunca'
        },
        bloco5: {
            numeroDono: '',
            respostaAndamento: 'Encaminhar para o dono',
            numeroJutai: '',
            respostaOffTopic: '',
            respostaReclamacao: '',
            assuntosProibidos: 'Preço exato, prazo final'
        }
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        console.log('Botão clicado, iniciando envio...');
        setIsLoading(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout

        try {
            const response = await fetch('https://unique-flexibility-production.up.railway.app/api/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ respostas: formData }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                console.log('Envio bem-sucedido!');
                setIsFinished(true);
            } else {
                const errorData = await response.json();
                console.error('Erro no servidor:', errorData);
                alert('Erro do servidor: ' + (errorData.error || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro de rede/execução:', error);
            if (error.name === 'AbortError') {
                alert('O servidor demorou muito para responder (Timeout). Tente novamente.');
            } else {
                alert('Falha na conexão: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (view === 'dashboard') return <Dashboard setView={setView} />;

    return (
        <div className="App">
            <nav style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: 'var(--primary)', fontWeight: '800' }}>STETICAR CONFIG</h2>
                <button onClick={() => setView('dashboard')} className="cta-button" style={{ padding: '0.5rem 1rem' }}>Ver Dashboard de Respostas</button>
            </nav>

            <main className="premium-container" style={{ paddingBottom: '5rem' }}>
                {!isFinished ? (
                    <div className="glass" style={{ padding: '3rem', marginTop: '2rem' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', gap: '10px' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} style={{ flex: 1, height: '4px', background: step >= i ? 'var(--primary)' : '#333', borderRadius: '2px' }}></div>
                            ))}
                        </div>

                        {step === 1 && (
                            <section>
                                <h3 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1.5rem' }}>Bloco 1: Identidade</h3>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Qual o nome da assistente virtual?</label>
                                    <input 
                                        type="text" 
                                        className="chat-input-field" 
                                        style={{ width: '100%', padding: '1rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '8px' }}
                                        value={formData.bloco1.nomeAssistente}
                                        onChange={(e) => setFormData({...formData, bloco1: {...formData.bloco1, nomeAssistente: e.target.value}})}
                                        placeholder="Ex: StetiBot"
                                    />
                                </div>
                                <button onClick={handleNext} className="cta-button">Continuar</button>
                            </section>
                        )}

                        {step === 2 && (
                            <section>
                                <h3 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1.5rem' }}>Bloco 2: Boas-vindas</h3>
                                <p style={{ marginBottom: '1rem' }}>Escolha uma mensagem de boas-vindas:</p>
                                {['Opção 1: Olá! Seja bem-vindo à StetiCar.', 'Opção 2: Oi! Tudo bem? Como a StetiCar pode te ajudar hoje?', 'Opção 3: Olá! Sou a assistente virtual da StetiCar. Em que posso ser útil?', 'Opção 4: Bem-vindo à melhor estética automotiva! Como podemos cuidar do seu carro?'].map(opt => (
                                    <div key={opt} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input 
                                            type="radio" 
                                            name="welcome" 
                                            checked={formData.bloco2.boasVindas === opt}
                                            onChange={() => setFormData({...formData, bloco2: {boasVindas: opt}})}
                                        />
                                        <label>{opt}</label>
                                    </div>
                                ))}
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '10px' }}>
                                    <button onClick={handleBack} className="cta-button" style={{ background: '#444' }}>Voltar</button>
                                    <button onClick={handleNext} className="cta-button">Próximo</button>
                                </div>
                            </section>
                        )}

                        {step === 3 && (
                            <section>
                                <h3 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1.5rem' }}>Bloco 3: Serviços</h3>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Personalize a descrição dos serviços (opcional):</label>
                                    <textarea 
                                        style={{ width: '100%', padding: '1rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '8px', minHeight: '100px' }}
                                        value={formData.bloco3.descricoesPersonalizadas}
                                        onChange={(e) => setFormData({...formData, bloco3: {...formData.bloco3, descricoesPersonalizadas: e.target.value}})}
                                    />
                                </div>
                                <p style={{ marginBottom: '1rem' }}>Quais destes serviços estão ativos?</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                                    {formData.bloco3.servicosAtivos.map(s => (
                                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <input type="checkbox" checked={true} readOnly />
                                            <label>{s}</label>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quer adicionar mais algum serviço?</label>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', padding: '1rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '8px' }}
                                        value={formData.bloco3.novosServicos}
                                        onChange={(e) => setFormData({...formData, bloco3: {...formData.bloco3, novosServicos: e.target.value}})}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={handleBack} className="cta-button" style={{ background: '#444' }}>Voltar</button>
                                    <button onClick={handleNext} className="cta-button">Próximo</button>
                                </div>
                            </section>
                        )}

                        {step === 4 && (
                            <section>
                                <h3 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1.5rem' }}>Bloco 4: Encerramento</h3>
                                <p style={{ marginBottom: '1rem' }}>Escolha a mensagem de encerramento:</p>
                                {['Opção 1: Obrigado! Entraremos em contato.', 'Opção 2: Seus dados foram salvos. Aguarde nosso retorno.', 'Opção 3: Perfeito! Já passei seus dados para o Jutaí.'].map(opt => (
                                    <div key={opt} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input 
                                            type="radio" 
                                            name="closing" 
                                            checked={formData.bloco4.mensagemEncerramento === opt}
                                            onChange={() => setFormData({...formData, bloco4: {...formData.bloco4, mensagemEncerramento: opt}})}
                                        />
                                        <label>{opt}</label>
                                    </div>
                                ))}
                                <div style={{ margin: '1.5rem 0' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Qual o horário de atendimento?</label>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', padding: '1rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '8px' }}
                                        value={formData.bloco4.horarioOficina}
                                        onChange={(e) => setFormData({...formData, bloco4: {...formData.bloco4, horarioOficina: e.target.value}})}
                                        placeholder="Ex: Seg-Sex 08:00 às 18:00"
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={handleBack} className="cta-button" style={{ background: '#444' }}>Voltar</button>
                                    <button onClick={handleNext} className="cta-button">Próximo</button>
                                </div>
                            </section>
                        )}

                        {step === 5 && (
                            <section>
                                <h3 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1.5rem' }}>Bloco 5: Situações Especiais</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '2rem' }}>
                                    <div>
                                        <label>Número do Dono/Responsável:</label>
                                        <input 
                                            type="text" 
                                            style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '8px', marginTop: '5px' }}
                                            value={formData.bloco5.numeroDono}
                                            onChange={(e) => setFormData({...formData, bloco5: {...formData.bloco5, numeroDono: e.target.value}})}
                                        />
                                    </div>
                                    <div>
                                        <label>Número do Jutaí:</label>
                                        <input 
                                            type="text" 
                                            style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '8px', marginTop: '5px' }}
                                            value={formData.bloco5.numeroJutai}
                                            onChange={(e) => setFormData({...formData, bloco5: {...formData.bloco5, numeroJutai: e.target.value}})}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label>Como reagir a mensagens fora do assunto?</label>
                                    <textarea 
                                        style={{ width: '100%', padding: '1rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '8px', marginTop: '5px' }}
                                        value={formData.bloco5.respostaOffTopic}
                                        onChange={(e) => setFormData({...formData, bloco5: {...formData.bloco5, respostaOffTopic: e.target.value}})}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={handleBack} className="cta-button" style={{ background: '#444' }}>Voltar</button>
                                    <button 
                                        onClick={handleSubmit} 
                                        className="cta-button" 
                                        disabled={isLoading}
                                        style={{ opacity: isLoading ? 0.5 : 1 }}
                                    >
                                        {isLoading ? 'Enviando...' : 'Finalizar e Enviar para Dashboard'}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="glass" style={{ padding: '4rem', textAlign: 'center', marginTop: '5rem' }}>
                        <h2 style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '1rem' }}>🎉 Quiz Concluído!</h2>
                        <p style={{ fontSize: '1.2rem', color: '#ccc' }}>Obrigado por responder. Suas diretrizes foram salvas e já podem ser visualizadas no Dashboard.</p>
                        <button onClick={() => setView('dashboard')} className="cta-button" style={{ marginTop: '2rem' }}>Acessar Dashboard</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
