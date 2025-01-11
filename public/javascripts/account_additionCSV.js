var socket = io();
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const uploadButton = document.getElementById('upload_button');

const downloadButton = document.getElementById('downloadButton');

downloadButton.addEventListener('click', () => {
    // サーバーにファイル送信リクエストを送る
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