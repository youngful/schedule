document.getElementById('reset-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var email = document.getElementById('email').value;

    

    document.getElementById('reset-box1').classList.add('hidden');
    document.getElementById('reset-box2').classList.remove('hidden');

});