
var messageBox = document.querySelector(".message-box");
var createPasslBox = document.querySelector(".create-password-box");

document.getElementById('reset_password-confirm').addEventListener('submit', async function (event) {
    event.preventDefault();

    var newPassword = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var pathArray = window.location.pathname.split('/');
    var token = pathArray[pathArray.length - 1];

    try {

        const response = await fetch(`http://localhost:3001/user/reset-password-confirm/${token}`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ newPassword, confirmPassword })
        });

        if (!response.ok) {
            throw new Error('Wrong your email.');
        }

        createPasslBox.classList.add("hidden");
        messageBox.classList.remove("hidden");

    } catch (error) {
        alert(error)
        console.error('Sign up error:', error);
    }
});
