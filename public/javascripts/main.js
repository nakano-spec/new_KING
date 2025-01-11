var socket = io({ transports: ['websocket'], upgrade: false });
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

        // ボタンイベント
        document.getElementById('post-question-button').addEventListener('click', function() {
            socket.emit('pageupdate', 1);
        });

        document.getElementById('question-list-button').addEventListener('click', function() {
            socket.emit('pageupdate', 6);
        });

        document.getElementById('logout-button').addEventListener('click', function() {
            socket.emit('logout');
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

        // サーバー側からの応答
        socket.on('page_updatecomplete', function() {
            window.location.href = '/mondai';
        });

        socket.on('page_update2complete', function() {
            window.location.href = '/account';
        });

        socket.on('page_update3complete', function() {
            window.location.href = '/Question_manage';
        });

        socket.on('logout_complete', function() {
            window.location.href = '/';
        });

        socket.on('session_destroy_success', () => {
            window.location.href = '/login';
        });

        socket.on('session_destroy_failed', (error) => {
            alert('ログアウトに失敗しました: ' + error);
        });