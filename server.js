const express = require('express');
const axios = require('axios');
const app = express();

const PORT = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/sts_kids_hd', async (req, res) => {
    console.log(`[${new Date().toISOString()}] 📺 Запрос от IPTV-плеера`);
    try {
        const playlistUrl = 'githubusercontent.com';
        const response = await axios.get(playlistUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        const match = response.data.match(/https?:\/\/api\.peers\.tv\/[^\s]+sts_kids[^\s]+\.m3u8[^\s]*/i);
        if (!match) throw new Error('Поток отсутствует');
        
        const streamUrl = match[0].trim();
        console.log(`✅ Ссылка найдена! Перенаправляем плеер напрямую.`);
        
        // Отправляем плеер напрямую к источнику, минуя ограничения прокси
        res.redirect(302, streamUrl);
        
    } catch (error) {
        console.error(`❌ Ошибка: ${error.message}`);
        res.status(500).send(`Ошибка: ${error.message}`);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Прокси-навигатор запущен на порту ${PORT}`);
});
