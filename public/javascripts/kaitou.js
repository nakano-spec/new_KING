//指定した時間ごとに変数に記録されている処理を起動している。
var socket = io();
var f = document.forms.s1;
var mydiv = document.getElementById("myid");
console.log(mydiv.innerText);


socket.on('questionPosted', function(data) {
        console.log("success");        
        // 必要に応じて、新しい問題のページにリダイレクトする
        window.location.href ='/kaitou2?name=' + encodeURIComponent(mydiv.innerText);
});

//ボタンが押されたらログイン画面に戻る
f.modoru.addEventListener('click',function(e){
    e.preventDefault();
    window.location.href='/login';
})