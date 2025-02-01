const socket = io({ transports: ['websocket'], upgrade: false });

// 選択肢追加・削除関連要素
const optionsContainer = document.getElementById('options-container');
const addOptionBtn = document.getElementById('add-option-btn');
const errorMessage = document.getElementById('error-message');

// 拡大表示関連要素
const zoom = document.querySelectorAll(".zoom");
const zoomback = document.getElementById("zoomback");
const zoomimg = document.getElementById("zoomimg");

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

// 更新結果
socket.on('update_result', function () {
    alert('更新に成功しました！')
    window.location.href = "/Question_manage";
});

socket.on('update_error', function () {
    alert("更新に失敗しました。");
});

// 写真リスト検索ボタン
document.getElementById('search-button').addEventListener('click', function () {
    const searchTerm = document.getElementById('search-box').value;
    searchTerm === '' ? socket.emit('image_List') : socket.emit('search_img', searchTerm);
});

// 検索結果表示
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

socket.on('image_error', function (error) {
    console.error(error);
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

// 選択肢追加処理
addOptionBtn.addEventListener('click', () => {
    const currentOptions = optionsContainer.querySelectorAll('.option-group');
    if (currentOptions.length >= 10) {
        errorMessage.textContent = '選択肢は最大10個まで追加できます。';
        return;
    }
    errorMessage.textContent = ''; // エラーメッセージをクリア

    const newOptionIndex = currentOptions.length + 1;
    const newOption = document.createElement('div');
    newOption.className = 'form-group option-group';
    newOption.innerHTML = `
        <label class="form-label">選択肢${newOptionIndex}：</label>
        <input type="text" class="form-input" name="options[]">
    `;
    optionsContainer.appendChild(newOption);
});

// 選択肢削除処理
document.getElementById('deleteChoiceBtn').addEventListener('click', function () {
    const currentOptions = optionsContainer.querySelectorAll('.option-group');
    if (currentOptions.length < 1) {
        errorMessage.textContent = '選択肢はそれ以上消せません。';
        return;
    }
    optionsContainer.removeChild(optionsContainer.lastElementChild);
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
