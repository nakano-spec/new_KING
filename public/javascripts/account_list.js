const socket = io();
        const menuButton = document.getElementById('hambtn');
        const sidebar = document.getElementById('sidebar');
        let sortDirection = 1;  // 1: 昇順、-1: 降順

        menuButton.addEventListener('click', () => toggleSidebar());
        document.addEventListener('click', (event) => closeSidebarOnOutsideClick(event));

        // メニューの開閉
        function toggleSidebar() {
            sidebar.classList.toggle('active');
        }

        function closeSidebarOnOutsideClick(event) {
            if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }

        // 並べ替え処理
        function sortTable(column) {
            const tbody = document.querySelector('#select-form tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));

            rows.sort((a, b) => {
                const cellA = a.querySelector(`td[data-column="${column}"]`).textContent.trim();
                const cellB = b.querySelector(`td[data-column="${column}"]`).textContent.trim();

                // 日付列を特別に処理
                if (column === 'log_time') {
                    return sortDirection * (new Date(cellA) - new Date(cellB));
                }
        
                // 数字の場合と文字列の場合
                return sortDirection * (isNaN(cellA) ? cellA.localeCompare(cellB) : cellA - cellB);
            });

            // テーブルの内容を更新
            rows.forEach(row => tbody.appendChild(row));

            // 昇順・降順の切り替え
            sortDirection *= -1;
        }
        // ユーザー操作に応じた処理
        document.getElementById('select-form').addEventListener('submit', (event) => handleSubmit(event));
        document.getElementById('add-button').addEventListener('click', () => navigateTo('/account_additionMethod'));
        document.getElementById('edit-button').addEventListener('click', () => editSelectedUser());
        document.getElementById('delete-button').addEventListener('click', () => deleteSelectedUser());
        document.getElementById('search-button').addEventListener('click', () => searchAccounts());

        function handleSubmit(event) {
            event.preventDefault();
            navigateTo('/main?name=teacher');
        }

        function navigateTo(url) {
            window.location.href = url;
        }

        function editSelectedUser() {
            const selectedRadio = document.querySelector('input[name="select"]:checked');
            if (selectedRadio) {
                const userID = selectedRadio.getAttribute('data-user-id');
                const userName = selectedRadio.getAttribute('data-user-name');
                const logTime = selectedRadio.getAttribute('data-log-time');
                navigateTo(`/account_edit?userID=${encodeURIComponent(userID)}&userName=${encodeURIComponent(userName)}&logTime=${encodeURIComponent(logTime)}`);
            } else {
                alert('ユーザーを選択してください。');
            }
        }

        function deleteSelectedUser() {
            const selectedRadio = document.querySelector('input[name="select"]:checked');
            if (selectedRadio) {
                const userID = selectedRadio.getAttribute('data-user-id');
                socket.emit('account_delete', userID);
            } else {
                alert('ユーザーを選択してください。');
            }
        }

        socket.on('delete_complete', () => navigateTo('/account_list'));
        socket.on('account_delete',(error) => alert("アカウント削除に失敗しました。" + error));

        function searchAccounts() {
            const searchTerm = document.getElementById('search-box').value;
           socket.emit('search_accounts', searchTerm);
        }

        socket.on('search_results', (results) => updateTable(results));

        function updateTable(data) {
            const tbody = document.querySelector('#select-form tbody');
            tbody.innerHTML = '';
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td><input type="radio" name="select" value="${row.user_ID}" data-user-id="${row.user_ID}" data-user-name="${row.user_name}" data-log-time="${row.log_time}"></td><td>${row.user_ID}</td><td>${row.user_name}</td><td>${new Date(row.log_time).toLocaleString('ja-JP')}</td>`;
                tbody.appendChild(tr);
            });
        }

        async function logout() {
            try {
                await new Promise((resolve, reject) => {
                    socket.emit('session_destroy', (response) => response.success ? resolve() : reject(response.error));
                });
                navigateTo('/login');
            } catch (error) {
                alert('ログアウトに失敗しました: ' + error);
            }
        }

        socket.on('session_destroy_success', () => navigateTo('/login'));
        socket.on('session_destroy_failed', (error) => alert('ログアウトに失敗しました: ' + error));