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
