//セッションチェック三銃士
window.addEventListener('load',function(){
    socket.emit('checksession',"main.ejs");//現在いるページを引数として送る
})

socket.on('session_OK',function(data){
    console.log(data);
})

socket.on('session_error',function(data){
    console.log(data);
    window.location.href = '/login';//失敗時はログインページに遷移（セッション破棄済み）
})
//三銃士ここまで

const socket = io({transports: ['websocket'], upgrade: false});
const zoom = document.querySelectorAll(".zoom");
const zoomback = document.getElementById("zoomback");
const zoomimg = document.getElementById("zoomimg");


window.addEventListener('load', function(){			
  socket.emit('image_List');		
});

// 画像リスト取得後、パネル内に表示
socket.on('imageList', function(files) {
   console.log('Received image list:', files);
   const imageListContainer = document.getElementById('imageListContainer');
   imageListContainer.innerHTML = ''; // 初期化

   files.forEach(file => {
       const imageItem = document.createElement('div');
       imageItem.classList.add('image-item');

       const img = document.createElement('img');
       img.src = '/images/' + file;
       img.classList.add('zoom')

       const fileName = document.createElement('p');
       fileName.textContent = file; // ファイル名を表示

       imageItem.appendChild(img);
       imageItem.appendChild(fileName);
       imageListContainer.appendChild(imageItem);
   });

   const zoomElements = document.querySelectorAll('.zoom');
   zoomElements.forEach(function(value) {
       value.addEventListener("click", kakudai);
   });
});

// サイドパネルの表示非表示
const imagePanelButton = document.getElementById('imagePanelButton');
const imagePanel = document.getElementById('imagePanel');
let panelOpen = false;

imagePanelButton.addEventListener('click', function() {
   panelOpen = !panelOpen;
   if(panelOpen) {
       imagePanel.classList.add('open');
   } else {
       imagePanel.classList.remove('open');
   }
});

zoom.forEach(function(value) {
   value.addEventListener("click",kakudai);
});

function kakudai(e) {
   zoomback.style.display = "flex";
   zoomimg.setAttribute("src",e.target.getAttribute("src"));
}

zoomback.addEventListener("click",modosu);

function modosu() {
   zoomback.style.display = "none";
}

const downloadButton = document.getElementById('downloadButton');

//テンプレートファイルダウンロード処理
downloadButton.addEventListener('click', () => {
   socket.emit('reqquestionFile');
});

// サーバーからデータを受信
socket.on('question_Data', (file) => {
   const blob = new Blob([file.data], { type: 'text/csv' });
   const url = window.URL.createObjectURL(blob);

   // ダウンロードリンクを生成してクリック
   const a = document.createElement('a');
   a.href = url;
   a.download = file.fileName; // ファイル名指定
   document.body.appendChild(a);
   a.click();

   // 後片付け
   window.URL.revokeObjectURL(url);
   document.body.removeChild(a);
});

// エラーハンドリング
socket.on('fileError', (message) => {
   alert(message);
});

document.addEventListener("DOMContentLoaded", () => {
   const dropzone = document.getElementById('csv-dropzone'); // ドロップエリア
   const csvInput = document.getElementById('csv-input');   // ファイル選択入力
   const fileList = document.getElementById('csv-file-list').querySelector('ul');
   const sendButton = document.getElementById('send-csv-button');
   const photoDropzone = document.getElementById('photo-dropzone'); // 写真ドロップエリア
   const photoInput = document.getElementById('photo-input');      // 写真ファイル選択
   const photoList = document.getElementById('photo-file-list').querySelector('ul');
   let selectedFile = null; // 選択されたファイルを保持
   let selectedPhotos = []; // 選択された写真ファイルを保持

   // ドラッグ＆ドロップの設定
   setupDragAndDrop(dropzone, csvInput, handleFileSelection);

   // ドラッグ＆ドロップ設定関数
   function setupDragAndDrop(dropzone, input, fileHandler) {
       dropzone.addEventListener('dragover', (e) => {
           e.preventDefault();
           dropzone.classList.add('dragover');
       });

       dropzone.addEventListener('dragleave', () => {
           dropzone.classList.remove('dragover');
       });

       dropzone.addEventListener('drop', (e) => {
           e.preventDefault();
           dropzone.classList.remove('dragover');
           fileHandler(e.dataTransfer.files);
       });

       dropzone.addEventListener('click', () => {
           input.click();
       });

       input.addEventListener('change', () => {
           fileHandler(input.files);
       });
   }

   // ファイルが選択されたときの処理
   function handleFileSelection(files) {
       fileList.innerHTML = '';
       if (files.length > 0) {
           selectedFile = files[0]; // 最初のファイルを選択
           const li = document.createElement('li');
           li.textContent = selectedFile.name;
           fileList.appendChild(li);
       }
   }

    // ドロップゾーンのクリックで input を開く
   photoDropzone.addEventListener('click', () => {
       photoInput.click();
   });

   // ドラッグ＆ドロップ対応
   photoDropzone.addEventListener('dragover', (e) => {
       e.preventDefault();
       photoDropzone.classList.add('dragover');
   });

   photoDropzone.addEventListener('dragleave', () => {
       photoDropzone.classList.remove('dragover');
   });

   photoDropzone.addEventListener('drop', (e) => {
       e.preventDefault();
       photoDropzone.classList.remove('dragover');
       handlePhotoFiles(e.dataTransfer.files);
   });

   photoInput.addEventListener('change', (event) => {
       const files = event.target.files;
       photoList.innerHTML = ''; // リストをクリア
       selectedPhotos = []; // 配列をリセット

       for (const file of files) {
           selectedPhotos.push(file); // 配列にファイルを追加
           const li = document.createElement('li');
           const path = file.webkitRelativePath ? file.webkitRelativePath : file.name; // フォルダ内パス
           li.textContent = path;
           photoList.appendChild(li);
       }
       console.log('選択された写真:', selectedPhotos);
   });

   // 送信ボタンのクリック処理
   sendButton.addEventListener('click', () => {
       if (!selectedFile) {
           alert('CSVファイルを選択してください！');
           return;
       }

       console.log("送信ボタンがクリックされました！");

       const reader = new FileReader();
       reader.onload = (e) => {
           console.log('ファイルの内容を送信:', e.target.result);

           socket.emit('upload_csv', {
               fileName: selectedFile.name,
               content: e.target.result,
           });
       };
       reader.readAsText(selectedFile);
   });

   // サーバーからのレスポンス処理
   socket.on('file_upload_Complete',async function(){
       if (selectedPhotos.length > 0) {
           const formData = new FormData();
          // 写真ファイルを1つずつFormDataに追加
           selectedPhotos.forEach((file) => {
               const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_'); // ファイル名のサニタイズ
               const newFile = new File([file], sanitizedFileName, { type: file.type });
               formData.append('images', newFile);
           });

           console.log('アップロードする写真:', selectedPhotos);
           try {
               $.ajax({
                   url: '/upload', // 相対パスを使用
                   method: 'POST',
                   data: formData,
                   processData: false,
                   contentType: false
               }).done(function(res){
                   alert('CSVデータが正常に登録されました！');
                   window.location.href = "/Question_manage";
               }).fail(function(err){
                   console.log(err);
                   alert(`アップロードエラー: ${err.responseJSON.message || '不明なエラーが発生しました。'}`);
               });
           } catch (error) {
               console.error('アップロードエラー:', error);
           }
       } else {
           //alert('アップロードする写真がありません。');
           window.location.href = '/Question_manage';
       }
   });

   socket.on('fileError', (errorMessage) => {
       alert(`エラー: ${errorMessage}`);
   });
});

const menuButton = document.querySelector('.menu-icon'); // メニューボタンを取得
   const sidebar = document.getElementById('sidebar'); // サイドバーを取得
   const mainContent = document.querySelector('.main-content'); // メインコンテンツを取得

   // メニューボタンのクリックイベント
   menuButton.addEventListener('click', () => {
       sidebar.classList.toggle('active'); // サイドバーの表示切り替え
       mainContent.classList.toggle('sidebar-active'); // メインコンテンツの余白調整
   });

   // ドキュメント全体でクリックされたときの処理
   document.addEventListener('click', (event) => {
       if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
           sidebar.classList.remove('active'); // サイドバーを非表示にする
           mainContent.classList.remove('sidebar-active'); // 余白調整を解除
       }
   });

   // 写真一覧の検索ボタン処理
   document.getElementById('search-button').addEventListener('click', function() {
       var searchTerm = document.getElementById('search-box').value;
       if(searchTerm == ''){
           socket.emit('image_List')
       }else{
           socket.emit('search_img', searchTerm);
       }
   });

   socket.on('image_result', function(file) {
       console.log('Received image list:', file);
       const imageListContainer = document.getElementById('imageListContainer');
       imageListContainer.innerHTML = ''; // 初期化
       const imageItem = document.createElement('div');
       imageItem.classList.add('image-item');

       const img = document.createElement('img');
       img.src = '/images/' + file;
       img.classList.add('zoom')

       const fileName = document.createElement('p');
       fileName.textContent = file; // ファイル名を表示

       imageItem.appendChild(img);
       imageItem.appendChild(fileName);
       imageListContainer.appendChild(imageItem);

       const zoomElements = document.querySelectorAll('.zoom');
       zoomElements.forEach(function(value) {
           value.addEventListener("click", kakudai);
       });
   });

   socket.on('image_error', function(error) {
       console.log(error);
   });

   //ログアウト処理
   async function logout() {
       try {
           await new Promise((resolve, reject) => {
               socket.emit('session_destroy', (response) => {
                   if (response.success) resolve();
                   else reject(response.error);
               });
           });
           // 成功時はログインページにリダイレクト
           window.location.href = '/login';
       } catch (error) {
           alert('ログアウトに失敗しました: ' + error);
       }
   }
   
   socket.on('session_destroy_success', () => {
       window.location.href = '/login';
   });
