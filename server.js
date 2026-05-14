const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// Разрешаем CORS, чтобы плееры не выдавали ошибку сети
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/sts_kids_hd', async (req, res) => {
    console.log(`[${new Date().toISOString()}] 📺 Запрос СТС Kids от IPTV-плеера`);
    
    try {
        // Точный и полный адрес источника Димоновича
        const playlistUrl = 'https://github.com/Dimonovich/TV/raw/refs/heads/Dimonovich/FREE/TV';
        
        const response = await axios.get(playlistUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        
        // Вырезаем актуальную ссылку от api.peers.tv
        const match = response.data.match(/https?:\/\/api\.peers\.tv\/[^\s]+sts_kids[^\s]+\.m3u8[^\s]*/i);
        if (!match) throw new Error('Поток СТС Kids не найден в исходном файле');
        
        const streamUrl = match[0].trim();
        console.log(`✅ Ссылка успешно найдена! Перенаправляем плеер.`);
        
        // Отправляем плеер напрямую к источнику. VLC это отлично понимает
        res.redirect(302, streamUrl);
        
    } catch (error) {
        console.error(`❌ Ошибка скрипта: ${error.message}`);
        res.status(500).send(`Ошибка: ${error.message}`);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Облачный IPTV навигатор работает на порту ${PORT}`);
});

