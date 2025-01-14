//セッションチェック三銃士
window.addEventListener('load',function(){
    socket.emit('checksession',"kaitou2.ejs");//現在いるページを引数として送る
})

socket.on('session_OK',function(data){
    console.log(data);
})

socket.on('session_error',function(data){
    console.log(data);
    window.location.href = '/login';//失敗時はログインページに遷移（セッション破棄済み）
})
//三銃士ここまで

// サーバーに解答を送信
const socket = io({ transports: ['websocket'], upgrade: false });
const roomID = 'teacher';
const role = 2
if (roomID) {
        socket.emit('join_room', { roomID, role });
        console.log(`ルーム ${roomID} に参加しました (役割: ${role})`);
} else {
    console.error('ルームIDが指定されていません。');
}
const urlParams = new URLSearchParams(window.location.search);
const room_ID = urlParams.get('name');
const question_text = urlParams.get('question_text');
const options = JSON.parse(urlParams.get('options'));
console.log(options)
// HTML要素を取得
const buttonContainer = document.querySelector(".buttons");

const menuButton = document.querySelector('.menu-button'); // メニューボタンを取得
const sidebar = document.getElementById('sidebar'); // サイドバーを取得
const mainContent = document.querySelector('.main-content'); // メインコンテンツを取得

// メニューボタンのクリックイベント
menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('active'); // サイドバーの表示切り替え
    mainContent.classList.toggle('sidebar-active'); // メインコンテンツの余白調整
});

// ドキュメント全体でクリックされたときの処理
document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
        sidebar.classList.remove('active'); // サイドバーを非表示にする
        mainContent.classList.remove('sidebar-active'); // 余白調整を解除
    }
});

//モーダル関連要素取得
const modal = document.getElementById('confirmationModal');
const overlay = document.getElementById('overlay');
const selectedAnswer = document.getElementById('selectedAnswer');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const textareaContainer = document.querySelector(".textarea-container");
if(options[0] != null){
    options.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
    //選択肢処理
    options.forEach(item => {
        // 確実にString型に変換
        const strItem = String(item);

        // 「:」「：」「；」を「:」に正規化
        const normalizedItem = strItem.replace(/[：；]/g, ":");

        const [left,right] = normalizedItem.split(":")
    
        // ボタンを追加
        const button = document.createElement("button");
        button.textContent = item.trim();
        button.value = left.trim(); // ボタンの値に左側を設定
        buttonContainer.appendChild(button);

        // ボタンクリック時の処理
        button.addEventListener("click", () => {
            currentAnswer = left;
            selectedAnswer.textContent = item.trim();
            modal.style.display = 'block';
            overlay.style.display = 'block';
        });
    });   
}else{
    const button = document.createElement("button");
    textareaContainer.style.display = 'block';

    // テキストエリアの送信ボタンのクリックイベントを設定
    document.getElementById('submitTextAnswer').addEventListener('click', () => {
        const freeText = document.getElementById('freeTextAnswer').value.trim();
        if (freeText === '') {
            alert('回答を入力してください');
            return;
        }

        currentAnswer = freeText;
        selectedAnswer.textContent = freeText;
        modal.style.display = 'block';
        overlay.style.display = 'block';
    });
}

 // モーダルの「はい」ボタン処理
 confirmYes.addEventListener('click', () => {
        alert(`回答を送信しました！`);
        console.log(currentAnswer);
        modal.style.display = 'none';
        overlay.style.display = 'none';
        socket.emit('answer', { answer: currentAnswer });
});

// モーダルの「いいえ」ボタン処理
confirmNo.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
});

// サーバーからの「insert_error」イベントを受け取る
socket.on('insert_error', (message) => {
    console.log("エラー:", message);
    alert(message); // 必要に応じてアラート表示
});

socket.on('end', () => {
    window.confirm("制限時間になりました");
    socket.emit('answer', { answer: "timeup" });
});

// サーバーからの「data_result」イベントを受け取る
socket.on('data_result', (message) => {
    alert(message); // 必要に応じてアラート表示
    window.location.href='kaitou3'
});

//ログアウト処理
async function logout() {
try {
    await new Promise((resolve, reject) => {
        socket.emit('session_destroy', (response) => {
            if (response.success) resolve();
            else reject(response.error);
        });
    });
    // 成功時はログインページにリダイレクト
    window.location.href = '/login';
} catch (error) {
    alert('ログアウトに失敗しました: ' + error);
}
}

socket.on('session_destroy_success', () => {
window.location.href = '/login';
});