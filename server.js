const express = require('express');
const axios = require('axios');
const app = express();

// Разрешаем CORS заголовки для IPTV-плееров
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/sts_kids_hd', async (req, res) => {
    try {
        // Точный адрес источника, который ты скинул
        const playlistUrl = 'https://github.com/Dimonovich/TV/raw/refs/heads/Dimonovich/FREE/TV';
        
        const response = await axios.get(playlistUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        // Ищем живую строчку от api.peers.tv с sts_kids
        const match = response.data.match(/https?:\/\/api\.peers\.tv\/[^\s]+sts_kids[^\s]+\.m3u8[^\s]*/i);
        if (!match) throw new Error('Error');
        
        const streamUrl = match.trim();
        
        // Скачиваем видеопоток на лету и транслируем его прямо в VLC
        const streamResponse = await axios({
            method: 'get',
            url: streamUrl,
            responseType: 'stream',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        streamResponse.data.pipe(res);
        
    } catch (error) {
        res.status(500).send(`Ошибка автообновления потока: ${error.message}`);
    }
});

module.exports = app;
