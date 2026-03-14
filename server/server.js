import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão com o banco de dados
const db = mysql.createConnection(process.env.MYSQL_PUBLIC_URL || {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL no Railway.');

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS leads (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            veiculo VARCHAR(255),
            servico_desejado TEXT,
            problema_descricao TEXT,
            fotos_enviadas BOOLEAN DEFAULT FALSE,
            status VARCHAR(50) DEFAULT 'Pendente',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(createTableQuery, (err) => {
        if (err) console.error('Erro ao criar tabela:', err);
        else console.log('Tabela leads verificada/criada.');
    });
});

app.post('/api/leads', (req, res) => {
    const { nome, veiculo, servico_desejado, problema_descricao, fotos_enviadas } = req.body;
    const query = 'INSERT INTO leads (nome, veiculo, servico_desejado, problema_descricao, fotos_enviadas) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [nome, veiculo, servico_desejado, problema_descricao, fotos_enviadas], (err, result) => {
        if (err) {
            console.error('Erro ao salvar lead:', err);
            return res.status(500).json({ error: 'Erro ao salvar dados' });
        }
        res.status(201).json({ message: 'Lead salvo com sucesso', id: result.insertId });
    });
});

app.get('/api/leads', (req, res) => {
    db.query('SELECT * FROM leads ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar leads:', err);
            return res.status(500).json({ error: 'Erro ao buscar dados' });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
