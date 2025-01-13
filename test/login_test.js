const { fork } = require('child_process');

for (let i = 0; i < 10; i++) { // 10スレッドを並列に実行
    fork('test.js'); // 上記のコードを保存したファイル
}
