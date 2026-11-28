
// ==========================================
// GET TASK HTML ELEMENTS
// ==========================================

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskSubject = document.getElementById("taskSubject");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressPercent = document.getElementById("progressPercent");

// ==========================================
// TASK MANAGEMENT
// ==========================================

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

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
                <input type="checkbox"
                    ${task.completed ? "checked" : ""}
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

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newTask = {
        title: taskTitle.value.trim(),
        subject: taskSubject.value.trim(),
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

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    displayTasks();
}

function editTask(index) {
    const task = tasks[index];

    const newTitle = prompt("Enter new study goal:", task.title);
    if (newTitle === null || !newTitle.trim()) return;

    const newSubject = prompt("Enter new subject:", task.subject);
    if (newSubject === null || !newSubject.trim()) return;

    const newDate = prompt("Enter new deadline (YYYY-MM-DD):", task.date);
    if (newDate === null || !newDate.trim()) return;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        alert("Please use YYYY-MM-DD date format.");
        return;
    }

    task.title = newTitle.trim();
    task.subject = newSubject.trim();
    task.date = newDate;

    displayTasks();
}

function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        displayTasks();
    }
}

// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    progressPercent.textContent = progress + "%";

    const progressFill = document.getElementById("progressFill");
    const progressMessage = document.getElementById("progressMessage");

    if (progressFill) {
        progressFill.style.width = progress + "%";
    }

    if (progressMessage) {
        if (progress === 100 && total > 0) {
            progressMessage.textContent = "Amazing! All tasks completed! 🎉";
        } else if (progress >= 50) {
            progressMessage.textContent = "Great progress! Keep it up! 🌸";
        } else {
            progressMessage.textContent = "Keep going! Every step counts. 🌱";
        }
    }
}

// ==========================================
// SUBJECTS MANAGEMENT
// ==========================================

const subjectForm = document.getElementById("subjectForm");
const subjectName = document.getElementById("subjectName");
const subjectList = document.getElementById("subjectList");

let subjects = JSON.parse(localStorage.getItem("studySubjects")) || [];

function displaySubjects() {
    subjectList.innerHTML = "";

    subjects.forEach((subject, index) => {
        const subjectCard = document.createElement("div");
        subjectCard.className = "subject-card";

        const name = document.createElement("h3");
        name.textContent = "📚 " + subject;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            if (confirm("Delete this subject?")) {
                subjects.splice(index, 1);
                saveSubjects();
            }
        });

        subjectCard.appendChild(name);
        subjectCard.appendChild(deleteButton);
        subjectList.appendChild(subjectCard);
    });
}

function saveSubjects() {
    localStorage.setItem("studySubjects", JSON.stringify(subjects));
    displaySubjects();
}

subjectForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newSubject = subjectName.value.trim();

    if (!newSubject) {
        alert("Please enter a subject name.");
        return;
    }

    const alreadyExists = subjects.some(
        subject => subject.toLowerCase() === newSubject.toLowerCase()
    );

    if (alreadyExists) {
        alert("This subject already exists.");
        return;
    }

    subjects.push(newSubject);
    subjectForm.reset();
    saveSubjects();
});

// ==========================================
// SCHEDULE MANAGEMENT
// ==========================================

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

        const title = document.createElement("h3");
        title.textContent = "📚 " + schedule.name;

        const info = document.createElement("p");
        info.textContent = schedule.date + " | " + schedule.time;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            schedules.splice(index, 1);
            saveSchedules();
        });

        card.appendChild(title);
        card.appendChild(info);
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

    if (!newSchedule.name || !newSchedule.time || !newSchedule.date) {
        alert("Please complete all fields.");
        return;
    }

    schedules.push(newSchedule);

    schedules.sort((a, b) =>
        (a.date + "T" + a.time).localeCompare(b.date + "T" + b.time)
    );

    scheduleForm.reset();
    saveSchedules();
});

// ==========================================
// SECURITY: ESCAPE HTML
// ==========================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// ==========================================
// LOAD SAVED DATA
// ==========================================

displayTasks();
displaySubjects();
displaySchedules();

// ==========================================
// REGISTER SERVICE WORKER
// ==========================================

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Study Planner is ready for offline use."))
            .catch(error =>
                console.error("Service worker registration failed:", error)
            );
    });
}
