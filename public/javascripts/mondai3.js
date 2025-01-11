var f  = document.forms.myform2;
            var socket = io({ transports: ['websocket'], upgrade: false });
            //socket.emit('question_release');
            //値設定
            //var rend = document.getElementById('my');
            const room_ID = '<%= name %>';
                const role = 1
                if (room_ID) {
                    socket.emit('join_room', { room_ID, role });
                    console.log(`ルーム ${room_ID} に参加しました (役割: ${role})`);
                } else {
                    console.error('ルームIDが指定されていません。');
                }
            var inner2 = '<%= second %>'  //入力値を受け取る
            var minites = parseInt(inner2/60,10); //分を取得
            var seconds = Math.round(inner2%60); //秒を取得
            seconds = Math.abs(seconds);

            remain.innerText=minites;
            remain2.innerText=seconds;

            //カウンドダウン開始
            if(minites == 0 && seconds == 0){
                remain.innerText=minites;
                remain2.innerText=seconds;
            }else{
                var countdownid = setInterval(function(){
                if(minites != 0 && seconds == 0){
                    minites --;
                    seconds = 59;
                }else{
                   seconds --; 
                }
                remain.innerText=minites;
                remain2.innerText = seconds;
                if(minites == 0 && seconds == 0){
                    clearInterval(countdownid);
                    socket.emit('owa2');
                }
            }, 1000);
            }

            f.button3.addEventListener('click',function(e){
                e.preventDefault();
                socket.emit('owa2');
            })

            f.button4.addEventListener('click',function(e){
                e.preventDefault();
                socket.emit('question_release');
            })

            f.kekka.addEventListener('click',function(e){
                e.preventDefault();
                window.location.href = '/mondai3';
            })

            const menuButton = document.querySelector('.hamburger'); // 正しいハンバーガーメニューのクラス
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

            // ドキュメント全体でクリックされたときの処理
            document.addEventListener('click', (event) => {
                if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
                    sidebar.classList.remove('active'); // サイドバーを非表示にする
                    mainContent.classList.remove('sidebar-active'); // 余白調整を解除
                }
            });

            socket.on('end',function(){
                window.confirm("問題が終了しました。");
                window.location.href='/mondai3';
            })

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