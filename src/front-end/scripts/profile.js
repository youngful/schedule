document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3001/user/get_info')
        .then(response => response.json())
        .then(userData => {
            console.log(userData);

            document.getElementById('email').value = userData.email;
            document.getElementById('phone').value = userData.phone;
            document.getElementById('date').value = userData.dateOfBirth;

            // document.getElementById('file').value = userData.filePath;
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
});
