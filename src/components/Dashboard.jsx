import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/leads')
            .then(res => res.json())
            .then(data => setLeads(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="dashboard-container">
            <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Dashboard Administrativo - Leads StetiCar</h1>
            <div className="glass" style={{ padding: '2rem' }}>
                <table className="leads-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Veículo</th>
                            <th>Serviço</th>
                            <th>Descrição</th>
                            <th>Fotos?</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id}>
                                <td>{lead.id}</td>
                                <td>{lead.nome}</td>
                                <td>{lead.veiculo}</td>
                                <td>{lead.servico_desejado}</td>
                                <td>{lead.problema_descricao}</td>
                                <td>{lead.fotos_enviadas ? '✅ Sim' : '❌ Não'}</td>
                                <td>{new Date(lead.created_at).toLocaleString('pt-BR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {leads.length === 0 && <p style={{ textAlign: 'center', marginTop: '2rem' }}>Nenhum lead capturado ainda.</p>}
            </div>
        </div>
    );
};

export default Dashboard;
