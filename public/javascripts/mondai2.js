//セッションチェック三銃士
window.addEventListener('load',function(){
    socket.emit('checksession',"mondai2.ejs");//現在いるページを引数として送る
})

socket.on('session_OK',function(data){
    console.log(data);
})

socket.on('session_error',function(data){
    console.log(data);
    window.location.href = '/login';//失敗時はログインページに遷移（セッション破棄済み）
})
//三銃士ここまで

$(document).ready(() => $('.select2').select2());

const form = document.forms.f1;
const menuButton = document.getElementById('hambtn');
const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const room_ID = '<%= name %>';

  // モーダル関連の変数を取得
const modal = document.getElementById("preview-modal");
const previewButton = document.getElementById("preview-button");
const closeButton = document.querySelector(".close-button");

document.addEventListener('DOMContentLoaded', function() {
    // 「問題の新規追加」ボタンを取得
    const addProblemButton = document.getElementById('add-problem');
    
    // ボタンが存在する場合にイベントリスナーを追加
    if (addProblemButton) {
        addProblemButton.addEventListener('click', function() {
            // 遷移先のURLを指定（必要に応じて変更してください）
             window.location.href = '/question_select'
        });
    }
});

//ルームの部屋
socket.on('room_participants',async function(participants){
    console.log('参加者リストを受信:', participants);
})

//メニュー処理
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

// プレビューボタンがクリックされたときにモーダルを表示
if (previewButton) {
    previewButton.addEventListener("click", function() {
        // セレクトボックスの値を取得
        const selectedQualification = $('#qualification-select').val();
        const selectedYear = $('#year-select').val();
        const selectedQuestion = $('#question-select').val();
        const selectedGenre = $('#genre-select').val();

        if (!selectedQualification || !selectedYear || !selectedQuestion || !selectedGenre) {
            alert("すべてのセレクトボックスを選択してください。");
            return;
        }

        // クライアントからサーバーへプレビューリクエストを送信
        socket.emit('preview_request', {
            qualification: selectedQualification,
            year: selectedYear,
            question: selectedQuestion,
            genre: selectedGenre
        });
    });
}

// サーバーからのプレビュー応答を受信
socket.on('preview_response', (data) => {
    if (data) {
        console.log(data)
        // モーダル内の画像を更新
        const pictureDiv = modal.querySelector('.picture img');
        if (data[0].pics_name != '') {
            pictureDiv.src = '/images/' + data[0].pics_name;
        } else {
            pictureDiv.src = '/images/noImage.jpg'; // デフォルト画像
        }

        // モーダル内の問題文を更新
        const questionTextDiv = modal.querySelector('.question-text');
        questionTextDiv.textContent = data[0].question_text || '問題文がありません。';

        // モーダル内の選択肢を更新
        const optionsDiv = modal.querySelector('.select');
        optionsDiv.innerHTML = ''; // 既存の選択肢をクリア
        let optionsArray = [];

        if (Array.isArray(data.options)) {
            console.log("array")
            optionsArray = data.options;
        } else if (typeof data[0].options === 'string' && data[0].options.trim() !== '') {
            console.log("array2")
            optionsArray = data[0].options.split(', ');
        }

        if (optionsArray.length > 0) {
            const ul = document.createElement('ul');
            ul.classList.add('options-list');
            optionsArray.forEach(option => {
                const li = document.createElement('li');
                li.classList.add('option');
                li.textContent = option;
                ul.appendChild(li);
            });
            optionsDiv.appendChild(ul);
        } else {
            optionsDiv.innerHTML = '<p>選択肢がありません。</p>';
        }

        // モーダルを表示
        modal.style.display = "block";
    } else {
        alert('プレビューの取得に失敗しました: ' + data.message);
    }
});

// 閉じるボタンがクリックされたときにモーダルを非表示
if (closeButton) {
    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });
}

// モーダルの外側をクリックしたときにモーダルを非表示
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

$('#qualification-select').on('select2:select', function(e) {
    const selectedQualification = e.params.data.id;
    console.log("選択された試験名:", selectedQualification);

    if (selectedQualification) {
        socket.emit('request_data', { qualification_name: selectedQualification });
    }
});

$('#year-select').on('select2:select', function(e) {
    const selectedyear = e.params.data.id;
    console.log("選択された年度:", selectedyear);

    if (selectedyear) {
        socket.emit('request_name', { qualification_name: selectedyear });
    }
});

$('#question-select').on('select2:select', function(e) {
    const selectedquestionname = e.params.data.id;
    console.log("選択された問題:", selectedquestionname);

    if (selectedquestionname) {
        socket.emit('request_genre', { qualification_name: selectedquestionname });
    }
});

//問題送信
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const timeLimit = form.time2.value;
    if (!timeLimit || isNaN(timeLimit)) return alert("制限時間が入力されていません。");

    socket.emit('search_room');
});

socket.on('room_IDget', room_ID => {
    // 各セレクトボックスの選択された値を取得
    const selectedQualification = document.getElementById('qualification-select').value;
    const selectedYear = document.getElementById('year-select').value;
    const selectedQuestion = document.getElementById('question-select').value;
    const selectedGenre = document.getElementById('genre-select').value;

    // タイマーの分と秒を取得
    const minute = document.getElementById('time').value;
    const second = document.getElementById('time2').value;

    // データをまとめる
    const data = {
        room_ID: room_ID,
        qualification: selectedQualification,
        year: selectedYear,
        question: selectedQuestion,
        genre: selectedGenre,
        timer: {
            minute: minute || 0, // 入力が空の場合は0
            second: second || 0
        }
    };
    console.log(data);
    socket.emit('mondai_btnclick', data);
});

// 教師ページでタイマー情報を受け取る
socket.on('timer_data', async function(data) {
    try{
         const question_ID = data.question_ID;
         const room_ID = data.room_ID;
         const limit_time = data.limit_time;
         const queryString = `?question_ID=${encodeURIComponent(question_ID)}&room_ID=${encodeURIComponent(room_ID)}&limit_time=${encodeURIComponent(limit_time)}`;
         const newWin = window.open(`/question_view${queryString}`, '_blank');
         window.location.href = `/mondai2${queryString}`;
    }catch(error){
        alert(error);
    }
});

function updateSelect(selectId, data, property) {
    console.log("セレクトボックス更新開始:", selectId);
    const select = document.getElementById(selectId);
    if (!select) {
        console.error(`セレクトボックスが見つかりません: ${selectId}`);
        return;
    }
    select.innerHTML = '';
    // デフォルトオプションを追加
    select.add(new Option(`(選択してください)`, ""));
    
    // ユニークな値を抽出するためのSetを使用
    const uniqueValues = new Set();
    data.forEach(item => {
        const value = item[property];
        if (value && !uniqueValues.has(value)) { // 値が存在し、未登録の場合
            uniqueValues.add(value);
            const option = new Option(value, value);
            select.add(option);
        }
    });
    
    // select2の再初期化
    $(`#${selectId}`).trigger('change.select2');
    console.log("セレクトボックス更新完了:", selectId);
}




socket.on('qualificationData', data => updateSelect('year-select', data, 'question_years'));
socket.on('questionname', data => updateSelect('question-select', data, 'question_name'));
socket.on('questiongenre', data => updateSelect('genre-select', data, 'question_genre'));

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

//セッション削除失敗時エラー処理
socket.on('session_destroy_failed', (error) => {
    alert('ログアウトに失敗しました: ' + error);
});

//セッション削除失敗時エラー処理
socket.on('question_error', () => {
  alert('問題が見つかりませんでした。');
});


//サニタイズ処理
function sanitize(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
}