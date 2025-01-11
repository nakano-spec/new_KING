const socket = io({transports: ['websocket'], upgrade: false});
        // 選択肢追加機能
        const optionsContainer = document.getElementById('options-container');
        const addOptionBtn = document.getElementById('add-option-btn');
        const errorMessage = document.getElementById('error-message');
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
        
        // フォーム送信時のアラート
        document.getElementById('questionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // フォームデータを取得
            const form = event.target;
            const formData = new FormData(form);
            const data = {};
            // FormDataからオブジェクトに変換
            formData.forEach((value, key) => {
                // 選択肢（options[]）を配列にまとめる
                if (key === 'options[]') {
                    if (!data.options) data.options = [];
                    data.options.push(value);
                } else {
                    data[key] = value;
                }
            });
            data.id = "<%= question_ID %>"; // 編集対象のIDを追加
            console.log("処理を開始");
            socket.emit('question_update', data);
        });

        socket.on('update_result',function(){
            window.location.href="/Question_manage";
        })

        socket.on('update_error',function(){
            alert("更新に失敗しました。");
        })

         // 写真リスト検索ボタン
         document.getElementById('search-button').addEventListener('click', function() {
            var searchTerm = document.getElementById('search-box').value;
            if(searchTerm == ''){
                socket.emit('image_List')
            }else{
                socket.emit('search_img', searchTerm);
            }
        });

        //検索結果表示
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


        //選択肢削除ボタン
        document.getElementById('deleteChoiceBtn').addEventListener('click', function() {
            const container = document.getElementById('options-container');
            const errorMessage = document.getElementById('error-message');
            if (container.children.length < 1) {
                errorMessage.textContent = '選択肢はそれ以上消せません。';
                return;
            }
            container.removeChild(container.lastElementChild);
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

        //選択肢追加処理
        addOptionBtn.addEventListener('click', () => {
            const currentOptions = optionsContainer.querySelectorAll('.option-group');
            if (currentOptions.length >= 10) {
                errorMessage.textContent = '選択肢は最大10個まで追加できます。';
                return;
            }
            errorMessage.textContent = ''; // エラーメッセージをクリア
            const newOptionIndex = currentOptions.length + 1;
            const newOption = document.createElement('div');
            newOption.className = 'form-group option-group';
            newOption.innerHTML = `
                <label class="form-label">選択肢${newOptionIndex}：</label>
                <input type="text" class="form-input" name="options[]" required>
            `;
            optionsContainer.appendChild(newOption);
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