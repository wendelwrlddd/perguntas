import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

    const createQuizTableQuery = `
        CREATE TABLE IF NOT EXISTS quiz_responses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            respostas JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(createQuizTableQuery, (err) => {
        if (err) console.error('Erro ao criar tabela quiz_responses:', err);
        else console.log('Tabela quiz_responses verificada/criada.');
    });
});

app.post('/api/quiz', (req, res) => {
    const { respostas } = req.body;
    const query = 'INSERT INTO quiz_responses (respostas) VALUES (?)';
    
    // Verificar se o BD está conectado antes de tentar a query
    if (db.state === 'disconnected') {
        return res.status(500).json({ error: 'Banco de dados não conectado' });
    }

    db.query(query, [JSON.stringify(respostas)], (err, result) => {
        if (err) {
            console.error('Erro ao salvar quiz:', err);
            return res.status(500).json({ error: 'Erro ao salvar no banco: ' + err.message });
        }
        res.status(201).json({ message: 'Quiz salvo com sucesso', id: result.insertId });
    });
});

app.get('/api/quiz', (req, res) => {
    db.query('SELECT * FROM quiz_responses ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar quiz:', err);
            return res.status(500).json({ error: 'Erro ao buscar dados' });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
