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

var socket = io({ transports: ['websocket'], upgrade: false });
        //キーボードであるボタンが押されたら色を変える。ここではaまたはAボタンを押したら赤に、bまたはBボタンを押したら青になる。
        document.addEventListener('keydown', (event) => {
            var keyName = event.key;
 
         if (event.key === "a" || event.key === "A") {
            document.bgColor = "red"
            document.fgColor = "#ffffff"
         }else if (event.key === "b" || event.key === "B"){
            document.bgColor ="blue"
            document.fgColor = "#ffffff"
         }
       });

       const room_ID = 'teacher';
        const role = 3
        if (room_ID) {
                socket.emit('join_room', { room_ID, role });
                console.log(`ルーム ${room_ID} に参加しました (役割: ${role})`);
        } else {
            console.error('ルームIDが指定されていません。');
        }
        
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
         //先生側からサーバーを経由して結果表示命令が来た場合'/hyou4'にセットされたパスのファイルに送る。