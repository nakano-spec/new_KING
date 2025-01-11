var socket = io();
      const limit_time = '<%= limit_time %>';
      var totalSeconds = parseInt(limit_time, 10);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;

        // タイマーの表示更新
        document.getElementById('re').innerText = minutes;
        document.getElementById('re3').innerText = seconds;

        var countdownId = setInterval(function() {
          if (minutes === 0 && seconds === 0) {
            clearInterval(countdownId);
          } else {
            if (seconds === 0) {
              minutes--;
              seconds = 59;
            } else {
              seconds--;
            }
            document.getElementById('re').innerText = minutes;
            document.getElementById('re3').innerText = seconds;
          }
        }, 1000);

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