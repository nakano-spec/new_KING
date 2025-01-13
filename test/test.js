const puppeteer = require('puppeteer');

const USERS = [
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    { userId: 'HA03-1002', password: 'king2', teacher: 'teacher' },
    { userId: 'HA03-1003', password: 'king3', teacher: 'teacher' },
    { userId: 'HA03-1004', password: 'king4', teacher: 'teacher' },
    { userId: 'HA03-1005', password: 'king5', teacher: 'teacher' },
    { userId: 'HA03-1001', password: 'king1', teacher: 'teacher' },
    // 必要に応じて追加
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  const results = await Promise.all(
      USERS.map(async (user) => {
          const page = await browser.newPage();

          const startTime = Date.now();
          await page.goto('http://localhost:3000',{timeout: 60000});
          await page.type('#userId', user.userId);
          await page.type('#password', user.password);
          await page.select('#teacherSelect', user.teacher);

          await Promise.all([
              page.click('button[type="submit"]'),
              page.waitForNavigation(),
          ]);

          const endTime = Date.now();
          await page.close();

          return {
              user: user.userId,
              responseTime: endTime - startTime,
          };
      })
  );

  console.log('テスト結果:');
  results.forEach((result) => {
      console.log(`ユーザー: ${result.user}, 応答時間: ${result.responseTime}ms`);
  });

  await browser.close();
})();

