var socket = io();
var f = document.forms.myform;
var flug = 0;
f.button.addEventListener('click', function(e) {
    e.preventDefault();
    socket.emit('new_btnclick', f.name.value,f.password1.value,f.password2.value);
})
socket.on('new_flug',function(flug){
    if(flug == 1) {
        window.location.href = '/login';
    }
})    