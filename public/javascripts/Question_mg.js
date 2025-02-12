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

document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target)) {
        menuDropdown.classList.remove('active');
    }
});

// 新規作成ボタン
document.getElementById('add-button').addEventListener('click', function() {
    window.location.href = '/question_select';
});

// 編集ボタン
document.getElementById('edit-button').addEventListener('click', function() {
    var selectedRadio = document.querySelector('input[name="select"]:checked');
    if (selectedRadio) {
        window.location.href = `/question_edit?question_ID=${selectedRadio.value}`;
    } else {
        alert('問題を選択してください。');
    }
});

// 削除ボタン
document.getElementById('delete-button').addEventListener('click', function() {
    var selectedRadio = document.querySelector('input[name="select"]:checked');
    if (selectedRadio) {
        console.log(selectedRadio.value);
        socket.emit('question_delete', selectedRadio.value);
    } else {
        alert('問題を選択してください。');
    }
});

socket.on('question_Complete', function() {
    window.location.reload();
});

socket.on('delete_result',function(){
    alert("削除が完了しました。");
    window.location.href='/Question_manage';
})

// 検索ボタン
document.getElementById('reset-button').addEventListener('click', function() {
    window.location.href = '/Question_manage?page=1';
});

socket.on('question', function(results) {
    updateTable(results);
});

function updateTable(data) {
    var tbody = document.querySelector('#select-form tbody');
    tbody.innerHTML = ''; // テーブルの現在の内容をクリア

    data.forEach(function(question) {
        var tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="radio" name="select" value="${question.question_ID}"></td>
            <td class="ellipsis" onclick="toggleText(this)">${question.qualification_name}</td>
            <td class="ellipsis" onclick="toggleText(this)">${question.question_genre}</td>
            <td class="ellipsis" onclick="toggleText(this)">${question.question_years}</td>
            <td class="ellipsis" onclick="toggleText(this)">${question.question_name}</td>
            <td class="ellipsis" onclick="toggleText(this)">${question.question_text}</td>
            <td class="ellipsis" onclick="toggleText(this)">${question.options}</td>
            <td class="ellipsis" onclick="toggleText(this)">${question.pics_name}</td>
            <td class="ellipsis" onclick="toggleText(this)">${question.correct}</td>
        `;
        tbody.appendChild(tr);
    });
}

function toggleText(element) {
    element.classList.toggle('ellipsis');
}

async function logout() {
    try {
        await new Promise((resolve, reject) => {
            socket.emit('session_destroy', (response) => response.success ? resolve() : reject(response.error));
        });
        window.location.href = '/login';
    } catch (error) {
        alert('ログアウトに失敗しました: ' + error);
    }
}

socket.on('session_destroy_success', () => navigateTo('/login'));
socket.on('session_destroy_failed', (error) => alert('ログアウトに失敗しました: ' + error));