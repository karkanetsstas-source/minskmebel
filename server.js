const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // отдаёт index.html

const TELEGRAM_TOKEN = '8526157082:AAF8LMNo3uj7mvKMQ42XNeKE7ZT_yI_NHc8';
const CHAT_ID = '741505166';

app.post('/sendTelegram', async (req, res) => {
  const { name, phone, description } = req.body;

  // ❌ здесь была ошибка, нужно использовать обратные кавычки для многострочной строки
  const message = `Новая заявка:
Имя: ${name}
Телефон: ${phone}
Описание: ${description}`;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    const data = await tgRes.json();

    if (data.ok) {
      res.json({ status: 'ok' });
    } else {
      res.status(500).json(data);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'telegram error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});