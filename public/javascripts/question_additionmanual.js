const socket = io({transports: ['websocket'], upgrade: false});
const optionsContainer = document.getElementById('options-container');
const addOptionBtn = document.getElementById('add-option-btn');
const errorMessage = document.getElementById('error-message');
const zoom = document.querySelectorAll(".zoom");
const zoomback = document.getElementById("zoomback");
const zoomimg = document.getElementById("zoomimg");
const photoInput = document.getElementById('photo-input');

window.addEventListener('load', function(){			
   socket.emit('image_List');		
});

// 画像リスト取得後、パネル内に表示
socket.on('imageList', function(files) {
    console.log('Received image list:', files);
    const imageListContainer = document.getElementById('imageListContainer');
    imageListContainer.innerHTML = ''; // 初期化

    files.forEach(file => {
        const imageItem = document.createElement('div');
        imageItem.classList.add('image-item');

        const img = document.createElement('img');
        img.src = '/images/' + file;
        img.classList.add('zoom')

        const fileName = document.createElement('p');
        fileName.textContent = file; // ファイル名を表示

        imageItem.appendChild(img);
        imageItem.appendChild(fileName);
        imageListContainer.appendChild(imageItem);
    });

    const zoomElements = document.querySelectorAll('.zoom');
    zoomElements.forEach(function(value) {
        value.addEventListener("click", kakudai);
    });
});

socket.on('image_result', function(file) {
    console.log('Received image list:', file);
    const imageListContainer = document.getElementById('imageListContainer');
    imageListContainer.innerHTML = ''; // 初期化
    const imageItem = document.createElement('div');
    imageItem.classList.add('image-item');

    const img = document.createElement('img');
    img.src = '/images/' + file;
    img.classList.add('zoom')

    const fileName = document.createElement('p');
    fileName.textContent = file; // ファイル名を表示

    imageItem.appendChild(img);
    imageItem.appendChild(fileName);
    imageListContainer.appendChild(imageItem);

    const zoomElements = document.querySelectorAll('.zoom');
    zoomElements.forEach(function(value) {
        value.addEventListener("click", kakudai);
    });
});

socket.on('image_error', function(error) {
    console.log(error);
});

// サイドパネルの表示非表示
const imagePanelButton = document.getElementById('imagePanelButton');
const imagePanel = document.getElementById('imagePanel');
let panelOpen = false;

imagePanelButton.addEventListener('click', function() {
    panelOpen = !panelOpen;
    if(panelOpen) {
        imagePanel.classList.add('open');
    } else {
        imagePanel.classList.remove('open');
    }
});

zoom.forEach(function(value) {
    value.addEventListener("click",kakudai);
});

function kakudai(e) {
    zoomback.style.display = "flex";
    zoomimg.setAttribute("src",e.target.getAttribute("src"));
}

zoomback.addEventListener("click",modosu);

function modosu() {
    zoomback.style.display = "none";
}

// 検索ボタン
document.getElementById('search-button').addEventListener('click', function() {
    var searchTerm = document.getElementById('search-box').value;
    if(searchTerm == ''){
        socket.emit('image_List')
    }else{
        socket.emit('search_img', searchTerm);
    }
});

document.getElementById('addChoiceBtn').addEventListener('click', function() {
    const container = document.getElementById('choicesContainer');
    const errorMessage = document.getElementById('error-message');
    if (container.children.length >= 10) {
        errorMessage.textContent = '選択肢は最大10個まで追加できます。';
        return;
    }
    const choiceCount = container.children.length + 1;
    
    const newChoice = document.createElement('div');
    newChoice.className = 'form-group';
    newChoice.innerHTML = `
        <label class="form-label">選択肢${choiceCount}：</label>
        <input type="text" class="form-input" name="choice${choiceCount}" placeholder="例: ア:ネットワーク層">
    `;
    
    container.appendChild(newChoice);
});

document.getElementById('deleteChoiceBtn').addEventListener('click', function() {
    const container = document.getElementById('choicesContainer');
    const errorMessage = document.getElementById('error-message');
    if (container.children.length < 1) {
        errorMessage.textContent = '選択肢はそれ以上消せません。';
        return;
    }
    container.removeChild(container.lastElementChild);
});

function setupPhotoUpload() {
    const dropzone = document.getElementById('photo-dropzone');
    const input = document.getElementById('photo-input');
    const fileList = document.getElementById('photo-file-list').querySelector('ul');

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
        const files = e.dataTransfer.files;
        displayFiles(files);
    });

    dropzone.addEventListener('click', () => {
        input.click();
    });

    input.addEventListener('change', () => {
        const files = input.files;
        displayFiles(files);
    });

    function displayFiles(files) {
        fileList.innerHTML = '';
        for (let i = 0; i < files.length; i++) {
            const li = document.createElement('li');
            li.textContent = files[i].name;
            fileList.appendChild(li);
        }
    }
}

setupPhotoUpload();

document.getElementById('questionForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const form = document.getElementById('questionForm');
    const requiredElements = form.querySelectorAll('[required]');
    const choicesContainer = document.getElementById('choicesContainer');
    const choiceInputs = choicesContainer.querySelectorAll('input[name^="choice"]');

    let hasError = false;
    let errorMessage = '';

    requiredElements.forEach(elem => {
        if (!elem.value.trim()) {
            hasError = true;
            errorMessage = '未入力項目があります。すべての必須項目を入力してください。';
        }
    });

    // 選択肢の形式チェック（「:」が含まれていることだけを確認）
    if (!hasError) {
        choiceInputs.forEach(input => {
            const value = input.value.trim();
            if (value !== '' && !/.+[:：].+/.test(value)) { // 空でなければ形式チェック
                hasError = true;
                errorMessage = '選択肢は「内容:内容」の形式で入力してください。';
            }
        });
    }

    // エラーチェック
    if (hasError) {
        window.alert(`入力エラー: ${errorMessage}`);
        return;
    }

    const file2 = photoInput.files[0];

    if (!file2) {
    }else{
        console.log(file2);
    }


    // 全て入力済みの場合、入力内容を取得して表示する
    const formData = new FormData(form);
    let resultText = "以下の内容で問題を追加しますか？\n\n";

    // テキスト項目の表示
    for (let [key, value] of formData.entries()) {
        resultText += `${key}: ${value}\n`;
    }

    // 写真ファイルリストを取得
    const fileListUl = document.querySelector('#photo-file-list ul');
    if (fileListUl && fileListUl.children.length > 0) {
        resultText += "\nアップロードされた写真ファイル:\n";
        for (let li of fileListUl.children) {
            resultText += `- ${li.textContent}\n`;
        }
    }

    // 全部表示して確認
    const confirmResult = window.confirm(resultText);

    if(confirmResult) {
        // ここでサーバーに送信する処理などを行う
        const formObject = Object.fromEntries(formData.entries());
        socket.emit('question_add', formObject);
        alert('問題を登録しました。');
        console.log("フォームデータの内容:", formObject);
    } else {
        // キャンセルした場合何もしない
    }
});

socket.on('complete',async function(complete){
    const file = photoInput.files[0];

    if (file) {
        const formData2 = new FormData();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const newFile = new File([file], sanitizedFileName, { type: file.type });
        formData2.append('images', newFile);
        for (let [key, value] of formData2.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            $.ajax({
                url: '/upload', // 相対パスを使用
                method: 'POST',
                data: formData2,
                processData: false,
                contentType: false
            }).done(function(res){
                console.log(res);
                alert(`アップロード成功!`);
                window.location.href = '/Question_manage';
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

const menuButton = document.querySelector('.menu-icon'); // メニューボタンを取得
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