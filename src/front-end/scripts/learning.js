$(document).ready(function(){
    var $slider = $('.slider');
    var $paginationLine = $('.slider-pagination-line');
    var $prevPageText = $('.prev-page');
    var $nextPageText = $('.next-page');

    $slider.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
        var totalSlides = slick.slideCount;
        var currentSlideIndex = currentSlide === undefined ? 0 : currentSlide;
        $nextPageText.text("0" + totalSlides);
        updatePaginationLine(currentSlideIndex + 1, totalSlides);
        // updatePageNumbers(currentSlideIndex + 1, totalSlides);
    });

    $slider.slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: false,
        prevArrow: '<button type="button" class="slick-prev">&#10094;</button>',
        nextArrow: '<button type="button" class="slick-next">&#10095;</button>'
    });

    function updatePaginationLine(currentIndex, totalSlides) {
        var percentComplete;

        if (currentIndex === totalSlides) {
            percentComplete = 100;
        } else if (currentIndex === 1) {
            percentComplete = 0;
        } else {
            percentComplete = ((currentIndex) / (totalSlides - 1)) * 100;
        }

        $paginationLine.width(percentComplete + '%');
    }

    // function updatePageNumbers(currentIndex, totalSlides) {
    //     var prevPageIndex = currentIndex - 1;
    //     var nextPageIndex = currentIndex + 1;

    //     $prevPageText.text(prevPageIndex);
    //     $nextPageText.text(nextPageIndex);
    // }
});
