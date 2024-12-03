const { createClient } = require('redis');

const client = createClient({
  url: 'redis://localhost:6379' // 必要に応じて変更
  // password: 'your_redis_password', // 認証が必要な場合
});

client.on('error', (err) => {
  console.error('Redis接続エラー:', err);
});

client.connect()
  .then(() => {
    console.log('Redisに接続成功');
    return client.ping();
  })
  .then((res) => {
    console.log('Ping response:', res); // PONG が期待されます
    return client.quit();
  })
  .catch((err) => {
    console.error('接続エラー:', err);
  });
