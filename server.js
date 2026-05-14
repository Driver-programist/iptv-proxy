const fs = require('fs');
const axios = require('axios');

async function run() {
    console.log('🔄 Старт парсинга СТС Kids...');
    try {
        const playlistUrl = 'https://github.com/Dimonovich/TV/raw/refs/heads/Dimonovich/FREE/TV';
        
        const response = await axios.get(playlistUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        // Ищем живую строчку от api.peers.tv с sts_kids
        const match = response.data.match(/https?:\/\/api\.peers\.tv\/[^\s]+sts_kids[^\s]+\.m3u8[^\s]*/i);
        if (!match) throw new Error('Поток СТС Kids не найден у Димоновича');
        
        const liveUrl = match.trim();
        console.log(`✅ Найдена живая ссылка: ${liveUrl}`);
        
        // Записываем чистый адрес потока в корень, чтобы превратить его в веб-страницу
        fs.writeFileSync('sts_kids_hd', liveUrl, 'utf8');
        console.log('🎉 Ссылка успешно сохранена в файл!');
    } catch (error) {
        console.error('❌ Ошибка парсера:', error.message);
        process.exit(1);
    }
}

run();

