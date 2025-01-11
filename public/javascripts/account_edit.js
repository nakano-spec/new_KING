const socket = io();

        // 元の学籍番号を保持（ページロード時に取得）
        const originalUserId = "<%= user_ID %>";
        const originalrolename = "<%= role_name %>";
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