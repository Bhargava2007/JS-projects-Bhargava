
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const search = document.getElementById("search");

const dueTasks = document.getElementById("dueTasks");
const upcomingTasks = document.getElementById("upcomingTasks");

const error = document.getElementById("error");
const closeError = document.getElementById("closeError");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getToday = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Convert 24-hour time to 12-hour time
const formatTime = time => {
  const parts = time.split(":");

  let hour = Number(parts[0]);
  const minute = parts[1];

  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${String(hour).padStart(2, "0")}:${minute} ${period}`;
};


addBtn.addEventListener("click", () => {
  const name = taskInput.value.trim();
  const date = taskDate.value;
  const time = taskTime.value;

  if (!name || !date || !time) {
    error.style.display = "flex";
    return;
  }

  error.style.display = "none";

  const task = {
    id: Date.now() + Math.random(),
    name: name,
    date: date,
    time: time
  };

  tasks.push(task);

  saveTasks();

  taskInput.value = "";
  taskDate.value = "";
  taskTime.value = "";

  displayTasks();
});

closeError.addEventListener("click", () => {
  error.style.display = "none";
});


const deleteTask = id => {
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  displayTasks();
};


const editTask = id => {
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return;
  }

  const newName = prompt("Edit your task:", task.name);

  if (newName === null) {
    return;
  }

  if (newName.trim() === "") {
    return;
  }

  task.name = newName.trim();

  saveTasks();
  displayTasks();
};


const displayTasks = () => {

  dueTasks.innerHTML = "";
  upcomingTasks.innerHTML = "";

  const today = getToday();

  const now = new Date();
  const currentTime =
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0");

  const searchText = search.value.toLowerCase();

  const filtered = tasks.filter(task =>
    task.name.toLowerCase().includes(searchText)
  );

  const sorted = [...filtered].sort((a, b) => {
    const first = a.date + "T" + a.time;
    const second = b.date + "T" + b.time;

    return first.localeCompare(second);
  });

  const due = sorted.filter(task =>
    task.date < today ||
    (task.date === today && task.time <= currentTime)
  );

  const upcoming = sorted.filter(task =>
    task.date > today ||
    (task.date === today && task.time > currentTime)
  );

  showGroup(due, dueTasks, today);
  showGroup(upcoming, upcomingTasks, today);
};

const showGroup = (list, container, today) => {
// Display tasks under date headings
  if (list.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No tasks found";
    container.appendChild(empty);
    return;
  }

  const dates = [...new Set(list.map(task => task.date))];

  dates.forEach(date => {
    const daySection = document.createElement("div");
    daySection.className = "day";

    const heading = document.createElement("h3");
    heading.textContent = date === today ? "Today" : date;

    daySection.appendChild(heading);

    const dayTasks = list.filter(task => task.date === date);

    dayTasks.forEach(task => {
      const item = document.createElement("div");
      item.className = "task";

      const text = document.createElement("span");
      text.textContent = `${task.name} ${formatTime(task.time)}`;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit";

      editBtn.addEventListener("click", () => {
        editTask(task.id);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete";

      deleteBtn.addEventListener("click", () => {
        deleteTask(task.id);
      });

      item.appendChild(text);
      item.appendChild(editBtn);
      item.appendChild(deleteBtn);

      daySection.appendChild(item);
    });

    container.appendChild(daySection);
  });
};


search.addEventListener("input", displayTasks);// Search tasks


displayTasks();// Load saved tasks
