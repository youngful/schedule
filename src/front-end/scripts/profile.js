async function fetchUserData() {
    try {
        
        const response = await fetch('http://localhost:3001/user/get_info', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data.');
        }

        const userData = await response.json();

        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.phone;
        document.getElementById('date').value = userData.dateOfBirth;
        document.getElementById('user_name').value = userData.name + userData.lastName;

        // document.getElementById('file').value = userData.filePath;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

fetchUserData();


document.getElementById('saveBtn').addEventListener('click', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dateOfBirth = document.getElementById('date').value;

    try {
        const response = await fetch('http://localhost:3001/user/update_info', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, phone, dateOfBirth })
        });

        if (!response.ok) {
            throw new Error('Failed to update user data.');
        }

        alert('User data updated successfully!');
    } catch (error) {
        console.error('Error updating user data:', error);
        alert('Failed to update user data. Please try again later.');
    }
})


$(document).ready(function () {
    $('#date').on('input', function () {
        var val = $(this).val();

        // Перевірка, чи введена крапка після дня та місяця
        if (val.length === 2 && val.charAt(1) !== '.') {
            $(this).val(val + '.');
        } else if (val.length === 5 && val.charAt(4) !== '.') {
            $(this).val(val + '.');
        }

        // Обмеження довжини року
        if (val.length >= 10) {
            $(this).val(val.substring(0, 10));
        }
    });

    $('#phone').on('input', function () {
        var val = $(this).val();

        // Видаляємо всі символи, крім цифр та "+"
        var numericVal = val.replace(/[^\d+]/g, '');

        // Визначаємо формат номера телефону
        var formattedVal = '';
        for (var i = 0; i < numericVal.length; i++) {
            if (i === 3) {
                formattedVal += ' ' + numericVal[i];
            } else if (i === 6 || i === 9 || i === 11) {
                formattedVal += ' ' + numericVal[i];
            } else {
                formattedVal += numericVal[i];
            }
        }

        $(this).val(formattedVal);
    }).on('keydown', function (e) {
        // Дозволяємо вводити тільки цифри та спеціальні клавіші
        if (!(e.key.match(/[0-9+]/) || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab')) {
            e.preventDefault();
        }
    });
});

document.getElementById('log_out').addEventListener('click', async function(event) {
    event.preventDefault();

    try{
        const response = await fetch('http://localhost:3001/user/log_out', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to log out');
        }

        window.location.href = '/log_in'; 
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
})