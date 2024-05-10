window.userData = null;

async function userInfo() {
    try {
        const response = await fetch('http://localhost:3001/user/get_info', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data.');
        }

        window.userData = await response.json();
        console.log(window.userData);

        fillGrades();
        filterTasks(3);
        createGroupItems();
        updateProgressBackground();

    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

var dropdownToggle = document.getElementById('dropdownToggle');
var dropdownToggleTasks = document.getElementById('dropdownToggleTasks');
var arrowIcon = document.getElementById('arrowIcon');
var arrowIconTasks = document.getElementById('arrowIconTasks');
var optionsList = document.querySelector('.options');
var optionsListTasks = document.querySelector('.options_tasks');

var selectedValue = 30;

function toggleOptionsList(optionsList, arrowIcon) {
    return function () {
        optionsList.classList.toggle('show');
        arrowIcon.src = optionsList.classList.contains('show') ? '../images/icons/dropArrowUp.svg' : '../images/icons/dropArrowDown.svg';
    };
}

dropdownToggle.addEventListener('click', toggleOptionsList(optionsList, arrowIcon));
arrowIcon.addEventListener('click', toggleOptionsList(optionsList, arrowIcon));

dropdownToggleTasks.addEventListener('click', toggleOptionsList(optionsListTasks, arrowIconTasks));
arrowIconTasks.addEventListener('click', toggleOptionsList(optionsListTasks, arrowIconTasks));

optionsList.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        selectedValue = event.target.dataset.value;
        dropdownToggle.textContent = event.target.textContent;
        optionsList.classList.remove('show');
        fillGrades(selectedValue);
        updateProgressBackground();
        arrowIcon.src = '../images/icons/dropArrowDown.svg';
        console.log('Selected value:', selectedValue);
    }
});

optionsListTasks.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        selectedValue = event.target.dataset.value;
        dropdownToggleTasks.textContent = event.target.textContent;
        optionsListTasks.classList.remove('show');
        filterTasks(selectedValue)
        arrowIconTasks.src = '../images/icons/dropArrowDown.svg';
        console.log('Selected value:', selectedValue);
    }
});

function updateProgressBackground() {
    var progressElements = document.querySelectorAll('.progress');

    progressElements.forEach(function (element) {
        var progressValue = element.innerText;
        if (progressValue == "0" || progressValue == "N/A") {
            element.style.backgroundColor = '#eee';
            element.style.color = '#000';
        } else if (progressValue >= "88") {
            element.style.backgroundColor = '#DBF4E8';
            element.style.color = '#29B76C';
        } else if (progressValue < "71") {
            element.style.backgroundColor = '#FFE2E3';
            element.style.color = '#FF5756';
        } else {
            element.style.backgroundColor = '#F0BB54';
            element.style.color = '#fff';
        }
    });
}

function fillGrades(selectedValue) {
    const container = document.querySelector(".grade-wrapper");
    const lastGradesContainer = document.querySelector(".lastGrade-wrapper");
    const tasks = window.userData.tasks;
    const progressAVG = document.getElementById("progressAVG");
    let AVG = 0;
    let counter = 0;
    let lastGradeCounter = 0;

    container.innerHTML = "";
    lastGradesContainer.innerHTML = "";
    tasks.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));

    const currentDate = new Date();
    const selectedDays = parseInt(selectedValue);

    tasks.forEach(function (task) {
        if (lastGradeCounter < 4) {
            const lastGradeBlock = document.createElement('div');
            lastGradeBlock.classList.add("lastGrade");

            const name = document.createElement('p');
            name.classList.add("lastGrade-name");
            if (task.name.length > 14) {
                name.innerHTML = task.name.substring(0, 11) + "...";
            } else {
                name.innerHTML = task.name;
            }
            const grade = document.createElement('span');
            grade.classList.add('lastGrade-progress');
            grade.innerHTML = task.grade;

            if (task.grade == 0) {
                lastGradeBlock.style.backgroundColor = '#eee';
                grade.style.color = '#000';
            } else if (task.grade >= 88) {
                lastGradeBlock.style.backgroundColor = '#DBF4E8';
                grade.style.backgroundColor = "#29B76C";
            } else if (task.grade < 71) {
                lastGradeBlock.style.backgroundColor = '#FFE2E3';
                grade.style.backgroundColor = "#FF5756";
            } else {
                lastGradeBlock.style.backgroundColor = '#F4EFDB';
                grade.style.backgroundColor = "#F0BB54";
            }

            lastGradeBlock.appendChild(name);
            lastGradeBlock.appendChild(grade);

            lastGradesContainer.appendChild(lastGradeBlock);
            lastGradeCounter++;
        }

        const lastUpdateDate = new Date(task.lastUpdate);
        const differenceInTime = currentDate - lastUpdateDate;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        // console.log(differenceInDays);

        if (differenceInDays <= selectedDays) {
            if (counter > 36) {
                return;
            }
            const block = document.createElement('span');
            block.classList.add("progress");
            block.innerHTML = task.grade || "0";
            AVG += task.grade || 0;
            container.appendChild(block);
            counter++;
        }
    })
    
    const averageGrade = AVG / counter;
    progressAVG.innerHTML = Number.isInteger(averageGrade) ? averageGrade.toFixed(0) : averageGrade.toFixed(1);

    const message = document.querySelector("#no-grades");
    
    if(container.innerHTML === ''){
        progressAVG.innerHTML = "0";
        message.classList.remove("hidden");
    }else{
        message.classList.add("hidden");
    }

}


const prevDateButton = document.getElementById('prevDate');
const nextDateButton = document.getElementById('nextDate');
const selectedDateElement = document.querySelector('.selected_date');

selectedDate = new Date();

function updateSelectedDate() {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    selectedDateElement.textContent = selectedDate.toLocaleDateString('en-US', options);
}

prevDateButton.addEventListener('click', function () {
    selectedDate.setDate(selectedDate.getDate() - 1);
    updateSelectedDate();
    createScheduleContentForSelectedDate(selectedDate)
});

nextDateButton.addEventListener('click', function () {
    selectedDate.setDate(selectedDate.getDate() + 1);
    updateSelectedDate();
    createScheduleContentForSelectedDate(selectedDate)
});

function createScheduleContentForSelectedDate(selectedDate) {
    const container = document.querySelector('.schedule-content');
    container.innerHTML = '';

    const tasksForSelectedDate = window.userData.tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.toDateString() === selectedDate.toDateString();
    });

    tasksForSelectedDate.forEach(task => {
        const item = createScheduleContentItem(task);
        container.appendChild(item);
    });
}

function createScheduleContentItem(task) {
    const item = document.createElement('div');
    item.classList.add('schedule-content-item');

    const nameInfo = document.createElement('div');
    nameInfo.classList.add('schedule-name_info');

    const taskName = document.createElement('p');
    taskName.classList.add('schedule-task_name');
    taskName.textContent = task.name;

    const taskGroupName = document.createElement('p');
    taskGroupName.classList.add('schedule-group_name');

    let taskGroupNameText = '';
    window.userData.groups.forEach(group => {
        group.tasks.forEach(groupTask => {
            if (groupTask.name === task.name) {
                taskGroupNameText = group.name;
            }
        });
    });

    taskGroupName.textContent = taskGroupNameText;

    nameInfo.appendChild(taskName);
    nameInfo.appendChild(taskGroupName);

    const timeInfo = document.createElement('div');
    timeInfo.classList.add('schedule-time_info');

    const taskDate = new Date(task.date);
    const taskStart = document.createElement('p');
    taskStart.classList.add('schedule-task_start');
    const formattedTime = `${taskDate.getHours()}:${taskDate.getMinutes().toString().padStart(2, '0')}`;
    taskStart.textContent = formattedTime;

    const taskDuration = document.createElement('p');
    taskDuration.classList.add('schedule-task_duration');
    taskDuration.textContent = "1hr 30min";



    timeInfo.appendChild(taskStart);
    timeInfo.appendChild(taskDuration);

    item.appendChild(nameInfo);
    item.appendChild(timeInfo);

    return item;
}

function filterTasks(selectedValue) {
    const tasks = window.userData.tasks;
    
    const taskContainer = document.querySelector('.task-container');
    taskContainer.innerHTML = '';

    const currentDate = new Date();

    tasks.forEach(task => {
        
        const differenceInTime = currentDate - new Date(task.date);
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        
        if (differenceInDays < 1 && (-1 * differenceInDays) <= selectedValue) {
            const item = createTaskContainerItem(task);
            taskContainer.appendChild(item);
        }
    });
    const message = document.querySelector("#no-tasks");
    
    if(taskContainer.innerHTML === ''){
        message.classList.remove("hidden");
    }else{
        message.classList.add("hidden");
    }
    
}

function createTaskContainerItem(task) {

    const item = document.createElement('div');
    item.classList.add('task-container-item');

    const itemInfo = document.createElement('div');
    itemInfo.classList.add('item-info');

    const itemName = document.createElement('p');
    itemName.classList.add('item-name');
    itemName.textContent = task.name;

    const itemGroup = document.createElement('p');
    itemGroup.classList.add('item-group');
    itemGroup.textContent = task.groupName;

    itemInfo.appendChild(itemName);
    itemInfo.appendChild(itemGroup);

    const itemTime = document.createElement('div');
    itemTime.classList.add('item-time');

    const itemGrade = document.createElement('p');
    itemGrade.classList.add('item-grade');
    if(task.grade == undefined){
        itemGrade.textContent = "N/A";
    }else{
        itemGrade.textContent = task.grade + " points";
    }

    const itemDate = document.createElement('p');
    itemDate.classList.add('item-date');
    itemDate.textContent = "Due " + formatDate(task.date);

    itemTime.appendChild(itemGrade);
    itemTime.appendChild(itemDate);

    item.appendChild(itemInfo);
    item.appendChild(itemTime);

    return item;
}

function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

function populateTaskContainer(tasks) {
    const container = document.querySelector('.task-container');
    container.innerHTML = ''; // Очищаємо контейнер перед додаванням нових елементів

    tasks.forEach(task => {
        const item = createTaskContainerItem(task);
        container.appendChild(item);
    });
}


function createGroupItems() {
    const groupWrapper = document.querySelector('.group-wrapper');

    groupWrapper.innerHTML = '';

    const groups = window.userData.groups;

    groups.forEach(group => {
        const groupItem = document.createElement('div');
        groupItem.classList.add('group-item');

        const groupInfo = document.createElement('div');
        groupInfo.classList.add('group-info');

        const groupNameInfo = document.createElement('div');
        groupNameInfo.classList.add('group-name-info');

        const groupName = document.createElement('p');
        groupName.classList.add('group-name');
        groupName.textContent = group.name;

        const groupType = document.createElement('p');
        groupType.classList.add('group-type');
        groupType.textContent = `Course for [student]`;

        groupNameInfo.appendChild(groupName);
        groupNameInfo.appendChild(groupType);

        const groupContentInfo = document.createElement('div');
        groupContentInfo.classList.add('group-content-info');

        const groupActivity = document.createElement('p');
        groupActivity.classList.add('group-activity');
        groupActivity.textContent = `${group.tasks.length} Tasks • ${group.meetings.length} Meetings`;

        const groupAVG = document.createElement('p');
        groupAVG.classList.add('group-AVG');
        groupAVG.innerHTML = `Average grade: <span class="progress">${calculateAverageGrade(group.tasks)}</span>`;

        groupContentInfo.appendChild(groupActivity);
        groupContentInfo.appendChild(groupAVG);

        groupInfo.appendChild(groupNameInfo);
        groupInfo.appendChild(groupContentInfo);

        const groupProgress = document.createElement('div');
        groupProgress.classList.add('group-progress');

        const groupPercent = document.createElement('div');
        groupPercent.classList.add('group-percent');

        const percentText = document.createElement('p');
        percentText.classList.add('percent-text');
        percentText.textContent = calculateCompletionPercentage(group.tasks);

        const percentScale = document.createElement('div');
        percentScale.classList.add('percent-scale');

        const passedCircleCount = Math.ceil(parseInt(percentText.textContent) / 100 * 6);
        for (let i = 0; i < 6; i++) {
            const circle = document.createElement('span');
            circle.classList.add('circle');
            if (i < passedCircleCount) {
                circle.classList.add('passed');
            }
            percentScale.appendChild(circle);
        }

        groupPercent.appendChild(percentText);
        groupPercent.appendChild(percentScale);

        const arrowLink = document.createElement('a');
        arrowLink.href = '#';
        const arrowIcon = document.createElement('img');
        arrowIcon.src = '../images/icons/button-arrow-right.svg';
        arrowIcon.alt = '';
        arrowIcon.style.width = '32px';
        arrowLink.appendChild(arrowIcon);

        groupProgress.appendChild(groupPercent);
        groupProgress.appendChild(arrowLink);

        groupItem.appendChild(groupInfo);
        groupItem.appendChild(groupProgress);

        groupWrapper.appendChild(groupItem);
    });
}

function calculateAverageGrade(groupTasks) {
    const userDataTasks = window.userData.tasks;
    const relevantTasks = userDataTasks.filter(userTask => {
        return groupTasks.some(groupTask => groupTask.name === userTask.name);
    });

    const gradedTasks = relevantTasks.filter(task => task.grade > 0);

    if (gradedTasks.length === 0) return 'N/A'; 
    
    console.log(gradedTasks.length);


    const totalGrade = relevantTasks.reduce((acc, task) => acc + task.grade, 0);
    return Math.round(totalGrade / relevantTasks.length);
}


function calculateCompletionPercentage(groupTasks) {
    const userDataTasks = window.userData.tasks;
    const relevantTasks = userDataTasks.filter(userTask => {
        return groupTasks.some(groupTask => groupTask.name === userTask.name);
    });

    const gradedTasks = relevantTasks.filter(task => task.grade > 0);
    const completedTasksCount = gradedTasks.length;
    
    if(completedTasksCount === 0) {
        return `0% of tasks passed`;
    } else {
        const totalTasksCount = relevantTasks.length;
        const completionPercentage = (completedTasksCount / totalTasksCount) * 100;
        return `${Math.round(completionPercentage)}% of tasks passed`;
    }
}

updateSelectedDate();

userInfo();
