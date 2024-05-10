document.addEventListener('DOMContentLoaded', function() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    function setActiveButton(clickedButton) {
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            const imgElement = item.querySelector('svg');
            if (imgElement) {
                imgElement.classList.remove('active-icon');
            }
        });

        clickedButton.classList.add('active');
        const imgElement = clickedButton.querySelector('svg');
        if (imgElement) {
            imgElement.classList.add('active-icon');
        }
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            setActiveButton(item);
        });
    });
});

$(document).ready(function() {
    function loadDefaultContent() {
        var defaultUrl = '/learning';
        // var defaultUrl = '/dashboard';
        loadContent(defaultUrl);
    }

    $('.sidebar-item').on('click', function(e) {
        e.preventDefault();
        var url = $(this).data('target');
        loadContent(url);
    });

    function loadContent(url) {
        $.get(url, function(data) {
            $('.content').html(data);
        });
    }

    loadDefaultContent();
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