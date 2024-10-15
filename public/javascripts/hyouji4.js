var socket = io();
const rows = JSON.parse('<%- JSON.stringify(han1) %>');
var rowlen = rows.length;
console.log(rowlen);
var rowlen2 = parseInt(rowlen/12) + 1;
console.log(rowlen2);
var a = 0;
var b = 0;
var c = 0;
var myd = document.getElementById("box");
var i = 0;
var j = 0;
var k = 0;
var table1 = document.createElement("table");
var tbody1 = document.createElement("tbody");
var tr1 = document.createElement("tr");
while(i < rowlen2){
    tr1 = document.createElement("tr");
    while(k < rowlen && j != 12){
      var td1 = document.createElement("td");  
      a = rows[k].username;
      td1.textContent = a;
      b = rows[k].han;
      tr1.appendChild(td1);
      if(b === "○"){
        td1.setAttribute("bgcolor","#FF0000");
      }else if(b === "✕"){
        td1.setAttribute("bgcolor","#0000FF");
      }
      td1.setAttribute("width","160px");
      td1.setAttribute("height","160px");
      td1.setAttribute("align","center");
      j = j+1; 
      k = k + 1;
    }
    console.log(tr1);
    tbody1.appendChild(tr1);
    i = i + 1;
    j = 0;
   
}
table1.appendChild(tbody1);
myd.appendChild(table1);
table1.setAttribute("border","2px");
table1.setAttribute("align","center");
table1.setAttribute("class","example");
//押されたらサーバーにsocket.ioを使ってイベントを起動する・
function osareta(){
  socket.emit('syokika');
}