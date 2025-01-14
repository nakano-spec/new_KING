var socket = io({ transports: ['websocket'], upgrade: false });
//セッションチェック三銃士
 window.addEventListener('load',function(){
    socket.emit('checksession',"kaitou.ejs");//現在いるページを引数として送る
})

socket.on('session_OK',function(data){
    console.log(data);
})

socket.on('session_error',function(data){
    console.log(data);
    window.location.href = '/login';//失敗時はログインページに遷移（セッション破棄済み）
})
//三銃士ここまで



        const room_ID = 'teacher';
        const role = 2
        if (room_ID) {
                socket.emit('join_room', { room_ID, role });
                console.log(`ルーム ${room_ID} に参加しました (役割: ${role})`);
        } else {
            console.error('ルームIDが指定されていません。');
        }
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


        socket.on('student_answer_data', async function(data) {
            try{
                console.log(data);
                const queryString = new URLSearchParams({
                    room_ID: data.room_ID,
                    question_text: data.question_text,
                    options: JSON.stringify(data.options) // 配列をJSON文字列に変換
                }).toString();
                window.location.href =`/kaitou2?${queryString}`;   
            }catch(error){
                console.error(error);
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