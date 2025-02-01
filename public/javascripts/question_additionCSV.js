const socket = io({ transports: ['websocket'], upgrade: false });
const sendButton = document.getElementById('send-csv-button');
// サイドパネル関連
const zoom = document.querySelectorAll(".zoom");
const zoomback = document.getElementById("zoomback");
const zoomimg = document.getElementById("zoomimg");
let selectedPhotos = []; 
let selectedFile = null;


// 初期ロード時に画像リストを取得
window.addEventListener('load', function () {
    socket.emit('image_List');
});

// 画像リストを受信して表示
socket.on('imageList', function (files) {
    console.log('Received image list:', files);
    const imageListContainer = document.getElementById('imageListContainer');
    imageListContainer.innerHTML = ''; // 初期化

    files.forEach(file => {
        const imageItem = document.createElement('div');
        imageItem.classList.add('image-item');

        const img = document.createElement('img');
        img.src = '/images/' + file;
        img.classList.add('zoom');

        const fileName = document.createElement('p');
        fileName.textContent = file; // ファイル名を表示

        imageItem.appendChild(img);
        imageItem.appendChild(fileName);
        imageListContainer.appendChild(imageItem);
    });

    const zoomElements = document.querySelectorAll('.zoom');
    zoomElements.forEach(value => {
        value.addEventListener("click", kakudai);
    });
});

// サイドパネルの表示非表示
const imagePanelButton = document.getElementById('imagePanelButton');
const imagePanel = document.getElementById('imagePanel');
let panelOpen = false;

imagePanelButton.addEventListener('click', function () {
    panelOpen = !panelOpen;
    panelOpen ? imagePanel.classList.add('open') : imagePanel.classList.remove('open');
});

// 拡大表示処理
zoom.forEach(value => {
    value.addEventListener("click", kakudai);
});

function kakudai(e) {
    zoomback.style.display = "flex";
    zoomimg.setAttribute("src", e.target.getAttribute("src"));
}

zoomback.addEventListener("click", modosu);

function modosu() {
    zoomback.style.display = "none";
}

// CSVテンプレートファイルのダウンロード
const downloadButton = document.getElementById('downloadButton');

downloadButton.addEventListener('click', () => {
    socket.emit('reqquestionFile');
});

socket.on('question_Data', (file) => {
    const blob = new Blob([file.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileName; // ファイル名指定
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
});

// ドラッグ＆ドロップ処理
document.addEventListener("DOMContentLoaded", () => {
    const dropzone = document.getElementById('csv-dropzone');
    const csvInput = document.getElementById('csv-input');
    const fileList = document.getElementById('csv-file-list').querySelector('ul');

    // ドラッグ＆ドロップ処理のセットアップ（写真）
    const photoDropzone = document.getElementById('photo-dropzone');
    const photoInput = document.getElementById('photo-input');
    const photoFileList = document.getElementById('photo-file-list').querySelector('ul');

    setupDragAndDrop(photoDropzone, photoInput, handlePhotoSelection);

    function handlePhotoSelection(files) {
        photoFileList.innerHTML = '';
        selectedPhotos = Array.from(files); // ファイルリストを配列に変換して保存
        selectedPhotos.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file.name;
            photoFileList.appendChild(li);
        });
    }


    setupDragAndDrop(dropzone, csvInput, handleFileSelection);

    function setupDragAndDrop(dropzone, input, fileHandler) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            fileHandler(e.dataTransfer.files);
        });

        dropzone.addEventListener('click', () => {
            input.click();
        });

        input.addEventListener('change', () => {
            fileHandler(input.files);
        });
    }

    function handleFileSelection(files) {
        fileList.innerHTML = '';
        if (files.length > 0) {
            selectedFile = files[0];
            const li = document.createElement('li');
            li.textContent = selectedFile.name;
            fileList.appendChild(li);
        }
    }
});

sendButton.addEventListener('click',async function(){
    if (!selectedFile) {
        if (selectedPhotos.length > 0) {
            const formData = new FormData();
           // 写真ファイルを1つずつFormDataに追加
            selectedPhotos.forEach((file) => {
                const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_'); // ファイル名のサニタイズ
                const newFile = new File([file], sanitizedFileName, { type: file.type });
                formData.append('images', newFile);
            });
    
            console.log('アップロードする写真:', selectedPhotos);
            try {
                $.ajax({
                    url: '/upload', // 相対パスを使用
                    method: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false
                }).done(function(res){
                    alert('写真がアップロードされました！');
                    window.location.href = "/Question_manage";
                }).fail(function(err){
                    console.log(err);
                    alert(`アップロードエラー: ${err.responseJSON.message || '不明なエラーが発生しました。'}`);
                });
            } catch (error) {
                console.error('アップロードエラー:', error);
            }
        } else {
            alert('CSVファイルまたは写真を選択してください。');
        }
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        socket.emit('upload_csv', {
            fileName: selectedFile.name,
            content: e.target.result,
        });
    };
    reader.readAsText(selectedFile);
});

// メニューボタンとサイドバー操作
const menuButton = document.querySelector('.menu-icon');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');

menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('sidebar-active');
});

document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('sidebar-active');
    }
});

// 検索ボタン
document.getElementById('search-button').addEventListener('click', function () {
    const searchTerm = document.getElementById('search-box').value;
    console.log('開始しました。')
    searchTerm === '' ? socket.emit('image_List') : socket.emit('search_img', searchTerm);
});

// 画像検索結果を受信
socket.on('image_result', function (file) {
    const imageListContainer = document.getElementById('imageListContainer');
    imageListContainer.innerHTML = ''; // 初期化
    const imageItem = document.createElement('div');
    imageItem.classList.add('image-item');

    const img = document.createElement('img');
    img.src = '/images/' + file;
    img.classList.add('zoom');

    const fileName = document.createElement('p');
    fileName.textContent = file; // ファイル名を表示

    imageItem.appendChild(img);
    imageItem.appendChild(fileName);
    imageListContainer.appendChild(imageItem);

    const zoomElements = document.querySelectorAll('.zoom');
    zoomElements.forEach(value => {
        value.addEventListener("click", kakudai);
    });
});

// エラー処理
socket.on('image_error', function (error) {
    alert(error);
});

// エラー処理
socket.on('error', function (error) {
    alert(error);
});

// ログアウト処理
async function logout() {
    try {
        await new Promise((resolve, reject) => {
            socket.emit('session_destroy', (response) => {
                if (response.success) resolve();
                else reject(response.error);
            });
        });
        window.location.href = '/login';
    } catch (error) {
        alert('ログアウトに失敗しました: ' + error);
    }
}

// サーバーからのレスポンス処理
socket.on('file_upload_Complete',async function(){
    alert('問題登録が完了しました！');
    if (selectedPhotos.length > 0) {
        const formData = new FormData();
       // 写真ファイルを1つずつFormDataに追加
        selectedPhotos.forEach((file) => {
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_'); // ファイル名のサニタイズ
            const newFile = new File([file], sanitizedFileName, { type: file.type });
            formData.append('images', newFile);
        });

        console.log('アップロードする写真:', selectedPhotos);
        try {
            $.ajax({
                url: '/upload', // 相対パスを使用
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false
            }).done(function(res){
                alert('写真がアップロードされました！');
                window.location.href = "/Question_manage";
            }).fail(function(err){
                console.log(err);
                alert(`アップロードエラー: ${err.responseJSON.message || '不明なエラーが発生しました。'}`);
            });
        } catch (error) {
            console.error('アップロードエラー:', error);
        }
    } else {
        //alert('アップロードする写真がありません。');
        window.location.href = '/Question_manage';
    }
})

socket.on('session_destroy_success', () => {
    window.location.href = '/login';
});

// セッションチェック三銃士
window.addEventListener('load', function () {
    socket.emit('checksession', "question_additionCSV.ejs"); // 現在いるページを引数として送る
});

socket.on('session_OK', function (data) {
    console.log(data);
});

socket.on('session_error', function (data) {
    console.log(data);
    window.location.href = '/login'; // 失敗時はログインページに遷移（セッション破棄済み）
});
// 三銃士ここまで
