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
        const rows = JSON.parse('<%- JSON.stringify(han1) %>');
        console.log(rows);

        const box = document.getElementById("box");

        // テーブル作成
        const table = document.createElement("table");
        const tbody = document.createElement("tbody");
        const rowLength = rows.length;
        const columns = 12; // 1行に表示するデータの数
        let k = 0;

        // データが少ない場合は中央寄せに設定
        if (rowLength <= columns) {
            box.classList.add("center");
        }
        const tr = document.createElement("tr");
        while (k < rowLength) {
          const tr = document.createElement("tr");
          const columnsInRow = Math.min(columns, rowLength - k);
            for (let j = 0; j < columnsInRow; j++) {
                const td = document.createElement("td");
                if (k < rowLength) {
                    const user_ID = rows[k].user_ID;
                    const username = rows[k].user_name;
                    const answer = rows[k].user_answer;
                    const result = rows[k].result;

                    td.innerHTML = `<h1>${answer}</h1><br>${user_ID}<br>${username}`;

                    // 背景色設定
                    if (result === 1) {
                        td.classList.add("red");
                    } else if (answer === "timeup") {
                        td.classList.add("dark-gray");
                    }else if(result === 0){
                        td.classList.add("blue");
                    }
                    k++;
                } else {
                    td.style.border = "none"; // 余ったセルは空白に
                }

                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        box.appendChild(table);

        table.setAttribute("align", "center");


        // 問題選択に戻る処理
        function osareta() {
            socket.emit('clear');
            window.close();
        }