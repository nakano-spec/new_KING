const table = document.getElementById("table");
const resultButton = document.getElementById("resultButton");
const addButtons = document.querySelectorAll('.checkbox-add'); // 正解追加のチェックボックス
const deleteButtons = document.querySelectorAll('.checkbox-delete'); // 正解削除のチェックボックス

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
    socket.emit('result_display');
});

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

// 正解追加ボタン処理
document.querySelector('.add-button').addEventListener('click', function () {
  const selections = [];
  for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const isChecked = row.cells[9]?.querySelector('input[type="radio"].radio-add:checked'); // ラジオボタンが選択されているか
      if (isChecked) {
          const question_ID = row.cells[2].textContent; // 問題ID (適切なセルインデックスに調整)
          const answer = row.cells[6].textContent; // 解答
          selections.push({
              question_ID,
              answer,
          });
      }
  }
  // サーバーに送信
  socket.emit('add_correct_answer', selections);
});

// 正解削除ボタン処理
document.querySelector('.delete-button').addEventListener('click', function () {
  const deletions = [];
  for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const isChecked = row.cells[10]?.querySelector('input[type="radio"].radio-delete:checked'); // ラジオボタンが選択されているか
      if (isChecked) {
          const question_ID = row.cells[2].textContent; // 問題ID (適切なセルインデックスに調整)
          const answer = row.cells[6].textContent; // 解答
          deletions.push({
              question_ID,
              answer,
          });
      }
  }
  console.log(deletions);
  socket.emit('delete_correct_answer', deletions);
});

socket.on('corrected_answers', () => {
 window.location.href="/mondai3"
});

socket.on('corrected_answers_error', () => {
  alert("失敗しました。");
});

socket.on('delete_answers', () => {
 window.location.href="/mondai3"
});

socket.on('delete_answers_error', () => {
  alert("失敗しました。");
});

//セッションチェック三銃士
window.addEventListener('load',function(){
    socket.emit('checksession',"mondai6.ejs");//現在いるページを引数として送る
})

socket.on('session_OK',function(data){
    console.log(data);
})

socket.on('session_error',function(data){
    console.log(data);
    window.location.href = '/login';//失敗時はログインページに遷移（セッション破棄済み）
})
//三銃士ここまで