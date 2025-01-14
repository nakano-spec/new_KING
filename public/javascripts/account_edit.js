//セッションチェック三銃士
window.addEventListener('load',function(){
    socket.emit('checksession',"account_edit.ejs");//現在いるページを引数として送る
})

socket.on('session_OK',function(data){
    console.log(data);
})

socket.on('session_error',function(data){
    console.log(data);
    window.location.href = '/login';//失敗時はログインページに遷移（セッション破棄済み）
})
//三銃士ここまで

const socket = io();

        // 元の学籍番号を保持（ページロード時に取得）
        console.log(originalUserId);

        document.getElementById('saveButton').addEventListener('click', (e) => {
            e.preventDefault();
            const userId = document.getElementById('user-id').value;
            const userName = document.getElementById('user-name').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const role = document.getElementById('role-name').value;

            if (password !== confirmPassword) {
                alert('パスワードが一致しません');
                return;
            }

            const accountData = {
                original_user_ID: originalUserId,
                original_role_name:originalrolename,
                user_ID: userId,
                user_name: userName,
                password: password,
                role_name: role
            };

            socket.emit('account_update', accountData);
        });

        socket.on('account_update_success', () => {
            alert('ユーザー情報が更新されました');
            window.location.href = '/account_list';
        });

        socket.on('account_update_error', (error) => {
            alert(`エラー: ${error.message}`);
        });