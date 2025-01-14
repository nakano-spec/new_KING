//セッションチェック三銃士
window.addEventListener('load',function(){
    socket.emit('checksession',"main.ejs");//現在いるページを引数として送る
})

socket.on('session_OK',function(data){
    console.log(data);
})

socket.on('session_error',function(data){
    console.log(data);
    window.location.href = '/login';//失敗時はログインページに遷移（セッション破棄済み）
})
//三銃士ここまで

// 他のページへの遷移処理
   socket.on('hyouji', function(student_data) {
    console.log(student_data);
    window.location.href = `/hyou3?user_ID=${encodeURIComponent(student_data.user_ID)}&user_name=${encodeURIComponent(student_data.user_name)}&userAnswer=${encodeURIComponent(student_data.userAnswer)}`;
  });

 //先生側からサーバーを経由して結果表示命令が来た場合'/hyou4'にセットされたパスのファイルに送る。
 socket.on('result_display2',function(username,data){
      const encodedData = encodeURIComponent(JSON.stringify(data));
      const nextURL = `/hyou4?username=${encodeURIComponent(username)}&tableData=${encodedData}`;
      window.location.href=nextURL;
  })

  const menuButton = document.querySelector('.menu-icon'); // 正しいハンバーガーメニューのクラス
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