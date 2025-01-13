const socket = io({ transports: ['websocket'], upgrade: false });
    const room_ID = 'teacher';
    const role = 2
    if (room_ID) {
            socket.emit('join_room', { room_ID, role });
            console.log(`ルーム ${room_ID} に参加しました (役割: ${role})`);
    } else {
        console.error('ルームIDが指定されていません。');
    }
    
    socket.on('modoru',function(){
        window.location.href='/kaitou'
    })

    const menuButton = document.querySelector('.menu-button'); // メニューボタンを取得
            const sidebar = document.getElementById('sidebar'); // サイドバーを取得
            const mainContent = document.querySelector('.main-content'); // メインコンテンツを取得

            // メニューボタンのクリックイベント
            menuButton.addEventListener('click', () => {
                sidebar.classList.toggle('active'); // サイドバーの表示切り替え
                mainContent.classList.toggle('sidebar-active'); // メインコンテンツの余白調整
            });

            // ドキュメント全体でクリックされたときの処理
            document.addEventListener('click', (event) => {
                if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
                    sidebar.classList.remove('active'); // サイドバーを非表示にする
                    mainContent.classList.remove('sidebar-active'); // 余白調整を解除
                }
            });

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