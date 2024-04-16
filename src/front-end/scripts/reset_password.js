
var confEmailBox = document.querySelector(".confirm-email-box");
var messageBox = document.querySelector(".message-box");

document.getElementById('confirm-email-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    var email = document.getElementById('email').value;

    try {

        const response = await fetch('http://localhost:3001/user/reset_password', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error('Wrong your email.');
        }

        confEmailBox.classList.add("hidden");
        messageBox.classList.remove("hidden");

    } catch (error) {
        alert(error)
        console.error('Sign up error:', error);
    }
});

