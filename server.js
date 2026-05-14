const fs = require('fs');
const axios = require('axios');

async function run() {
    try {
        const response = await axios.get('https://github.com/Dimonovich/TV/raw/refs/heads/Dimonovich/FREE/TV');
        const match = response.data.match(/https?:\/\/api\.peers\.tv\/[^\s]+sts_kids[^\s]+\.m3u8[^\s]*/i);
        if (!match) throw new Error('Поток не найден');
        
        // Создаем чистый плейлист, который VLC проглотит без вопросов
        const m3u = `#EXTM3U\n#EXTINF:-1,СТС Kids HD\n${match[0].trim()}\n`;
        fs.writeFileSync('index.html', m3u, 'utf8'); // Называем index.html, чтобы Гитхаб отдавал его сразу
    } catch (e) { process.exit(1); }
}
run();
