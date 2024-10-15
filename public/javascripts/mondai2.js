var socket = io();
var n = document.forms.f1;
var s = document.f1.mo1; 
var flag = false;
var m = document.f1.hantei;
var o = 0;
var web = <%- JSON.stringify(web) %>;
for(var i = 0;i<m.length;i++){
 if(m[i].checked){
   flag = true;
   o = m[i].value;
 }
}

n.okuru.addEventListener('click',function(e){
 e.preventDefault();
 for(var i = 0;i<m.length;i++){
 if(m[i].checked){
   flag = true;
   o = m[i].value;
 }
}
 let element= s.selectedIndex;
 var a = s.options[element].innerText;
 let newwin = open("/hyouji2");
 socket.emit('mondai_btnclick',a,o); //mondai
})

n.kakunin.addEventListener('click',function(e){
 e.preventDefault();
 let element= s.selectedIndex;
 var a = s.options[element].innerText;
 window.location.href = "/kakunin?data=" + encodeURIComponent(a);
})

n.tuika.addEventListener('click',function(e){
 e.preventDefault();
 window.location.href="/tuika";
})



socket.on('mondai_kekka',function(flag){
 if(flag = 1){
   var w = n.time2.value;
     window.location.href = '/mondai2?byou=' + encodeURIComponent(w);
 }else{
 window.location.href = '/hello'
}
}
)

//ハンバーガーメニュー用

document.getElementById("hambtn").onclick = function(){
  document.querySelector('html').classList.toggle('open');
}

function updateYearSelect(years) {
  var yearSelect = document.getElementById('year-select');
  yearSelect.innerHTML = ''; // 既存のオプションをクリア

  // 重複を排除した年度の配列を生成
  var uniqueYears = [...new Set(years.map(data => data.question_years))];
  
  // 新しい年度の選択肢を追加
  uniqueYears.forEach(function(year) {
      var option = document.createElement('option');
      option.textContent = year;
      yearSelect.appendChild(option);
  });
}

     //試験名が選択されるとwwwのelectedQualificationNameにSocket.ioで試験名を送信する。
     document.f1.mo1.addEventListener('change', function() {
      var selectedQualificationName = this.value;
      socket.emit('requestQualificationData', selectedQualificationName);
    });
    //

    //年度が選択されるとwwwのelectedQualificationyearsにSocket.ioで年度を送信する。
    document.f1.year.addEventListener('change', function() {
      var selectedQualificationyears = this.value;
      socket.emit('requestquestionname', selectedQualificationyears);
    });
    //

    //問題名が選択されるとwwwのelectedQualificationquestionにSocket.ioで問題名を送信する。
    document.f1.question.addEventListener('change', function() {
      var selectedQualificationquestion = this.value;
      socket.emit('requestgenre', selectedQualificationquestion);
    });
    //

    //wwwのelectedQualificationNameから年度・問題名・ジャンルのデータを取得し、セレクトボックス内のデータを
    //更新する。
    socket.on('qualificationData', function(data) {
        updateYearSelect(data);
        updateQuestionSelect(data);
        updateGenreSelect(data);
    });
    //

    //wwwのelectedQualificationyearsから問題名とジャンルのデータを取得し、セレクトボックス内のデータを
    //更新する。
    socket.on('questionname', function(data) {
        updateQuestionSelect(data);
        updateGenreSelect(data);
    });
    //wwwのelectedQualificationquestionからジャンルのデータを取得し、セレクトボックス内のデータを
    //更新する。
    socket.on('questiongenre', function(data) {
        updateGenreSelect(data);
    });

    //年度、問題名、ジャンルのセレクトボックスを更新する関数
    function updateYearSelect(years) {
        var yearSelect = document.getElementById('year-select');
        yearSelect.innerHTML = ''; // 既存のオプションをクリア

        // 新しい年度の選択肢を追加
        years.forEach(function(data) {
            var option = document.createElement('option');
            option.textContent = data.question_years; // 年度を表す名称
            yearSelect.appendChild(option);
        });
    }

    //問題名、ジャンルのセレクトボックスを更新する関数
    function updateQuestionSelect(years) {
        var yearSelect = document.getElementById('question-select');
        yearSelect.innerHTML = ''; // 既存のオプションをクリア

        // 新しい年度の選択肢を追加
        years.forEach(function(data) {
            var option = document.createElement('option');
            option.textContent = data.question_name; // 年度を表す名称
            yearSelect.appendChild(option);
        });
    }
    //

    //ジャンルのセレクトボックスを更新する関数
    function updateGenreSelect(years) {
        var yearSelect = document.getElementById('genre-select');
        yearSelect.innerHTML = ''; // 既存のオプションをクリア

        // 新しい年度の選択肢を追加
        years.forEach(function(data) {
            var option = document.createElement('option');
            option.textContent = data.question_genre; // 年度を表す名称
            yearSelect.appendChild(option);
        });
    }