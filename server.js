const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// Включаем CORS-заголовки для любых IPTV плееров
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/sts_kids_hd', async (req, res) => {
    console.log(`[${new Date().toISOString()}] 📺 Запрос СТС Kids от VLC...`);
    
    // Прямой, официальный и вечный CDN-поток СТС Kids от самого вещателя
    const directStreamUrl = 'limehd.online';
    
    try {
        console.log(`✅ Перенаправляем плеер напрямую на CDN вещателя.`);
        // Мгновенный редирект, который понимает VLC
        res.redirect(302, directStreamUrl);
    } catch (error) {
        console.error(`❌ Ошибка: ${error.message}`);
        res.status(500).send(`Ошибка: ${error.message}`);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Облачный IPTV навигатор запущен на порту ${PORT}`);
});
