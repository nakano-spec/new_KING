var socket = io();
var f = document.forms.s1;

var log = function(){
    window.location.href ='/h'
}

setInterval(log,3000);
    //ボタンが押されたらloginページに戻る。
    f.modoru.addEventListener('click',function(e){
    e.preventDefault();
    window.location.href='/login?name=' +  encodeURIComponent();
})