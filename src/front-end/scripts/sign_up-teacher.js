
document.getElementById('sign_up-teacher').addEventListener('submit', async function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;


    try {

        if(password !== confirmPassword){
            throw new Error('Incorrect confirm password.');
        }

        const response = await fetch('http://localhost:3001/teacher/sign_up', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        if (!response.ok) {
            throw new Error('Check your data.');
        }

        window.location.href = '/log_in'; 

    } catch (error) {
        alert(error)
        console.error('Sign up error:', error);
    }
});