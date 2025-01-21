const socket = io();
//セッションチェック三銃士
window.addEventListener('load',function(){
    socket.emit('checksession',"admin_main.ejs");//現在いるページを引数として送る
})

socket.on('session_OK',function(data){
    console.log(data);
})

socket.on('session_error',function(data){
    console.log(data);
    window.location.href = '/login';//失敗時はログインページに遷移（セッション破棄済み）
})
//三銃士ここまで

const menuButton = document.getElementById('hambtn');
const sidebar = document.getElementById('sidebar');

menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('sidebar-active');
});

document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !sidebar.contains(event.target)) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('sidebar-active');
    }
});

document.getElementById('account-button').addEventListener('click', function() {
    window.location.href = "/account_list"
});
document.getElementById('logout-button').addEventListener('click', function() {
    logout();
});

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

socket.on('session_destroy_failed', (error) => {
    alert('ログアウトに失敗しました: ' + error);
});