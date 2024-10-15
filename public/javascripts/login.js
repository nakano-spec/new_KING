var socket = io();
var f = document.forms.myform;
var flug = 0;
var token = 0;
var mondai = document.getElementById('mondai');
var item = document.createElement('h3');
var name1 = f.name.value;
var password = f.password1.value;


f.button.addEventListener('click',function(e){
  e.preventDefault();
  socket.emit('crypto1',name1);
  //socket.emit('login_btnclick',f.name.value,f.password1.value);
})

socket.on('crypto',function(data){
  console.log(data);
})

socket.on('login_flug',function(flug,name){
if(flug == 1) {
  window.location.href = 'mondai?name=' + encodeURIComponent(name);
}else if(flug == 0){
  console.log('パスワードが不一致、または登録されていないuserデータです。');
}
})

socket.on('login_flug1',function(flug,name){
if(flug == 1) {
  window.location.href = '/kaitou?name=' + encodeURIComponent(name);
}else if(flug == 0){
  item.textContent = 'パスワードが不一致、または登録されていないuserデータです。';
  mondai.appendChild(item);
}
})

socket.on('login_flug2',function(flug){
if(flug == 1) {
  window.location.href = '/hyouji2';
}else if(flug == 0){
  item.textContent = 'パスワードが不一致、または登録されていないuserデータです。';
  mondai.appendChild(item);
}
})

socket.on('new_flug',function(flug){
if(flug == 0) {
  console.log('ユーザー名とパスワードが違います。');
}
}) 

