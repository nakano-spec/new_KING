//簡易タイマーを作成
var socket = io();
var hyoujiindex = 0;
var timer = document.getElementById('mytime');
var timer2 = timer.innerText;

const rows = JSON.parse('<%- JSON.stringify(web) %>');
const class1 = "example";
console.log(rows[0].picturename);
var doc = document.getElementById('picture');
if(rows[0].picturename){
  doc.innerHTML ="<img src=images/" + rows[0].picturename + " class=" + class1 +">" 
}
var timer3 = parseInt(timer2/60,10);
var timer4 = timer2%60
if(p3 == 0 && p4 == 0){
  remain3.innerText=timer3;
  remain4.innerText=timer44;
}else{
  var countdownid = setInterval(function(){
  if(p3 != 0 && p4 == 0){
      p4 = 59
  }else{
     p4 --; 
  }
  remain.innerText=p3;
  remain2.innerText = p4;
  if(p3 >0 && p4 == 0){
      p3 --;
      p4 = 59;
  }
  if(p3 == 0 && p4 == 0){
      clearInterval(countdownid);
  }
}, 1000);}

      socket.on('hyouji',function(de){
        window.location.href ='/hyou3?data=' + encodeURIComponent(de);
      })

      socket.on('kekkahyouji2',function(url){
        window.location.href = url;
      })