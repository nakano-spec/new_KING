var socket = io();
var f = document.forms.my;
var col = table.rows.length;
const div1 = document.getElementById("div1");
const newDiv = document.createElement("div");
var col = col;

for(let i = 1;i<col;i++)
{
  const newBtn = document.createElement("button");
  newBtn.innerHTML ="表示";
  newBtn.value =i;
  newBtn.style="width: 100px; height: 38px; display:flex; flex-flow: column; position: relative; top:55px; margin-bottom: 1px";
  newBtn.onclick = () => {
    var c = table.rows[i].cells[1].innerHTML;
    socket.emit('hyou',c);
  }
  newDiv.appendChild(newBtn);
  div1.appendChild(newDiv);
}
f.kekka.addEventListener('click',function(e){
  e.preventDefault();
  socket.emit('kekkahyouji');
})
        
socket.on('modoru',function(){
  window.location.href='/mondai';
})