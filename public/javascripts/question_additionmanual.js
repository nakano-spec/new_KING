const socket = io({ transports: ['websocket'], upgrade: false });
const optionsContainer = document.getElementById('options-container');
const addOptionBtn = document.getElementById('add-option-btn');
const errorMessage = document.getElementById('error-message');
const zoom = document.querySelectorAll(".zoom");
const zoomback = document.getElementById("zoomback");
const zoomimg = document.getElementById("zoomimg");
const photoInput = document.getElementById('photo-input');
// メニューボタンとサイドバー操作
const menuButton = document.querySelector('.menu-icon');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');
let selectedPhotos = [];

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

// 初期ロード時に画像リストを取得
window.addEventListener('load', function () {
    socket.emit('image_List');
});

// 画像リストを受信して表示
socket.on('imageList', function (files) {
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

// 検索ボタン
document.getElementById('search-button').addEventListener('click', function () {
    const searchTerm = document.getElementById('search-box').value;
    console.log('開始しました。')
    searchTerm === '' ? socket.emit('image_List') : socket.emit('search_img', searchTerm);
});

// 選択肢の追加と削除
document.getElementById('addChoiceBtn').addEventListener('click', function () {
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

document.getElementById('deleteChoiceBtn').addEventListener('click', function () {
    const container = document.getElementById('choicesContainer');
    const errorMessage = document.getElementById('error-message');
    if (container.children.length < 1) {
        errorMessage.textContent = '選択肢はそれ以上消せません。';
        return;
    }
    container.removeChild(container.lastElementChild);
});

// 写真のアップロード設定
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
        displayFiles(e.dataTransfer.files);
    });

    dropzone.addEventListener('click', () => {
        input.click();
    });

    input.addEventListener('change', () => {
        displayFiles(input.files);
    });

    function displayFiles(files) {
        fileList.innerHTML = '';
        for (let file of files) {
            const li = document.createElement('li');
            selectedPhotos = Array.from(files);
            li.textContent = file.name;
            fileList.appendChild(li);
        }
        console.log(selectedPhotos);
    }
}

setupPhotoUpload();

// フォームの送信処理
document.getElementById('questionForm').addEventListener('submit', function (event) {
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

    if (!hasError) {
        choiceInputs.forEach(input => {
            const value = input.value.trim();
            if (value !== '' && !/.+[:：].+/.test(value)) {
                hasError = true;
                errorMessage = '選択肢は「選択肢:内容」の形式で入力してください。';
            }
        });
    }

    if (!hasError && choiceInputs.length > 0) {
        const correctAnswer = form.querySelector('input[name="correct"]').value.trim();
        const choiceValues = Array.from(choiceInputs)
        .map(input => input.value.trim())
        .filter(value => value !== ''); // 空の選択肢を除外

        if (choiceValues.length === 0) {
        }else if (!choiceValues.includes(correctAnswer)) {
            hasError = true;
            errorMessage = '正解が選択肢内に存在しません。';
        }
    }

    if (hasError) {
        window.alert(`入力エラー: ${errorMessage}`);
        return;
    }

    const formData = new FormData(form);
    socket.emit('question_add', Object.fromEntries(formData.entries()));
});

socket.on('complete', () => {
    alert('問題追加が完了しました。');
    if (selectedPhotos.length > 0) {
        const formData = new FormData();
       // 写真ファイルを1つずつFormDataに追加
        selectedPhotos.forEach((file) => {
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_'); // ファイル名のサニタイズ
            const newFile = new File([file], sanitizedFileName, { type: file.type });
            formData.append('images', newFile);
        });

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
});

socket.on('error', () => {
  alert('問題追加に失敗しました。');
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

socket.on('session_destroy_success', () => {
    window.location.href = '/login';
});
