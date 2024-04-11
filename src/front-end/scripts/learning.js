window.userData = null; // Оголошення глобальної змінної userData

async function fetchUserData() {
    try {
        const response = await fetch('http://localhost:3001/user/get_learnings', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data.');
        }

        window.userData = await response.json();

        if (window.userData.length > 0) {
            document.querySelector(".slider-wrapper").classList.remove("hidden");
        } else {
            return null;
        }

        addSliderBlocks(window.userData);
        // console.log(window.userData);

        $('.slider').slick('refresh');

        addInfoBoxItems(window.userData);

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

function addInfoBoxItems(dataArray) {
    const upcoming = document.getElementById('box-item-upcoming');
    const overdue = document.getElementById('box-item-overdue');
    const upcoming_title = document.getElementById('box-title-upcoming');
    const overdue_title = document.getElementById('box-title-overdue');
    const task_counter_field = document.getElementById('task_counter');
    let taskCounter = 0;

    for (const group of dataArray) {
        for (const subject of group.subjects) {
            for (const task of subject.tasks) {
                
                const currentDate = new Date();
                const dueDate = new Date(task.date); 
                
                const timeDifference = dueDate.getTime() - currentDate.getTime();
                const daysDifference = timeDifference / (1000 * 3600 * 24);

                taskCounter++;

                if (daysDifference > 6) {
                    continue;
                }

                const block = document.createElement('div');
                block.classList.add('box-item');
                block.innerHTML = `
                    <h3 class="box-item_title">${task.taskName}</h3>
                    <span class="box-item_dueDate">${formatDate(task.date)}</span>
                `;

                const isOverdue = currentDate > dueDate;
                if (isOverdue) {
                    overdue.classList.remove("hidden");
                    overdue_title.classList.add("hidden");
                    overdue.appendChild(block);
                } else {
                    upcoming.classList.remove("hidden");
                    upcoming_title.classList.add("hidden");
                    upcoming.appendChild(block);
                }
            }
        }
    }

    task_counter_field.innerHTML = taskCounter
    // console.log(taskCounter);
    
}

function addSliderBlocks(dataArray) {
    const slider = document.getElementById('slider');
    const active_counter_field = document.getElementById('active_counter');
    let active_counter = 0;

    for (const group of dataArray) {
        active_counter++;
        const block = document.createElement('div');
        block.classList.add('slider-block');

        block.innerHTML = `
            <h3 class="block-title">${group.nameGroup}</h3>
        `;

        block.innerHTML += `<h4 class="block-sub_title">${group.subjects[0].name}</h4>`;

        if (group.subjects[0].tasks.length > 0) {
            block.innerHTML += `<h5 class="block-end_date">${formatDate(group.subjects[0].tasks[0].date)}</h5>`;
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dayOfMonth = date.getDate();
            const monthName = date.toLocaleDateString('en-US', { month: 'long' });
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${dayOfWeek}, ${dayOfMonth} ${monthName}, ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        }

        const currentDate = new Date();
        const dueDate = new Date(group.dueDate);
        const isOverdue = currentDate > dueDate;

        if (isOverdue) {
            const totalTasks = group.subjects.reduce((total, subject) => total + subject.tasks.length, 0);
            let completedTasks = 0;
            group.subjects.forEach(subject => {
                completedTasks += subject.tasks.filter(task => task.completed).length;
            });
            let progress = (completedTasks / totalTasks) * 100;

            progress = 99;

            var filledBalls = Math.ceil(progress / 100 * 6);

            block.innerHTML += `
            <span class="progress_placeholder">${progress}%passed</span>
            <div class="progress_scale_placeholder">
                ${Array(6).fill().map((_, index) => `
                    <svg class="scale" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="${index < filledBalls ? '#BAC8FF' : '#EEE'}" />
                    </svg>
                `).join('')}
            </div>
            `;
        }

        slider.appendChild(block);
    }

    active_counter_field.innerHTML = active_counter;
}

$(document).ready(function () {
    var $slider = $('.slider');
    var $paginationLine = $('.slider-pagination-line');
    var $prevPageText = $('.prev-page');
    var $nextPageText = $('.next-page');

    $slider.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
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


document.getElementById('add_course').addEventListener('click', async function (event) {
    event.preventDefault();

    const add_box = document.getElementById('add_box');

    add_box.style.display = "block";

    document.getElementById('join-btn').addEventListener('click', async function (event) {
        const code = document.getElementById('code').value;

        try {
            const response = await fetch('http://localhost:3001/user/join_group', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            if (!response.ok) {
                throw new Error('Failed to join.');
            }

            add_box.style.display = "none";
            alert('User join succesfully!');

        } catch (error) {
            console.error('Error join user:', error);
            alert('Failed to join group. Please try again later.');
        }
    })

})

function formatDate(dateString) {
    const date = new Date(dateString);
    
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayOfMonth = date.getDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${dayOfWeek}, ${dayOfMonth} ${monthName}, ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

fetchUserData();


