import React, { useEffect, useState } from 'react';

const Dashboard = ({ setView }) => {
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        fetch('https://unique-flexibility-production.up.railway.app/api/quiz')
            .then(res => res.json())
            .then(data => setResponses(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="dashboard-container animate-fade-up">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Resumo das diretrizes configuradas para a IA.</p>
                </div>
                <button onClick={() => setView('quiz')} className="cta-button" style={{ background: '#f1f5f9', color: '#1e293b', width: 'auto' }}>+ Nova Configuração</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {responses.map((resp, idx) => {
                    const data = resp.respostas || {};
                    return (
                        <div key={resp.id} className="response-card" style={{ borderLeft: `6px solid ${resp.source === 'db' ? '#22c55e' : '#f59e0b'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: '800', 
                                        textTransform: 'uppercase', 
                                        padding: '4px 10px', 
                                        background: resp.source === 'db' ? '#dcfce7' : '#fef3c7', 
                                        color: resp.source === 'db' ? '#166534' : '#92400e',
                                        borderRadius: '20px',
                                        marginRight: '10px'
                                    }}>
                                        {resp.source === 'db' ? 'Banco de Dados' : 'Backup Local'}
                                    </span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{new Date(resp.created_at).toLocaleString('pt-BR')}</span>
                                </div>
                                <h3 style={{ color: 'var(--primary)' }}>{data.bloco1?.nomeAssistente}</h3>
                            </div>
                            
                            <div className="response-grid">
                                <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid #eef2f6' }}>
                                    <h4 style={{ color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '0.5px' }}>Saudação & Identidade</h4>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}><strong>Nome IA:</strong> {data.bloco1?.nomeAssistente || 'Não def.'}</p>
                                    <p style={{ fontSize: '0.9rem', color: '#475569' }}>"{data.bloco2?.boasVindas}"</p>
                                </div>
                                
                                <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid #eef2f6' }}>
                                    <h4 style={{ color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '0.5px' }}>Serviços</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#444' }}><strong>Adicionais:</strong> {data.bloco3?.novosServicos || 'Nenhum'}</p>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', marginTop: '5px' }}>{data.bloco3?.descricoesPersonalizadas || 'Sem desc. extra'}</p>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid #eef2f6' }}>
                                    <h4 style={{ color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '0.5px' }}>Atendimento</h4>
                                    <p style={{ fontSize: '0.9rem' }}><strong>Horário:</strong> {data.bloco4?.horarioOficina || 'Não def.'}</p>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}><strong>Fim:</strong> {data.bloco4?.mensagemEncerramento}</p>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid #eef2f6' }}>
                                    <h4 style={{ color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '0.5px' }}>Contatos & Especial</h4>
                                    <p style={{ fontSize: '0.85rem' }}><strong>Dono:</strong> {data.bloco5?.numeroDono || '-'}</p>
                                    <p style={{ fontSize: '0.85rem' }}><strong>Jutaí:</strong> {data.bloco5?.numeroJutai || '-'}</p>
                                    <p style={{ fontSize: '0.85rem', color: '#ef4444', marginTop: '5px' }}><strong>Off-topic:</strong> {data.bloco5?.respostaOffTopic || 'Padrão'}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {responses.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                        <p style={{ color: '#64748b' }}>Ainda não temos respostas salvas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
