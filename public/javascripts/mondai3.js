//セッションチェック三銃士
window.addEventListener('load',function(){
    socket.emit('checksession',"mondai3.ejs");//現在いるページを引数として送る
})

socket.on('session_OK',function(data){
    console.log(data);
})

socket.on('session_error',function(data){
    console.log(data);
    window.location.href = '/login';//失敗時はログインページに遷移（セッション破棄済み）
})
//三銃士ここまで

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