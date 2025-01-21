var socket = io();
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