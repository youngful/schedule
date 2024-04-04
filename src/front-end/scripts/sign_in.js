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


document.getElementById('log_in-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {

        const response = await fetch('http://localhost:3001/user/log_in', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Wrong your email or password.');
        }



        window.location.href = '/'; 

    } catch (error) {
        alert(error)
        console.error('Sign up error:', error);
    }
});
