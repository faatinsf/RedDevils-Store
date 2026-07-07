// ===== PROSES LOGIN =====
const loginForm = document.getElementById('loginForm');
const roleSelect = document.getElementById('role');

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = roleSelect.value;

    // 1. Cek Akun Admin Bawaan (Hardcoded)
    if (role === 'admin') {
      if (email === 'admin@gmail.com' && password === 'admin123') {
        localStorage.setItem('rd_role', 'admin');
        window.location.href = 'admin-dashboard.html';
        return;
      } else {
        showNotification('❌ Invalid admin credentials', 'error');
        return;
      }
    }

    // 2. Cek Akun User (Bawaan JS + Hasil Register di LocalStorage)
    if (role === 'user') {
      // Cek apakah akun bawaan js
      if (email === 'user@gmail.com' && password === 'user123') {
        localStorage.setItem('rd_role', 'user');
        window.location.href = 'user-dashboard.html';
        return;
      }

      // Cek ke dalam "Database" LocalStorage untuk user hasil register
      let registeredUsers = JSON.parse(localStorage.getItem('rd_users')) || [];
      const foundUser = registeredUsers.find(user => user.email === email && user.password === password);

      if (foundUser) {
        localStorage.setItem('rd_role', 'user');
        localStorage.setItem('rd_user_now', JSON.stringify(foundUser)); // Menyimpan data user yang sedang login (opsional)
        window.location.href = 'user-dashboard.html';
        return;
      } else {
        showNotification('❌ Invalid user credentials', 'error');
        return;
      }
    }
  });
}

// ===== PROSES REGISTER =====
const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validasi kecocokan password
    if (password !== confirmPassword) {
      showNotification('❌ Passwords do not match!', 'error');
      return;
    }

    // Ambil data user yang sudah terdaftar di localStorage, jika belum ada buat array kosong []
    let registeredUsers = JSON.parse(localStorage.getItem('rd_users')) || [];

    // Validasi apakah email sudah pernah didaftarkan sebelumnya
    const isEmailExist = registeredUsers.some(user => user.email === email || email === 'user@gmail.com' || email === 'admin@gmail.com');
    if (isEmailExist) {
      showNotification('❌ Email already registered!', 'error');
      return;
    }

    // Masukkan data user baru ke dalam list database sementara
    registeredUsers.push({ name, email, password, role: 'user' });

    // Simpan kembali list terupdate ke localStorage
    localStorage.setItem('rd_users', JSON.stringify(registeredUsers));

    // Notifikasi sukses dan pindah ke halaman login
    showNotification('✅ Registration successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  });
}

// ===== PROSES LOGOUT =====
function logout() {
  localStorage.removeItem('rd_role');
  localStorage.removeItem('rd_user_now');
  window.location.href = 'login.html';
}

// Fungsi pembantu untuk menampilkan Toast / Alert agar tidak error jika Toast belum siap
function showNotification(message, type) {
  if (typeof Toast !== 'undefined') {
    Toast.show(message, type);
  } else {
    alert(message);
  }
}