import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configuração de CORS mais agressiva para evitar bloqueios
app.use(cors({
    origin: '*', // Permite todas as origens para teste, ou você pode colocar seu link da Vercel aqui
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Priorizar as variáveis que o Railway injeta automaticamente
const dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'mysql.railway.internal',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306
};

console.log('Tentando conectar ao banco com:', { ...dbConfig, password: '***' });

const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

const db = pool.promise();

// Verificar conexão inicial
pool.getConnection((err, conn) => {
    if (err) {
        console.error('ERRO DE CONEXÃO AO BANCO:', err.message);
    } else {
        console.log('CONECTADO AO MYSQL COM SUCESSO!');
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS quiz_responses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                respostas JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        conn.query(createTableQuery, (err) => {
            conn.release();
            if (err) console.error('Erro ao criar tabela:', err);
            else console.log('Tabela verificada.');
        });
    }
});

app.post('/api/quiz', async (req, res) => {
    const { respostas } = req.body;
    try {
        const [result] = await db.query('INSERT INTO quiz_responses (respostas) VALUES (?)', [JSON.stringify(respostas)]);
        res.status(201).json({ message: 'Salvo com sucesso', id: result.insertId });
    } catch (err) {
        console.error('Erro no POST /api/quiz:', err);
        res.status(500).json({ error: 'Erro no banco: ' + err.message });
    }
});

app.get('/api/quiz', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM quiz_responses ORDER BY created_at DESC');
        res.json(results);
    } catch (err) {
        console.error('Erro no GET /api/quiz:', err);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ativo na porta ${PORT}`);
});
