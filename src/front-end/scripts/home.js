document.addEventListener('DOMContentLoaded', function() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    function setActiveButton(clickedButton) {
        sidebarItems.forEach(item => item.classList.remove('active'));
        clickedButton.classList.add('active');
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {

            setActiveButton(item);
        });
    });
});

$(document).ready(function() {
    function loadDefaultContent() {
        var defaultUrl = '/profile'; // URL сторінки профілю
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