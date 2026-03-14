import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Usar Pool de conexões para ser mais robusto
const pool = mysql.createPool(process.env.MYSQL_PUBLIC_URL || {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();

// Verificar conexão inicial
pool.getConnection((err, conn) => {
    if (err) {
        console.error('ERRO CRÍTICO: Não foi possível conectar ao MySQL:', err.message);
    } else {
        console.log('Sucesso: Conectado ao Pool do MySQL no Railway.');
        
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS quiz_responses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                respostas JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        conn.query(createTableQuery, (err) => {
            conn.release();
            if (err) console.error('Erro ao verificar/criar tabela:', err);
            else console.log('Tabela quiz_responses pronta.');
        });
    }
});

app.post('/api/quiz', async (req, res) => {
    const { respostas } = req.body;
    try {
        const [result] = await db.query('INSERT INTO quiz_responses (respostas) VALUES (?)', [JSON.stringify(respostas)]);
        res.status(201).json({ message: 'Quiz salvo com sucesso', id: result.insertId });
    } catch (err) {
        console.error('Erro ao salvar quiz no banco:', err);
        res.status(500).json({ error: 'Erro ao salvar no banco: ' + err.message });
    }
});

app.get('/api/quiz', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM quiz_responses ORDER BY created_at DESC');
        res.json(results);
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando e ouvindo em 0.0.0.0:${PORT}`);
});
