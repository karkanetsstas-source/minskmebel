// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // отдаём index.html и все файлы

// Токен бота и ID чата
const TELEGRAM_TOKEN = '8526157082:AAF8LMNo3uj7mvKMQ42XNeKE7ZT_yI_NHc8';
const CHAT_ID = '741505166';

// Роут для отправки заявки в Telegram
app.post('/sendTelegram', async (req, res) => {
  console.log('Получен POST:', req.body);
  const { name, phone, description } = req.body;

  const message = `Новая заявка:
Имя: ${name}
Телефон: ${phone}
Описание: ${description}`;

  try {
    // fetch встроен в Node 24+
    const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    });

    const data = await tgRes.json();
    console.log('Ответ Telegram:', data);

    if (data.ok) {
      res.json({ status: 'ok' });
    } else {
      res.status(500).json({ status: 'error', telegram: data });
    }
  } catch (err) {
    console.error('Ошибка при отправке в Telegram:', err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Старт сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));