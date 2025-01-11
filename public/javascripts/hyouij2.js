var socket = io({ transports: ['websocket'], upgrade: false });
var f = document.forms.s1;

//先生側からサーバーを経由して結果表示命令が来た場合'/hyou4'にセットされたパスのファイルに送る。
socket.on('problem_display_data',function(data){
    const queryParams = new URLSearchParams({
        room_ID: data.room_ID,
        question_text: data.question_text,
        pics_name: data.pics_name || ''
    }).toString();

    // クエリパラメータを含むURLにリダイレクト
    window.location.href = `/question_view?${queryParams}`;
})

//ボタンが押されたらloginページに戻る。
f.modoru.addEventListener('click',function(e){
    e.preventDefault();
    window.location.href='/login?name=' +  encodeURIComponent(username);
}) 