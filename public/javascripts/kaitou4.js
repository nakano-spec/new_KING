var socket = io();
var f = document.forms.myform1;
var myname = document.getElementById("myid2");
var m1 = myname.innerText;

f.kaitou1.addEventListener('click',function(e){
    e.preventDefault();
    let checkvalue = f.textarea1.value;
    socket.emit('kiroku',m1,checkvalue);
})

socket.on('owari',function(){
    window.location.href ='/kaitou3?name=' + encodeURIComponent(myname.innerText);
})