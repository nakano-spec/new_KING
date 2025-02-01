const socket = io();
const menuButton = document.querySelector('.menu-button'); // ハンバーガーメニュー
const sidebar = document.getElementById('sidebar'); // サイドバー
const mainContent = document.querySelector('.main-content'); // メインコンテンツ

// メニューボタンのクリックイベント
menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('active'); // サイドバーの表示/非表示を切り替え
    mainContent.classList.toggle('sidebar-active'); // メインコンテンツの調整
});

// ドキュメント全体のクリックイベント
document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
        sidebar.classList.remove('active'); // サイドバーを非表示
        mainContent.classList.remove('sidebar-active'); // メインコンテンツ調整を解除
    }
});

// 元の学籍番号を保持（ページロード時に取得）
console.log(originalUserId);

// 保存ボタンのクリックイベント
document.getElementById('saveButton').addEventListener('click', (e) => {
    e.preventDefault();

    const userId = document.getElementById('user-id').value;
    const userName = document.getElementById('user-name').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('role-name').value;

    // パスワード確認
    if (password !== confirmPassword) {
        alert('パスワードが一致しません');
        return;
    }

    const accountData = {
        original_user_ID: originalUserId,
        original_role_name: originalrolename,
        user_ID: userId,
        user_name: userName,
        password: password,
        role_name: role
    };

    // サーバーへアカウント更新イベントを送信
    socket.emit('account_update', accountData);
});

// 更新成功時の処理
socket.on('account_update_success', () => {
    alert('ユーザー情報が更新されました');
    window.location.href = '/account_list';
});

// 更新エラー時の処理
socket.on('account_update_error', (error) => {
    alert(`エラー: ${error.message}`);
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

// セッションチェック三銃士
window.addEventListener('load', function () {
    socket.emit('checksession', "account_edit.ejs"); // 現在いるページを引数として送る
});

socket.on('session_OK', function (data) {
    console.log(data);
});

socket.on('session_error', function (data) {
    console.log(data);
    window.location.href = '/login'; // 失敗時はログインページに遷移（セッション破棄済み）
});
