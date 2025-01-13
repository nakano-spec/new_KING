document.addEventListener('DOMContentLoaded', () => {
  // Socket.ioの初期化
  const socket = io({ transports: ['websocket'], upgrade: false });

  // フォームおよび関連要素の取得
  const loginForm = document.getElementById('loginForm');
  const mondai = document.getElementById('mondai');

  // サニタイズ関数の最適化
  const sanitize = (str) => String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/[:;*]/g, '');

  // エラーメッセージ要素の作成
  const createErrorMessage = (message) => {
      const errorItem = document.createElement('li');
      errorItem.textContent = message;
      errorItem.classList.add('error-message');
      return errorItem;
  };

  // フォーム送信時の処理
  loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // 入力データのサニタイズ
      const username = sanitize(loginForm.name.value.trim());
      const password = sanitize(loginForm.password1.value.trim());
      const selectedTeacher = loginForm.select1.value;

      // 入力内容の検証
      if (!username || !password || !selectedTeacher) {
          alert('すべてのフィールドを入力してください。');
          return;
      }

      // ログインデータの送信
      const loginData = { username, password, selectedOption: selectedTeacher };
      socket.emit('login', loginData);
  });

  // ログイン成功時のリダイレクト処理
  const handleLoginSuccess = (type, name) => {
      switch(type) {
          case 'teacher':
              window.location.href = `main`;
              break;
          case 'student':
              window.location.href = `/kaitou`;
              break;
          case 'admin':
              window.location.href = '/admin_main';
              break;
          default:
              console.warn('不明なログインタイプ:', type);
      }
  };

  // ログイン失敗時のエラーメッセージ表示
  const displayError = (message) => {
      // 既存のエラーメッセージをクリア
      mondai.innerHTML = '';
      mondai.appendChild(createErrorMessage(message));
  };

  // Socket.ioのイベントリスナー
  socket.on('login_flug', (flag, name, type) => {
      if (flag === 1) {
          handleLoginSuccess(type, name);
      } else {
          displayError('パスワードが不一致、または登録されていないユーザーデータです。');
      }
  });

  socket.on('login_error', () => {
      alert('入力内容に不備があります。\n再度入力し直してください。');
  });

  socket.on('new_flug', (flag) => {
      if (flag === 0) {
          console.log('ユーザー名とパスワードが違います。');
      }
  });

  socket.on('login_success', (result) => {
      console.log('ログイン成功:', result);
  });

  socket.on('login_null', (result) => {
      console.log('ユーザーが見つかりません:', result);
  });
});