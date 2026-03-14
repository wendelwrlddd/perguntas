import React, { useState, useEffect, useRef } from 'react';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Olá! Sou seu Assistente Virtual da StetiCar.' },
        { role: 'bot', text: 'Como posso ajudar você hoje? Deseja saber sobre nossos serviços ou solicitar um orçamento?' }
    ]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState('goal'); // goal -> service -> name -> vehicle -> problem -> photos -> finish
    const [leadData, setLeadData] = useState({
        nome: '',
        veiculo: '',
        servico_desejado: '',
        problema_descricao: '',
        fotos_enviadas: false
    });

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const services = [
        "Funilaria", "Pintura", "Polimento Técnico", "Higienização",
        "Mecânica", "Polimento Comercial", "Recuperação de Para-choques",
        "Polimento de Faróis", "Lavagem Detalhada"
    ];

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');

        // Lógica de fluxo baseada no prompt
        let botResponse = '';
        
        if (step === 'goal') {
            botResponse = 'Excelente! Aqui estão os serviços que a StetiCar oferece de forma premium:\n\n' + 
                          services.map(s => `• ${s}`).join('\n') + 
                          '\n\nQual deles você tem interesse?';
            setStep('service');
        } else if (step === 'service') {
            setLeadData(prev => ({ ...prev, servico_desejado: currentInput }));
            botResponse = 'Ótima escolha! Para começarmos o atendimento, qual o seu nome completo?';
            setStep('name');
        } else if (step === 'name') {
            setLeadData(prev => ({ ...prev, nome: currentInput }));
            botResponse = 'Prazer em conhecer você! Agora, qual a Marca, Modelo e Ano do seu veículo?';
            setStep('vehicle');
        } else if (step === 'vehicle') {
            setLeadData(prev => ({ ...prev, veiculo: currentInput }));
            botResponse = 'Entendido. Pode descrever com mais detalhes o problema ou o serviço que deseja realizar?';
            setStep('problem');
        } else if (step === 'problem') {
            setLeadData(prev => ({ ...prev, problema_descricao: currentInput }));
            botResponse = 'Perfeito. Para uma análise mais precisa, você poderia enviar fotos do estado atual do carro? (Pode confirmar digitando "Sim" quando enviar)';
            setStep('photos');
        } else if (step === 'photos') {
            const finalData = { ...leadData, fotos_enviadas: currentInput.toLowerCase().includes('sim') };
            setLeadData(finalData);
            
            // Salvar no Banco de Dados
            try {
                await fetch('http://localhost:3001/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalData)
                });
            } catch (error) {
                console.error('Erro ao salvar lead:', error);
            }

            botResponse = 'Obrigado por todas as informações! Nossa equipe (Jutaí) analisará os dados e entrará em contato em breve. Se precisar de algo urgente, chame no WhatsApp: (73) 99108-2831';
            setStep('finish');
        }

        if (botResponse) {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
            }, 600);
        }
    };

    return (
        <div className="chat-widget">
            <div className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
                <span style={{ fontSize: '1.5rem' }}>💬</span>
            </div>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">Assitente StetiCar</div>
                    <div className="chat-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`message ${m.role}`}>
                                {m.text.split('\n').map((line, j) => <p key={j}>{line}</p>)}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    {step !== 'finish' && (
                        <div className="chat-input">
                            <input 
                                type="text" 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Digite sua resposta..."
                            />
                            <button onClick={handleSend} className="cta-button" style={{ padding: '0.5rem 1rem' }}>Sair</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatAssistant;
