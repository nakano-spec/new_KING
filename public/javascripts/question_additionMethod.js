function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active'); // activeクラスをトグル
}

// サイドバー以外をクリックしたら閉じる処理
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnMenuIcon = menuIcon.contains(event.target);

    if (!isClickInsideSidebar && !isClickOnMenuIcon) {
        sidebar.classList.remove('active'); // サイドバーを閉じる
    }
});

async function logout() {
    try {
        await new Promise((resolve, reject) => {
            socket.emit('session_destroy', (response) => response.success ? resolve() : reject(response.error));
        });
        navigateTo('/login');
    } catch (error) {
        alert('ログアウトに失敗しました: ' + error);
    }
}

socket.on('session_destroy_success', () => navigateTo('/login'));
socket.on('session_destroy_failed', (error) => alert('ログアウトに失敗しました: ' + error));