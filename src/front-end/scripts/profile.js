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

        var fileInput = document.getElementById('file');
        var fileIconElement = document.getElementById('file-icon');
        var fileTitle = document.getElementById('file_title');
        const fileSubTitle = document.getElementById('file_sub-title');

        if (userData.file) {

            var file = userData.file;
            var fileType = getFileType(file);
            fileSubTitle.innerHTML = file;

            switch (fileType) {
                case 'doc':
                case 'docx':
                    fileIconElement.src = '../images/icons/doc.svg';
                    break;
                case 'pdf':
                    fileIconElement.src = '../images/icons/pdf.svg';
                    break;
                case 'zip':
                    fileIconElement.src = '../images/icons/zip.svg';
                    break;
                default:
                    fileIconElement.src = '../images/icons/doc.svg';
            }
            fileIconElement.style.display = 'inline-block';
            fileIconElement.style.margin = '13px 0 0 30px';
            fileInput.style.display = "none";
            fileTitle.style.top = "-30px";
            fileTitle.style.left = "-25px";
            fileTitle.style.backgroundColor = "none";


        }

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

fetchUserData();


document.getElementById('saveBtn').addEventListener('click', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dateOfBirth = document.getElementById('date').value;
    const fileInput = document.getElementById('file');
    const fileName = fileInput.files[0] ? fileInput.files[0].name : '';

    try {
        const response = await fetch('http://localhost:3001/user/update_info', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, phone, dateOfBirth, fileName })
        });

        if (!response.ok) {
            throw new Error('Failed to update user data.');
        }

        alert('User data updated successfully!');
    } catch (error) {
        console.error('Error updating user data:', error);
        alert('Failed to update user data. Please try again later.');
    }
});

document.getElementById('file').addEventListener('change', function () {
    var fileInput = this;
    var fileIconElement = document.getElementById('file-icon');
    var fileTitle = document.getElementById('file_title');
    var fileSubTitle = document.getElementById('file_sub-title');

    if (fileInput.files && fileInput.files[0]) {
        var file = fileInput.files[0];
        var fileType = getFileType(file.name);
        fileSubTitle.innerHTML = file.name;

        switch (fileType) {
            case 'doc':
            case 'docx':
                fileIconElement.src = '../images/icons/doc.svg';
                break;
            case 'pdf':
                fileIconElement.src = '../images/icons/pdf.svg';
                break;
            case 'zip':
                fileIconElement.src = '../images/icons/zip.svg';
                break;
            default:
                fileIconElement.src = '../images/icons/doc.svg';
        }


        fileIconElement.style.display = 'inline-block';
        fileIconElement.style.margin = '13px 0 0 30px';
        fileInput.style.display = "none";
        fileTitle.style.top = "-30px";
        fileTitle.style.left = "-25px";
        fileTitle.style.backgroundColor = "none";
    }
});

function getFileType(fileName) {
    var extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'doc':
        case 'docx':
        case 'pdf':
        case 'zip':
            return extension;
        default:
            return 'default';
    }
}

document.getElementById('file-icon').addEventListener('click', function () {
    var fileWindow = document.getElementById('file-window');
    var inPut = document.getElementById('file-name-input');
    var saveButton = document.getElementById('save-button');
    var deleteButton = document.getElementById('delete-button');
    var fileSubTitle = document.getElementById('file_sub-title');
    const fileInput = document.getElementById('file');

    

    fileWindow.style.display = 'block';

    inPut.value = fileSubTitle.innerText;

    saveButton.addEventListener('click', saveFile);
    deleteButton.addEventListener('click', deleteFile);

    function saveFile() {
        
        var newName = document.getElementById('file-name-input').value;

        fileSubTitle.innerHTML = newName;
        fileInput.files[0].name = newName;

        fileWindow.style.display = 'none';
    }

    function deleteFile() {

        var fileInput = document.getElementById('file');
        var fileSubTitle = document.getElementById('file_sub-title');

        fileSubTitle.innerHTML = "";
        document.getElementById("custom-file-upload").style.display = "none";
        fileInput.style.display = "block";
        fileWindow.style.display = 'none';
    }
});


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

document.getElementById('log_out').addEventListener('click', async function (event) {
    event.preventDefault();

    try {
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