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
        <div className="dashboard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)' }}>Dashboard de Respostas - Quiz StetiCar</h1>
                <button onClick={() => setView('quiz')} className="cta-button" style={{ padding: '0.5rem 1rem' }}>Voltar para o Quiz</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {responses.map((resp, idx) => {
                    const data = resp.respostas;
                    return (
                        <div key={resp.id} className="glass" style={{ padding: '2rem' }}>
                            <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px' }}>
                                Resposta #{resp.id} - {new Date(resp.created_at).toLocaleString('pt-BR')}
                            </h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div>
                                    <h4 style={{ color: '#eee' }}>1. Identidade</h4>
                                    <p>Nome IA: {data.bloco1?.nomeAssistente}</p>
                                    
                                    <h4 style={{ color: '#eee', marginTop: '1rem' }}>2. Boas-vindas</h4>
                                    <p>{data.bloco2?.boasVindas}</p>

                                    <h4 style={{ color: '#eee', marginTop: '1rem' }}>3. Serviços</h4>
                                    <p>Extras: {data.bloco3?.novosServicos || 'Nenhum'}</p>
                                    <p>Detalhamento: {data.bloco3?.descricoesPersonalizadas || 'Nenhum'}</p>
                                </div>
                                
                                <div>
                                    <h4 style={{ color: '#eee' }}>4. Encerramento & Horários</h4>
                                    <p>Mensagem: {data.bloco4?.mensagemEncerramento}</p>
                                    <p>Horário: {data.bloco4?.horarioOficina}</p>

                                    <h4 style={{ color: '#eee', marginTop: '1rem' }}>5. Situações Especiais</h4>
                                    <p>Dono: {data.bloco5?.numeroDono}</p>
                                    <p>Jutaí: {data.bloco5?.numeroJutai}</p>
                                    <p>Off-topic: {data.bloco5?.respostaOffTopic}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {responses.length === 0 && <p style={{ textAlign: 'center' }}>Nenhuma resposta registrada ainda.</p>}
            </div>
        </div>
    );
};

export default Dashboard;
