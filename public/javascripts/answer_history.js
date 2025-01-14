var socket = io({ transports: ['websocket'], upgrade: false });

// メニューの動作
const menuButton = document.getElementById('hambtn');
const sidebar = document.getElementById('sidebar');
//const menuButton = document.getElementById('menu-button');
const menuDropdown = document.getElementById('menu-dropdown');

menuButton.addEventListener('click', () => toggleSidebar());
document.addEventListener('click', (event) => closeSidebarOnOutsideClick(event));

// メニューの開閉
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

function closeSidebarOnOutsideClick(event) {
    if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
        sidebar.classList.remove('active');
    }
}

menuButton.addEventListener('click', () => {
    menuDropdown.classList.toggle('active');
});

// 日本形式にフォーマットする関数
function formatToJapaneseDateTime(isoDate) {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Tokyo' };
    return new Intl.DateTimeFormat('ja-JP', options).format(date);
}

// ログ時間のフォーマットを更新
document.querySelectorAll('.log-time').forEach(cell => {
    const originalTime = cell.textContent; // ISO形式の値
    cell.textContent = formatToJapaneseDateTime(originalTime); // 日本形式に変換
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

// 検索ボタン
document.getElementById('search-button').addEventListener('click', function() {
    const searchTerm = document.getElementById('search-box').value.trim(); // 空白をトリム
    console.log(searchTerm)
    socket.emit('search_history', searchTerm);
});

socket.on('history', function(results) {
    updateTable(results);
});

function updateTable(data) {
    const tbody = document.querySelector('table tbody'); // テーブルの tbody 要素を取得
    tbody.innerHTML = ''; // 現在の内容をクリア

    // 新しいデータをテーブルに挿入
    data.forEach(function(row) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.student}</td>
            <td>${row.question_name}</td>
            <td>${row.student_answer}</td>
           <td>${row.result === 1 ? '○' : '✕'}</td> <!-- ○ または ✕ -->
            <td class="log-time">${row.log_time}</td>
        `;
        tbody.appendChild(tr);
    });

    // 日付フォーマットを適用
    document.querySelectorAll('.log-time').forEach(cell => {
        const originalTime = cell.textContent; // ISO形式の値
        cell.textContent = formatToJapaneseDateTime(originalTime); // 日本形式に変換
    });
}