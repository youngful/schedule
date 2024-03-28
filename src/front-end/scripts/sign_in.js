function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var eyeImg = document.getElementById("eye-img");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeImg.src = "../images/icons/eye-open.svg";
    } else {
        passwordInput.type = "password";
        eyeImg.src = "../images/icons/eye-closed.svg";
    }
}