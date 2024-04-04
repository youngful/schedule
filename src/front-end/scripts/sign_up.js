function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var passEyeImg = document.getElementById("password-img");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passEyeImg.src = "../images/icons/eye-open.svg";
    } else {
        passwordInput.type = "password";
        passEyeImg.src = "../images/icons/eye-closed.svg";
    }
}

function toggleConfirmPasswordVisibility() {
    var confPasswordInput = document.getElementById("confirmPassword");
    var confEyeImg = document.getElementById("confirmPassword-img");

    if (confPasswordInput.type === "password") {
        confPasswordInput.type = "text";
        confEyeImg.src = "../images/icons/eye-open.svg";
    } else {
        confPasswordInput.type = "password";
        confEyeImg.src = "../images/icons/eye-closed.svg";
    }
}

