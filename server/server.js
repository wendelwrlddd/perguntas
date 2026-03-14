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
        // Salva com a mesma estrutura do Banco: { id, respostas, created_at }
        current.unshift({
            id: Date.now(),
            respostas: respostas, 
            created_at: new Date().toISOString()
        });
        fs.writeFileSync(JSON_FILE, JSON.stringify(current, null, 2));
        return true;
    } catch (e) { console.error('Erro ao salvar JSON:', e); return false; }
};

// ... (configurações do banco permanecem as mesmas)

app.post('/api/quiz', async (req, res) => {
    const { respostas } = req.body;
    let saved = false;

    if (dbEnabled) {
        try {
            await db.query('INSERT INTO quiz_responses (respostas) VALUES (?)', [JSON.stringify(respostas)]);
            saved = true;
        } catch (err) {
            console.error('Falha ao salvar no banco, tentando JSON...', err.message);
        }
    }

    if (!saved) {
        if (saveToJson(respostas)) {
            return res.status(201).json({ message: 'Salvo em JSON (Backup)', mode: 'json' });
        } else {
            return res.status(500).json({ error: 'Erro ao salvar dados' });
        }
    }

    res.status(201).json({ message: 'Salvo com sucesso no Banco', mode: 'db' });
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
