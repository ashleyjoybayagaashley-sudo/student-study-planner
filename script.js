
// GET HTML ELEMENTS
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskSubject = document.getElementById("taskSubject");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressPercent = document.getElementById("progressPercent");

// STORE TASKS
let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

// DISPLAY TASKS
function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        taskItem.innerHTML = `
            <h3>${escapeHTML(task.title)}</h3>
            <p>Subject: ${escapeHTML(task.subject)}</p>
            <p>Deadline: ${escapeHTML(task.date)}</p>
            <label>
                <input type="checkbox" ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${index})">
                Completed
            </label>
            <button onclick="editTask(${index})">Edit</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;

        taskList.appendChild(taskItem);
    });

    updateDashboard();
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

// ADD TASK
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newTask = {
        title: taskTitle.value.trim(),
        subject: taskSubject.value,
        date: taskDate.value,
        completed: false
    };

    if (!newTask.title || !newTask.subject || !newTask.date) {
        alert("Please complete all fields.");
        return;
    }

    tasks.push(newTask);
    taskForm.reset();
    displayTasks();
});

// MARK TASK AS COMPLETED
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    displayTasks();
}

// DELETE TASK

// EDIT TASK
function editTask(index) {
    const task = tasks[index];

    const newTitle = prompt("Enter new study goal:", task.title);

    if (newTitle === null || newTitle.trim() === "") {
        return;
    }

    const newSubject = prompt("Enter new subject:", task.subject);

    if (newSubject === null || newSubject.trim() === "") {
        return;
    }

    const newDate = prompt("Enter new deadline (YYYY-MM-DD):", task.date);

    if (newDate === null || newDate.trim() === "") {
        return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        alert("Please use the YYYY-MM-DD date format.");
        return;
    }

    task.title = newTitle.trim();
    task.subject = newSubject.trim();
    task.date = newDate;

    displayTasks();
}

// DELETE TASK
function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        displayTasks();
    }
}


// UPDATE DASHBOARD

function updateDashboard() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    progressPercent.textContent = progress + "%";

    // UPDATE PROGRESS BAR
    const progressFill = document.getElementById("progressFill");
    const progressMessage = document.getElementById("progressMessage");

    progressFill.style.width = progress + "%";

    if (progress === 100 && total > 0) {
        progressMessage.textContent = "Amazing! All tasks completed! 🎉";
    } else if (progress >= 50) {
        progressMessage.textContent = "Great progress! Keep it up! 🌸";
    } else {
        progressMessage.textContent = "Keep going! Every step counts. 🌱";
    }
}


// SAFELY DISPLAY USER TEXT
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// LOAD SAVED TASKS
displayTasks();


// SCHEDULE MANAGEMENT

const scheduleForm = document.getElementById("scheduleForm");
const activityName = document.getElementById("activityName");
const activityTime = document.getElementById("activityTime");
const activityDate = document.getElementById("activityDate");
const scheduleList = document.getElementById("scheduleList");

let schedules = JSON.parse(localStorage.getItem("studySchedules")) || [];

function displaySchedules() {
    scheduleList.innerHTML = "";

    schedules.forEach((schedule, index) => {
        const card = document.createElement("div");
        card.className = "schedule-card";

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = "📚 " + schedule.name;

        const info = document.createElement("p");
        info.textContent = schedule.date + " | " + schedule.time;

        details.appendChild(title);
        details.appendChild(info);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            schedules.splice(index, 1);
            saveSchedules();
        });

        card.appendChild(details);
        card.appendChild(deleteButton);

        scheduleList.appendChild(card);
    });
}

function saveSchedules() {
    localStorage.setItem("studySchedules", JSON.stringify(schedules));
    displaySchedules();
}

scheduleForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newSchedule = {
        name: activityName.value.trim(),
        time: activityTime.value,
        date: activityDate.value
    };

    schedules.push(newSchedule);

    schedules.sort((a, b) =>
        (a.date + "T" + a.time).localeCompare(b.date + "T" + b.time)
    );

    scheduleForm.reset();
    saveSchedules();
});

displaySchedules();
