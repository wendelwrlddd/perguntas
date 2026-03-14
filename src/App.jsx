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
            <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
                <h2 style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '1.5rem' }}>STETICAR <span style={{ fontWeight: '300', color: '#64748b' }}>CONFIG</span></h2>
                <button onClick={() => setView('dashboard')} className="cta-button" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', boxShadow: 'none' }}>Ver Respostas</button>
            </nav>

            <main className="premium-container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
                {!isFinished ? (
                    <div className="glass animate-fade-up" style={{ padding: '3.5rem', marginTop: '1rem' }}>
                        <div className="progress-container">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`progress-step ${step >= i ? 'active' : ''}`}></div>
                            ))}
                        </div>

                        {step === 1 && (
                            <section className="animate-fade-up">
                                <h3 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Identidade</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Dê um nome e personalidade para sua assistente.</p>
                                
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: '#444' }}>Qual o nome da assistente virtual?</label>
                                    <input 
                                        type="text" 
                                        className="chat-input-field" 
                                        value={formData.bloco1.nomeAssistente}
                                        onChange={(e) => setFormData({...formData, bloco1: {...formData.bloco1, nomeAssistente: e.target.value}})}
                                        placeholder="Ex: StetiBot"
                                    />
                                </div>
                                <button onClick={handleNext} className="cta-button">Continuar ➜</button>
                            </section>
                        )}

                        {step === 2 && (
                            <section className="animate-fade-up">
                                <h3 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Boas-vindas</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Escolha como a IA deve saudar seus clientes.</p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {['Opção 1: Olá! Seja bem-vindo à StetiCar.', 'Opção 2: Oi! Tudo bem? Como a StetiCar pode te ajudar hoje?', 'Opção 3: Olá! Sou a assistente virtual da StetiCar. Em que posso ser útil?', 'Opção 4: Bem-vindo à melhor estética automotiva! Como podemos cuidar do seu carro?'].map(opt => (
                                        <label key={opt} style={{ 
                                            padding: '1.2rem', 
                                            border: '2px solid', 
                                            borderColor: formData.bloco2.boasVindas === opt ? 'var(--primary)' : '#e2e8f0',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px',
                                            cursor: 'pointer',
                                            background: formData.bloco2.boasVindas === opt ? 'var(--primary-light)' : 'white',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            <input 
                                                type="radio" 
                                                name="welcome" 
                                                checked={formData.bloco2.boasVindas === opt}
                                                onChange={() => setFormData({...formData, bloco2: {boasVindas: opt}})}
                                            />
                                            <span style={{ fontSize: '1rem', fontWeight: formData.bloco2.boasVindas === opt ? '600' : '400' }}>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                                
                                <div style={{ marginTop: '3rem', display: 'flex', gap: '15px' }}>
                                    <button onClick={handleBack} className="cta-button" style={{ background: '#f1f5f9', color: '#64748b' }}>Voltar</button>
                                    <button onClick={handleNext} className="cta-button">Próximo</button>
                                </div>
                            </section>
                        )}

                        {step === 3 && (
                            <section className="animate-fade-up">
                                <h3 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Serviços</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Quais serviços sua estética oferece?</p>
                                
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>Descrição detalhada (opcional):</label>
                                    <textarea 
                                        className="chat-input-field"
                                        style={{ minHeight: '120px' }}
                                        value={formData.bloco3.descricoesPersonalizadas}
                                        onChange={(e) => setFormData({...formData, bloco3: {...formData.bloco3, descricoesPersonalizadas: e.target.value}})}
                                        placeholder="Ex: Nossa lavagem detalhada usa apenas produtos PH neutro..."
                                    />
                                </div>

                                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600' }}>Serviços Ativos:</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '2rem' }}>
                                    {formData.bloco3.servicosAtivos.map(s => (
                                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <input type="checkbox" checked={true} readOnly />
                                            <span style={{ fontSize: '0.9rem' }}>{s}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>Adicionar outros serviços:</label>
                                    <input 
                                        type="text" 
                                        className="chat-input-field"
                                        value={formData.bloco3.novosServicos}
                                        onChange={(e) => setFormData({...formData, bloco3: {...formData.bloco3, novosServicos: e.target.value}})}
                                        placeholder="Ex: Vitrificação, Martelinho..."
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button onClick={handleBack} className="cta-button" style={{ background: '#f1f5f9', color: '#64748b' }}>Voltar</button>
                                    <button onClick={handleNext} className="cta-button">Próximo</button>
                                </div>
                            </section>
                        )}

                        {step === 4 && (
                            <section className="animate-fade-up">
                                <h3 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Encerramento</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Defina a mensagem final e horários da oficina.</p>
                                
                                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600' }}>Mensagem de encerramento:</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
                                    {['Opção 1: Obrigado! Entraremos em contato.', 'Opção 2: Seus dados foram salvos. Aguarde nosso retorno.', 'Opção 3: Perfeito! Já passei seus dados para o Jutaí.'].map(opt => (
                                        <label key={opt} style={{ 
                                            padding: '1.2rem', 
                                            border: '2px solid', 
                                            borderColor: formData.bloco4.mensagemEncerramento === opt ? 'var(--primary)' : '#e2e8f0',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px',
                                            cursor: 'pointer',
                                            background: formData.bloco4.mensagemEncerramento === opt ? 'var(--primary-light)' : 'white',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            <input 
                                                type="radio" 
                                                name="closing" 
                                                checked={formData.bloco4.mensagemEncerramento === opt}
                                                onChange={() => setFormData({...formData, bloco4: {...formData.bloco4, mensagemEncerramento: opt}})}
                                            />
                                            <span style={{ fontSize: '1rem', fontWeight: formData.bloco4.mensagemEncerramento === opt ? '600' : '400' }}>{opt}</span>
                                        </label>
                                    ))}
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>Horário de atendimento:</label>
                                    <input 
                                        type="text" 
                                        className="chat-input-field"
                                        value={formData.bloco4.horarioOficina}
                                        onChange={(e) => setFormData({...formData, bloco4: {...formData.bloco4, horarioOficina: e.target.value}})}
                                        placeholder="Ex: Seg-Sex 08:00 às 18:00"
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button onClick={handleBack} className="cta-button" style={{ background: '#f1f5f9', color: '#64748b' }}>Voltar</button>
                                    <button onClick={handleNext} className="cta-button">Próximo</button>
                                </div>
                            </section>
                        )}

                        {step === 5 && (
                            <section className="animate-fade-up">
                                <h3 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Especiais</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Configurações de contato e exceções.</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '2rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>WhatsApp do Dono:</label>
                                        <input 
                                            type="text" 
                                            className="chat-input-field"
                                            value={formData.bloco5.numeroDono}
                                            onChange={(e) => setFormData({...formData, bloco5: {...formData.bloco5, numeroDono: e.target.value}})}
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>WhatsApp do Jutaí:</label>
                                        <input 
                                            type="text" 
                                            className="chat-input-field"
                                            value={formData.bloco5.numeroJutai}
                                            onChange={(e) => setFormData({...formData, bloco5: {...formData.bloco5, numeroJutai: e.target.value}})}
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Resposta para mensagens fora do assunto:</label>
                                    <textarea 
                                        className="chat-input-field"
                                        style={{ minHeight: '100px' }}
                                        value={formData.bloco5.respostaOffTopic}
                                        onChange={(e) => setFormData({...formData, bloco5: {...formData.bloco5, respostaOffTopic: e.target.value}})}
                                        placeholder="Ex: No momento só respondo sobre serviços da StetiCar..."
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button onClick={handleBack} className="cta-button" style={{ background: '#f1f5f9', color: '#64748b' }}>Voltar</button>
                                    <button 
                                        onClick={handleSubmit} 
                                        className="cta-button" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Enviando...' : 'Finalizar e Enviar ➜'}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="glass" style={{ padding: '4rem', textAlign: 'center', marginTop: '5rem' }}>
                        <h2 style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '1rem' }}>🎉 Quiz Concluído!</h2>
                        <p style={{ fontSize: '1.2rem', color: '#ccc' }}>Obrigado por responder. Suas diretrizes foram processadas.</p>
                        
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '2rem' }}>
                            <button onClick={() => setView('dashboard')} className="cta-button">Ver Dashboard</button>
                            
                            <button 
                                onClick={() => {
                                    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `config_steticar_${formData.bloco1.nomeAssistente || 'ia'}.json`;
                                    a.click();
                                }} 
                                className="cta-button" 
                                style={{ background: '#222', border: '1px solid var(--primary)' }}
                            >
                                Baixar Resumo (JSON)
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
