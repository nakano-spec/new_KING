var socket = io();
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const uploadButton = document.getElementById('upload_button');

const downloadButton = document.getElementById('downloadButton');

    
const menuButton = document.querySelector('.menu-button'); // ハンバーガーメニュー
const sidebar = document.getElementById('sidebar'); // サイドバー
const mainContent = document.querySelector('.main-content'); // メインコンテンツ

menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('active'); // サイドバーの表示/非表示を切り替え
    mainContent.classList.toggle('sidebar-active'); // メインコンテンツの調整
});

document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
        sidebar.classList.remove('active'); // サイドバーを非表示
        mainContent.classList.remove('sidebar-active'); // メインコンテンツ調整を解除
    }
});

//セッションチェック三銃士
window.addEventListener('load',function(){
    socket.emit('checksession',"account_edit.ejs");//現在いるページを引数として送る
})

socket.on('session_OK',function(data){
    console.log(data);
})

socket.on('session_error',function(data){
    console.log(data);
    window.location.href = '/login';//失敗時はログインページに遷移（セッション破棄済み）
})
//三銃士ここまで

downloadButton.addEventListener('click', () => {
    // サーバーにファイル送信リクエストを送る
    console.log("start")
    socket.emit('requestFile');
});

// サーバーからデータを受信
socket.on('fileData', (file) => {
    const blob = new Blob([file.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // ダウンロードリンクを生成してクリック
    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileName; // ファイル名指定
    document.body.appendChild(a);
    a.click();

    // 後片付け
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
});

// エラーハンドリング
socket.on('fileError', (message) => {
    alert(message);
});

// ドラッグ＆ドロップエリアのイベントハンドラ
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

// クリックでファイル選択
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    if (files.length === 0) return;

    const file = files[0];
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        fileName.textContent = file.name;
        uploadButton.disabled = false;

        uploadButton.addEventListener('click', () => {
            const reader = new FileReader();
            reader.onload = function(event) {
                socket.emit('file_upload', { fileName: file.name, data: event.target.result });
            };
            reader.onerror = function() {
                alert("ファイルの読み込みに失敗しました。");
            };
            reader.readAsText(file);
        });
    } else {
        alert('CSVファイルのみアップロード可能です。');
        fileName.textContent = '選択されていません';
        uploadButton.disabled = true;
    }
}

// アップロード完了通知
socket.on('file_upload_Complete', () => {
    alert('ファイルが正常にアップロードされました。');
    window.location.href = '/account_list';
});

// アップロード完了通知
socket.on('insert_error', (error) => {
    alert(error);
});

// アップロード完了通知
socket.on('file_upload_Error', (error) => {
    alert(error);
});

async function logout() {
    try {
        await new Promise((resolve, reject) => {
            socket.emit('session_destroy', (response) => response.success ? resolve() : reject(response.error));
        });
        window.location.href = '/'
    } catch (error) {
        alert('ログアウトに失敗しました: ' + error);
    }
}

socket.on('session_destroy_success', () => navigateTo('/login'));
socket.on('session_destroy_failed', (error) => alert('ログアウトに失敗しました: ' + error));