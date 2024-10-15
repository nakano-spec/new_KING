
var socket = io();
var result = document.getElementById('result');
var select = document.getElementById('select');
var er = document.getElementById('err');
var row = document.forms.fo;
var fileData = null;
var data = [];
var syasin = 0;
var csv = 0
var fd = 0;
var fd2 = 0;
k = 0;
        
//ファイルが選択されたらファイルを読み込みファイル内容を２次元配列に格納している。
select.addEventListener('change',function(e){
    fileData = e.target.files[0];
    var reader = new FileReader();
    reader.onerror = function(){
        alert('ファイル読み取りに失敗しました。');
    }
    reader.onload = function(){
        var lineArr = reader.result.split("\n");
        var itemArr = [];
        for(var i = 0;i < lineArr.length-1;i++){
            itemArr[i] = lineArr[i].split(",");
            console.log(itemArr[i]);
        }

        for(var i = 0;i<itemArr.length;i++){
            data[i] = [];
            for(var j = 0;j <itemArr[0].length;j++){
                data[i][j] = itemArr[i][j];
            }
            console.log(data);
        }           
    }
    reader.readAsText(fileData);
    csv = 1;
},false);

//写真が選択されたら写真のデータを読み取り写真名と拡張子をリストで表示する。
$(function(){
    $('#upload').change(function(){
        var fragment = "";
        $("#filename").empty();
        var file = $('#upload');
        var i = 0;
        while(true){
            var files = $(this).prop('files')[i];
            if(files === undefined){
                break;
            }
            fragment += "<li>" + files.name + "</li>";
            i = i + 1;
        }
        $("#filename").append(fragment);
        fd = 1;
        console.log(fd);
    });
});

$(function(){
    $('#upload2').change(function(){
        var fragment = "";
        $("#filename").empty();
        var file = $('#upload');
        var i = 0;
        while(true){
            var files = $(this).prop('files')[i];
            if(files === undefined){
                break;
            }
            fragment += "<li>" + files.name + "</li>";
            i = i + 1;
        }
        $("#filename2").append(fragment);
        fd2 = 1;
        console.log(fd2);
    });
});

//記録ボタンが押されたら写真をサーバーに、ファイルデータをデータベースに保存する
row.bu1.addEventListener('click',function(e){
    e.preventDefault();
    const files = $('#upload')[0].files;
    const files2 = $('#upload2')[0].files;
    const formData = new FormData();
    const formData2 = new FormData();
    for(let i = 0;i < files.length;i++){
        formData.append('file',files[i]);
    }

    for(let i = 0;i < files2.length;i++){
        formData2.append('file',files2[i]);
    }
    formData.append('hoge',123);
    formData2.append('hoge2',456);
    if(fd == 1){
        $.ajax({
            url: 'http://localhost:3000/upload',
            method: 'post',
            data: formData,
            processData: false,
            contentType: false
        }).done(function(res){
            console.log(res);
        }).fail(function(jqXHR,textStatus,errorThrown){
           console.log(textStatus);
           console.log(jqXHR.status);
           console.log(errorThrown.messeage);
        })
        console.log(data);
    }else if(fd2 == 1){
        $.ajax({
            url: 'http://localhost:3000/upload',
            method: 'post',
            data: formData2,
            processData: false,
            contentType: false,
            dataType: 'form-data'
    }).done(function(res){
            console.log(res);
    }).fail(function(err){
            console.log(err);
    })
    } 
    setTimeout(function(){
        if(csv == 1){
            //console.log(data[0]);
            socket.emit('filedata',data[0]);
        }else{
            window.location.href='/kanryou';
        }
    },5 * 1000);
})
        
    //成功したら完了ページを表示する。
socket.on('kanryou',() =>{
    k = k + 1;
    if(k < data.length){
        //console.log(data[k]);
        socket.emit('filedata',data[k]);
    }else{
        window.location.href = '/kanryou'
    }
})
        //失敗したら失敗ページに飛ぶ。
socket.on('miss',() =>{
    window.location.href ='/miss';
})