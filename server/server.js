import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const JSON_FILE = path.join(process.cwd(), 'quiz_data.json');

// Função para ler do JSON
const readFromJson = () => {
    try {
        if (fs.existsSync(JSON_FILE)) {
            return JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
        }
    } catch (e) { console.error('Erro ao ler JSON:', e); }
    return [];
};

// Função para salvar no JSON
const saveToJson = (data) => {
    try {
        const current = readFromJson();
        current.unshift({...data, id: Date.now(), created_at: new Date().toISOString()});
        fs.writeFileSync(JSON_FILE, JSON.stringify(current, null, 2));
        return true;
    } catch (e) { console.error('Erro ao salvar JSON:', e); return false; }
};

// Tentativa de conexão com o Banco
const dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'mysql.railway.internal',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306
};

let dbEnabled = false;
const pool = mysql.createPool(dbConfig);
const db = pool.promise();

pool.getConnection((err, conn) => {
    if (err) {
        console.error('AVISO: MySQL inacessível. Usando modo JSON de backup. Erro:', err.message);
    } else {
        console.log('SUCESSO: Conectado ao MySQL.');
        dbEnabled = true;
        conn.release();
    }
});

app.post('/api/quiz', async (req, res) => {
    const { respostas } = req.body;
    let saved = false;

    // Tentar salvar no Banco primeiro
    if (dbEnabled) {
        try {
            await db.query('INSERT INTO quiz_responses (respostas) VALUES (?)', [JSON.stringify(respostas)]);
            saved = true;
        } catch (err) {
            console.error('Falha ao salvar no banco, tentando JSON...', err.message);
        }
    }

    // Fallback para JSON
    if (!saved) {
        if (saveToJson(respostas)) {
            return res.status(201).json({ message: 'Salvo em JSON (Backup)', mode: 'json' });
        } else {
            return res.status(500).json({ error: 'Erro ao salvar dados em qualquer local' });
        }
    }

    res.status(201).json({ message: 'Salvo com sucesso no Banco', mode: 'db' });
});

app.get('/api/quiz', async (req, res) => {
    let data = [];
    
    // Tentar buscar do Banco
    if (dbEnabled) {
        try {
            const [results] = await db.query('SELECT * FROM quiz_responses ORDER BY created_at DESC');
            data = results.map(r => ({...r, source: 'db'}));
        } catch (err) {
            console.error('Falha ao buscar do banco, buscando do JSON...', err.message);
        }
    }

    // Se estiver vazio ou banco falhar, pega do JSON
    const jsonData = readFromJson().map(r => ({...r, source: 'json'}));
    res.json([...data, ...jsonData].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
