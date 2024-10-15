var socket = io();
var n = document.forms.form1;
var s = document.form1.mondaisentaku
let element= s.selectedIndex;
var a = s.options[element].value;

n.button.addEventListener('click', function(e) {
 e.preventDefault();
 socket.emit('mondai_btnclick',a);
})

socket.on('mondai_kekka',function(flag){
 if(flag = 1){
     window.location.href = '/mondai2'
 }else{
 window.location.href = '/hello'
}
}
)