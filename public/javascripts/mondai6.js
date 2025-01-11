const socket = io({ transports: ['websocket'], upgrade: false });
const table = document.getElementById("table");
const resultButton = document.getElementById("resultButton");

const room_ID = '<%= name %>';
        const role = 1
        if (room_ID) {
            socket.emit('join_room', { room_ID, role });
            console.log(`ルーム ${room_ID} に参加しました (役割: ${role})`);
        } else {
            console.error('ルームIDが指定されていません。');
        }

 // 正解表示ボタン処理
function displayCorrectAnswer(index) {
  const row = table.rows[index + 1]; 
  const user_ID = row.cells[4].textContent;
  const user_name = row.cells[5].textContent;
  const userAnswer = row.cells[6].textContent;
  var student_data = {
    user_ID:user_ID,
    user_name:user_name,
    userAnswer:userAnswer
  }
  socket.emit('hyou',student_data);
}


// 結果発表ボタン処理
resultButton.addEventListener("click", function () {
  // テーブルのデータを収集
    const tableData = [];
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const rowData = {
            user_ID: row.cells[4].textContent,
            user_name: row.cells[5].textContent,
            user_answer: row.cells[6].textContent,
            result: row.cells[8].textContent.trim() === "○" ? 1 : 0
        };
        tableData.push(rowData);
    }
    socket.emit('result_display', tableData);
});

// 正解追加ボタン処理
/*document.forms.my.tuika.addEventListener('click', function (e) {
    e.preventDefault();
    const selections = [];
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const isChecked = row.cells[9]?.firstChild?.checked;
        if (isChecked) {
            const questionGenre = row.cells[2].textContent;
            const username = row.cells[4].textContent;
            const answer = row.cells[6].textContent;
            selections.push({
                questionGenre,
                username,
                answer,
                result: "○"
            });
        }
    }
    if (selections.length > 0) {
        socket.emit('kaitoutuika', selections);
    }
});

// 正解削除ボタン処理
document.forms.my.sakuzyo.addEventListener('click', function (e) {
    e.preventDefault();
    const deletions = [];
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const isChecked = row.cells[10]?.firstChild?.checked;
        if (isChecked) {
            const questionName = row.cells[2].textContent;
            const answer = row.cells[6].textContent;
            deletions.push({
                questionName,
                answer
            });
        }
    }
    if (deletions.length > 0) {
        socket.emit('kaitousakuzyo', deletions);
    }
});*/

const menuButton = document.querySelector('.menu-icon'); // 正しいハンバーガーメニューのクラス
    const sidebar = document.getElementById('sidebar'); // サイドバー
    const mainContent = document.querySelector('.main-content'); // メインコンテンツ

    // メニューボタンのクリックイベント
    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('active'); // サイドバーの表示切り替え
    });

    // サイドバー以外の領域をクリックしたときに閉じる
    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
            sidebar.classList.remove('active'); // サイドバーを非表示にする
        }
    });

// 戻る処理
function osareta() {
    socket.emit('clear');
}

// サーバーからのリダイレクトイベント
socket.on('modoru', function () {
    window.location.href = '/mondai';
});

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

//セッション削除失敗時エラー処理
socket.on('session_destroy_failed', (error) => {
    alert('ログアウトに失敗しました: ' + error);
});