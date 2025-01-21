// セッションチェック三銃士
var socket = io();
window.addEventListener('load', function () {
    socket.emit('checksession', "account_addition.ejs"); // 現在いるページを引数として送る
});

socket.on('session_OK', function (data) {
    console.log(data);
});

socket.on('session_error', function (data) {
    console.log(data);
    window.location.href = '/login'; // 失敗時はログインページに遷移（セッション破棄済み）
});
// 三銃士ここまで

const menuButton = document.getElementById('hambtn');
const sidebar = document.getElementById('sidebar');

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

$(document).ready(function () {
    var socket = io();

    // 権限選択
    $('.role-option').click(function () {
        $('.role-option').removeClass('selected');
        $(this).addClass('selected');
        $('#role-error').hide();
        $('#room_select_container').toggle($(this).data('role') === 'teacher');
    });

    // フォームのバリデーション
    $('#userForm').on('submit', function (e) {
        e.preventDefault();
        var isValid = validateForm();

        if (isValid) {
            var data = gatherFormData();
            socket.emit('Add_user_manually', data);
        }
    });

    socket.on('Add_user_manually_Complete', function () {
        alert('ユーザーを追加しました！');
        window.location.href = '/account_list';
    });

    socket.on('insert_error', function (error) {
        alert(error);
    });

    // 戻るボタン
    $('.btn-back').click(function () {
        history.back();
    });

    function validateForm() {
        let isValid = true;

        if (!$('#username').val()) {
            showError('username-error');
            isValid = false;
        } else {
            hideError('username-error');
        }

        if (!$('#user_ID').val()) {
            showError('userID-error');
            isValid = false;
        } else {
            hideError('userID-error');
        }

        if (!$('#password').val()) {
            showError('password-error');
            isValid = false;
        } else {
            hideError('password-error');
        }

        if ($('#password').val() !== $('#confirm-password').val()) {
            showError('confirm-error');
            isValid = false;
        } else {
            hideError('confirm-error');
        }

        if (!$('.role-option.selected').length) {
            showError('role-error');
            isValid = false;
        } else {
            hideError('role-error');
        }

        return isValid;
    }

    function showError(errorId) {
        $('#' + errorId).show();
    }

    function hideError(errorId) {
        $('#' + errorId).hide();
    }

    function gatherFormData() {
        var userID = sanitize($('#user_ID').val());
        var username = sanitize($('#username').val());
        var password = sanitize($('#password').val());
        var selectedRole = $('.role-option.selected').data('role');

        // Map the selected role to a userType value
        var userType = selectedRole === 'student' ? 1 :
            selectedRole === 'teacher' ? 2 :
            selectedRole === 'admin' ? 3 : null;

        var data = { userID, username, password, usertype: userType };

        return data;
    }

    function sanitize(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
    }
});

async function logout() {
    try {
        await new Promise((resolve, reject) => {
            socket.emit('session_destroy', (response) => response.success ? resolve() : reject(response.error));
        });
        window.location.href = '/';
    } catch (error) {
        alert('ログアウトに失敗しました: ' + error);
    }
}

socket.on('session_destroy_success', () => navigateTo('/login'));
socket.on('session_destroy_failed', (error) => alert('ログアウトに失敗しました: ' + error));
