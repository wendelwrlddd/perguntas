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
const saveToJson = (respostas) => {
    try {
        const current = readFromJson();
        current.unshift({
            id: Date.now(),
            respostas: respostas, 
            created_at: new Date().toISOString()
        });
        fs.writeFileSync(JSON_FILE, JSON.stringify(current, null, 2));
        return true;
    } catch (e) { console.error('Erro ao salvar JSON:', e); return false; }
};

// Configurações do Banco
const dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'mysql.railway.internal',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306
};

let dbEnabled = false;
let db;

try {
    const pool = mysql.createPool(dbConfig);
    db = pool.promise();

    pool.getConnection((err, conn) => {
        if (err) {
            console.error('AVISO: Banco de dados não disponível agora. Usando modo JSON de backup.');
        } else {
            console.log('SUCESSO: Conectado ao MySQL.');
            dbEnabled = true;
            conn.release();
        }
    });
} catch (e) {
    console.error('Falha crítica ao criar pool de conexões:', e.message);
}

app.get('/api/ping', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.post('/api/quiz', async (req, res) => {
    const { respostas } = req.body;
    let saved = false;

    if (dbEnabled && db) {
        try {
            await db.query('INSERT INTO quiz_responses (respostas) VALUES (?)', [JSON.stringify(respostas)]);
            saved = true;
        } catch (err) {
            console.error('Erro ao salvar no banco, tentando JSON...', err.message);
        }
    }

    if (!saved) {
        if (saveToJson(respostas)) {
            return res.status(201).json({ message: 'Salvo em JSON (Modo Backup)', mode: 'json' });
        } else {
            return res.status(500).json({ error: 'Erro ao salvar dados' });
        }
    }

    res.status(201).json({ message: 'Salvo no Banco de Dados', mode: 'db' });
});

app.get('/api/quiz', async (req, res) => {
    let data = [];
    
    if (dbEnabled) {
        try {
            const [results] = await db.query('SELECT * FROM quiz_responses ORDER BY created_at DESC');
            data = results.map(r => ({...r, source: 'db'}));
        } catch (err) {
            console.error('Falha ao buscar do banco...', err.message);
        }
    }

    // Pega do JSON e garante que o formato antigo seja convertido se necessário
    const jsonData = readFromJson().map(item => {
        // Se o item já tiver a propriedade 'respostas', usa ela. Se não, assume que o item É a resposta.
        if (item.respostas) {
            return { ...item, source: 'json' };
        } else {
            const { id, created_at, ...respostas } = item;
            return { id, created_at, respostas, source: 'json' };
        }
    });

    res.json([...data, ...jsonData].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
