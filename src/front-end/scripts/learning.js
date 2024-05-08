window.userData = null;

async function userInfo() {
    try {

        const response = await fetch('http://localhost:3001/user/get_info', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data.');
        }

        const userData = await response.json();

        const userType = document.getElementById("user_type");
        const userName = document.getElementById("user_name");

        userType.textContent = userData.type; 
        userName.textContent = `${userData.name} ${userData.lastName}`; 

    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

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

        console.log(window.userData);

        userInfo()
        addSliderBlocks(window.userData);
        addMeetingsToSchedule(window.userData);


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
    const overdueTasks = [];
    const upcomingTasks = [];

    for (const group of dataArray) {
        for (let task of group.tasks) {
            const currentDate = new Date();
            const dueDate = new Date(task.date);
            const timeDifference = dueDate.getTime() - currentDate.getTime();
            const daysDifference = timeDifference / (1000 * 3600 * 24);
            taskCounter++;

            const block = document.createElement('div');
            block.classList.add('box-item');
            block.innerHTML = `
                <h3 class="box-item_title">${task.name}</h3>
                <span class="box-item_dueDate">${formatDate(task.date)}</span>
            `;

            const isOverdue = currentDate > dueDate;
            if (isOverdue) {
                overdueTasks.push(block);
            } else {
                upcomingTasks.push(block);
            }
        }
    }

    overdueTasks.forEach(task => overdue.appendChild(task));
    upcomingTasks.forEach(task => upcoming.appendChild(task));

    if (overdueTasks.length > 0) {
        overdue.classList.remove("hidden");
        overdue_title.classList.add("hidden");
    }

    if (upcomingTasks.length > 0) {
        upcoming.classList.remove("hidden");
        upcoming_title.classList.add("hidden");
    }

    task_counter_field.innerHTML = taskCounter;
}

function addMeetingsToSchedule(dataArray) {
    const meeting_field = document.getElementById('meeting_counter');
    // Зберігаємо всі зустрічі з усіх груп у один масив
    const allMeetings = [];
    for (const group of dataArray) {
        for (const meeting of group.meetings) {
            meeting.groupName = group.nameGroup; 
            allMeetings.push(meeting);
        }
    }

    meeting_field.textContent = allMeetings.length;
    console.log(allMeetings);
    
    // Сортуємо зустрічі по даті в зростаючому порядку
    allMeetings.sort((a, b) => new Date(a.date) - new Date(b.date));


    function formatDate(dateString) {
        const date = new Date(dateString);

        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayOfMonth = date.getDate();
        const monthName = date.toLocaleDateString('en-US', { month: 'long' });
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${monthName} ${dayOfMonth}`;
    }

    // Отримуємо сьогоднішню, завтрашню та післязавтрашню обгортки зустрічей
    const today = document.getElementById('today-meeting-wrapper');
    const todayHeader = document.getElementById("meeting_date-today");
    const tomorrow = document.getElementById('tomorrow-meeting-wrapper');
    const tomorrowHeader = document.getElementById("meeting_date-tomorrow");
    const dayAfterTomorrow = document.getElementById('day-after-tomorrow-meeting-wrapper');
    const afterTomorrowHeader = document.getElementById("meeting_date-after-tomorrow");

    // Отримуємо поточну дату
    const currentDate = new Date();

    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);

    const afterTomorrowDate = new Date(currentDate);
    afterTomorrowDate.setDate(currentDate.getDate() + 2);

    const tomorrowDay = tomorrowDate.toLocaleDateString('en-US', { weekday: 'long' });
    const afterTomorrowDay = afterTomorrowDate.toLocaleDateString('en-US', { weekday: 'long' });

    todayHeader.textContent = `${formatDate(currentDate)}, Today`;
    tomorrowHeader.textContent = `${formatDate(tomorrowDate)}, Tomorrow`;
    afterTomorrowHeader.textContent = `${formatDate(afterTomorrowDate)}, ${afterTomorrowDay}`;

    for (const meeting of allMeetings) {
        const meetingDate = new Date(meeting.date);
        const daysDifference = Math.floor((meetingDate - currentDate) / (1000 * 3600 * 24));

        const meetingItem = document.createElement('div');
        meetingItem.classList.add('meeting-wrapper-item');

        const timeWrapper = document.createElement('div');
        timeWrapper.classList.add('lesson_time-wrapper');
        const lessonTime = document.createElement('p');
        lessonTime.classList.add('lesson_time');
        lessonTime.textContent = `${meetingDate.getHours()}:${meetingDate.getMinutes() < 10 ? '0' + meetingDate.getMinutes() : meetingDate.getMinutes()}`;
        
        const lessonDuration = document.createElement('p');
        lessonDuration.classList.add('duration');
        lessonDuration.textContent = "30min";

        timeWrapper.appendChild(lessonTime);
        timeWrapper.appendChild(lessonDuration);
        meetingItem.appendChild(timeWrapper);

        const subjectWrapper = document.createElement('div');
        subjectWrapper.classList.add('lesson_subject-wrapper');
        const subjectName = document.createElement('p');
        subjectName.classList.add('subject');
        subjectName.textContent = `${meeting.name}`;
        const groupName = document.createElement('p');
        groupName.classList.add('group');
        groupName.textContent = `${meeting.groupName}`;
        subjectWrapper.appendChild(subjectName);
        subjectWrapper.appendChild(groupName);
        meetingItem.appendChild(subjectWrapper);

        // Виводимо зустріч у відповідну обгортку в залежності від дати
        if (daysDifference < 0) {
            today.appendChild(meetingItem);
        } else if (daysDifference === 0) {
            tomorrow.appendChild(meetingItem);
        } else if (daysDifference === 1) {
            dayAfterTomorrow.appendChild(meetingItem);
        }
    }

    if (today.childElementCount === 1 || today.childElementCount === 0) {
        const pTag = document.createElement('p');
        pTag.textContent = 'No meetings';
        today.appendChild(pTag);
    }

    if (tomorrow.childElementCount === 1 || tomorrow.childElementCount === 0) {
        const pTag = document.createElement('p');
        pTag.textContent = 'No meetings';
        tomorrow.appendChild(pTag);
    }

    if (dayAfterTomorrow.childElementCount === 1 || dayAfterTomorrow.childElementCount === 0) {
        const pTag = document.createElement('p');
        pTag.textContent = 'No meetings';
        dayAfterTomorrow.appendChild(pTag);
    }
}

function addGroupsToContainer(dataArray) {
    console.log(dataArray);
    
    var groupsContainer = document.querySelector('.groups-container');
    dataArray.forEach(groups => {
        const groupTitle = groups.nameGroup;
        const groupProgress = 50;

        const newGroup = createGroup(groupTitle, groupProgress);
        groupsContainer.appendChild(newGroup);
    });
}

function createGroup(title, progress) {
    // Створюємо елементи
    var groupWrapper = document.createElement('div');
    groupWrapper.classList.add('group-wrapper');

    var groupInfo = document.createElement('div');
    groupInfo.classList.add('group-info');

    var groupTitle = document.createElement('h3');
    groupTitle.classList.add('group-title');
    groupTitle.textContent = title;

    var groupInfoBtns = document.createElement('div');
    groupInfoBtns.classList.add('group-info-btns');

    var studyLink = document.createElement('a');
    studyLink.href = '#';
    studyLink.classList.add('study');
    studyLink.textContent = 'Study';

    var leaveButton = document.createElement('button');
    leaveButton.classList.add('leave');
    leaveButton.textContent = 'Leave course';

    groupInfoBtns.appendChild(studyLink);
    groupInfoBtns.appendChild(leaveButton);

    groupInfo.appendChild(groupTitle);
    groupInfo.appendChild(groupInfoBtns);

    var groupProgress = document.createElement('div');
    groupProgress.classList.add('group-progress');

    var courseLink = document.createElement('a');
    courseLink.href = '#';
    courseLink.classList.add('course-btn');
    courseLink.textContent = 'Course';

    var progressScale = document.createElement('div');
    progressScale.classList.add('progress-scale');

    var progressPercent = document.createElement('span');
    progressPercent.classList.add('progress-percent');
    progressPercent.textContent = `${progress}% passed`;

    progressScale.appendChild(progressPercent);

    var numCircles = Math.floor(parseInt(progress) / 100 * 6);

    var progressScaleItems = [];
    for (var i = 0; i < 6; i++) {
        var progressScaleItem = document.createElement('span');
        progressScaleItem.classList.add('progress-scale-item');

        if (i < numCircles) {
            progressScaleItem.classList.add('passed');
        }

        progressScale.appendChild(progressScaleItem);
        progressScaleItems.push(progressScaleItem);
    }

    groupProgress.appendChild(courseLink);
    groupProgress.appendChild(progressScale);

    groupWrapper.appendChild(groupInfo);
    groupWrapper.appendChild(groupProgress);

    return groupWrapper;
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

        if (group.tasks[0]) {
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
                const totalTasks = group.tasks.length;
                let completedTasks = 0;

                group.tasks.forEach(task => {
                    completedTasks += group.tasks.filter(task => task.grade !== undefined).length;
                });

                console.log(completedTasks);

                let progress = (completedTasks / totalTasks) * 100;

                // progress = 99;

                block.innerHTML += `
                <span class="progress_placeholder">${progress}% passed</span><br>
                <a class = "btn-link" href="#">Course details <img src="../images/icons/button-arrow-right.svg" alt="" style="width: 32px;"></a>`;
            } else {
                block.innerHTML += `<h4 class="block-sub_title">${formatDate(group.dueDate)}</h4>`;
                block.innerHTML += `<a class = "btn-link" href="#">Supplement <img src="../images/icons/button-arrow-right.svg" alt="" style="width: 32px;"></a>`;
            }
        } else {
            block.innerHTML += `<h4 class="block-sub_title">${formatDate(group.dueDate)}</h4>`;
            block.innerHTML += `<a class = "btn-link" href="#">Supplement <img src="../images/icons/button-arrow-right.svg" alt="" style="width: 32px;"></a>`;
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
            console.log(error);
            console.error('Error join user:', error);

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

let selectedDate = new Date();
const currentDate = new Date();
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function generateCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    let html = '<table>';
    html += '<tr><th>s</th><th>m</th><th>t</th><th>w</th><th>t</th><th>f</th><th>s</th></tr>';

    let day = 1;
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayOfMonth) {
                html += '<td></td>';
            } else if (day > daysInMonth) {
                break;
            } else {
                const formattedDay = day.toString().padStart(2, '0');
                const dateString = `${year}-${month + 1}-${formattedDay}`;
                const isCurrentDate = year === currentDate.getFullYear() && month === currentDate.getMonth() && day === currentDate.getDate();
                const isSelectedDate = selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;

                const selectedClass = isSelectedDate ? 'selected' : '';

                html += `<td class="${selectedClass}" data-date="${dateString}">${formattedDay}</td>`;
                day++;
            }
        }
        html += '</tr>';
    }
    html += '</table>';

    calendar.innerHTML = html;

    const days = document.querySelectorAll('#calendar td');

    days.forEach(day => {
        day.addEventListener('click', () => {
            days.forEach(d => d.classList.remove('selected'));
            day.classList.add('selected');
            selectedDate = new Date(day.dataset.date);
        });
    });
}

function updateCalendar() {
    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();
    generateCalendar(currentYear, currentMonth);
    updateTodayText();
}

function updateTodayText() {
    const currentDayOfWeek = daysOfWeek[currentDate.getDay()];
    const currentMonth = months[currentDate.getMonth()];
    const todayText = `Today, ${currentDayOfWeek}, ${currentMonth} ${currentDate.getDate()}`;

    const todayElement = document.getElementById('today');
    todayElement.textContent = todayText;
}

document.getElementById('prevMonth').addEventListener('click', () => {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    updateCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    updateCalendar();
});

function panelController(id){
    const container = document.getElementById('container');
    const active = document.getElementById('active-container')

    if(id === 'tasks'){
        container.style.display = "none";
    }else if(id === 'active'){
        container.style.display = "none";
        addGroupsToContainer(window.userData);

        active.style.display = "block"
    }else if(id === 'meetings'){
        container.style.display = "none";
    }
}

fetchUserData();
generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
updateTodayText();



