var socket = io();
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
        //サーバーから送られてきたデータをクエリパラメータにセットし、'/hyou3'にセットされたパスのファイルに送る。
        socket.on('hyouji',function(de){
              window.location.href ='/hyou3?data=' + encodeURIComponent(de);
        })

        //先生側からサーバーを経由して結果表示命令が来た場合'/hyou4'にセットされたパスのファイルに送る。
        socket.on('kekkahyouji2',function(){
            window.location.href='/hyou4';
         })