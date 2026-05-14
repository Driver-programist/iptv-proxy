const express = require('express');
const axios = require('axios');
const app = express();

const PORT = 3000;

app.get('/sts_kids_hd', async (req, res) => {
    console.log(`[${new Date().toISOString()}] 📺 Запрос СТС Kids от плеера`);
    
    try {
        const playlistUrl = 'githubusercontent.com';
        const response = await axios.get(playlistUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        const match = response.data.match(/https?:\/\/api\.peers\.tv\/[^\s]+sts_kids[^\s]+\.m3u8[^\s]*/i);
        if (!match) throw new Error('Поток не найден');
        
        const streamUrl = match[0].trim();
        console.log(`✅ Ссылка найдена, ретранслируем видео...`);
        
        const streamResponse = await axios({
            method: 'get',
            url: streamUrl,
            responseType: 'stream',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        streamResponse.data.pipe(res);
        
    } catch (error) {
        console.error(`❌ Ошибка: ${error.message}`);
        res.status(500).send(`Ошибка: ${error.message}`);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
