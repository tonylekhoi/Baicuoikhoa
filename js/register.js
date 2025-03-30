function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        alert("Đăng ký thành công!");
        window.location.href = "./../index/login.html"; // Chuyển đến trang đăng nhập
    } else {
        alert("Vui lòng nhập đầy đủ thông tin!");
    }
}