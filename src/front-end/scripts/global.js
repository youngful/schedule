document.addEventListener("DOMContentLoaded", function() {
    var backgrounds = ['bg-1.jpg', 'bg-2.jpg', 'bg-3.jpg', 'bg-4.jpg', 'bg-5.jpg', 'bg-6.jpg', 'bg-7.jpg', 'bg-8.jpg', 'bg-9.jpg', 'bg-10.jpg', 'bg-11.jpg',  'bg-12.jpg', 'bg-13.jpg', 'bg-14.jpg', 'bg-15.jpg', 'bg-16.jpg', 'bg-17.jpg', 'bg-18.jpg'];
    var randomIndex = Math.floor(Math.random() * backgrounds.length);
    var selectedBackground = backgrounds[randomIndex];
    document.body.style.backgroundImage = "url('../images/bg/" + selectedBackground + "')";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundSize = "cover";
});
