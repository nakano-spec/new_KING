var socket = io();
var f = document.forms.my;
var col = table.rows.length;
const div1 = document.getElementById("div1");
const newDiv = document.createElement("div");
var col = col;
var er = 0;
var value = 0;
let array = new Array(col-1);
console.log(table.rows[1].cells[1].innerHTML);
console.log(table.rows[1].cells[3].textContent);
for(let i = 1;i<col;i++)
{
  const newBtn = document.createElement("button");
  newBtn.innerHTML ="表示";
  newBtn.value =i;
  newBtn.style="width: 100px; height: 60px; display:flex; flex-flow: column; position: relative; top:55px;";
  newBtn.onclick = () => {
    var c = table.rows[i].cells[4].innerHTML;
    socket.emit('hyou',c);
  }
  newDiv.appendChild(newBtn);
  div1.appendChild(newDiv);
}
var a = 0

f.kekka.addEventListener('click',function(e){
  e.preventDefault();
  err = 0;
  for(let i = 0;i<col - 1 ;i++){
    if(table.rows[i+1].cells[3].lastElementChild.checked == true && table.rows[i + 1].cells[4].lastElementChild.checked == true){
        if(document.getElementById('div3').innerHTML != ""){
            document.getElementById('div3').innerHTML = '';
        }
        document.getElementById('div2').innerHTML = '<p><font color="red">どちらも選択されている項目があります。</font><p>';
        i = 999;
        err = 1;
    }else if(table.rows[i+1].cells[3].lastElementChild.checked == false && table.rows[i + 1].cells[4].lastElementChild.checked == false){
        if(document.getElementById('div2').innerHTML != ""){
            document.getElementById('div2').innerHTML = '';
        }
        document.getElementById('div3').innerHTML = '<p><font color="red">選択されていない項目があります</font><p>';
        i= 999;
        err = 1;
    }
  }
  for(let j = 0;j<col-1;j++){
    if(err == 1){
        j = 999;
        break;
    }else{
        document.getElementById('div2').innerHTML = '';
        document.getElementById('div3').innerHTML = '';
        array[j] = new Array(2);
        array[j][0] = "a";
        array[j][1] = "a";
        if(table.rows[j+1].cells[3].lastElementChild.checked == true){
            array[j][0] = table.rows[j+1].cells[1].innerHTML;
            array[j][1] = table.rows[j + 1].cells[3].textContent;
        }else if(table.rows[j + 1].cells[4].lastElementChild.checked == true){
            array[j][0] = table.rows[j + 1].cells[1].innerHTML;
            array[j][1] = table.rows[j + 1].cells[4].textContent;
        }
    }
  }
  console.log(array);
  socket.emit('kekkasyusei',array);
})

socket.on('modoru',function(){
    window.location.href='/mondai';
})