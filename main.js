import { categories, tasks } from "./module.js";

const filterTodaysTasks = () => {
  return tasks.filter((task) => task.date.getDate() === new Date().getDate());
};

const viewModal = document.getElementById("view-task-modal");
const addModal = document.getElementById("add-task-modal");
const addForm = document.getElementById("add-form");

let isSearchPanelOpen = false;

const showTodaysTaskCount = () => {
  document.querySelector(".heading--bottom").textContent = `Today you have ${
    filterTodaysTasks().length
  } tasks`;
};

const showTaksSummary = () => {
  const tasksDiv = document.getElementById("box--tasks");
  const tasks = filterTodaysTasks();
  tasksDiv.innerHTML = "";
  tasksDiv.innerHTML += `<div class="task-card">
    <div class="badge">${tasks.length}</div>
    <span>tasks created</span>
    </div>`;
  tasksDiv.innerHTML += `<div class="task-card">
    <div class="badge">${tasks.filter((t) => !t.done).length}</div>
    <span>tasks left</span>
    </div>`;
};

const showTasksCategory = () => {
  document.getElementById("box--categories").innerHTML = "";
  categories.forEach((c) => {
    const taskCount = filterTodaysTasks().filter(
      (t) => t.categoryId === c.id
    ).length;
    if (taskCount > 0) {
      const card = `<div class="category-card">
            <div class="category-color-badge" style=background-color:${
              c.color
            }></div>
            <div class="badge">${c.name}</div>
            <span>${taskCount} ${taskCount > 1 ? `tasks` : `task`}</span>
            </div>`;
      document.getElementById("box--categories").innerHTML += card;
    }
  });
};

const createTimeLineCardEventListeners = () => {
  const todoCards = document.querySelectorAll(".box--timeline .todo-card");
  todoCards.forEach((todoCard) => {
    todoCard.addEventListener("click", (e) => {
      viewModal.style.display = "block";

      const currentCardId = e.currentTarget.id.split("-")[2];
      const currentTask = filterTodaysTasks().find(
        (t) => t.id === currentCardId
      );
      const category = categories.find((c) => c.id === currentTask.categoryId);

      document.getElementById("view-modal-title").textContent =
        currentTask.title;
      document.getElementById("view-modal-date").textContent = moment(
        currentTask.date
      ).format("YYYY-MM-DD");
      document.getElementById("view-modal-startTime").textContent = moment(
        currentTask.startTime
      ).format("hh:mm");
      document.getElementById("view-modal-endTime").textContent = moment(
        currentTask.endTime
      ).format("hh:mm");
      const categoryLabel = document.getElementById("view-modal-category");
      categoryLabel.textContent = category.name;
      categoryLabel.style.backgroundColor = category.color;
      categoryLabel.classList.add("task-type-label");
      document.getElementById("view-modal-description").textContent =
        currentTask.description;
    });
  });
};

const showTasksInTimeline = () => {
  const timeline = document.querySelector(".box--timeline");
  const tasks = filterTodaysTasks();
  timeline.innerHTML = "";
  tasks.sort((a, b) => a.startTime - b.startTime);
  tasks.forEach((task, i) => {
    timeline.innerHTML += `<div class="timeline--row">
    <div class="hour">${new Date(task.startTime).getHours()}:${new Date(
      task.startTime
    ).getMinutes()}</div>
    <div class="line"></div>
  </div><div class="todo-card" id="todo-card-${task.id}">
  <div class="category-color-badge"></div>
  <div class="badge">${task.title}</div>
  <span>${task.description}</span>
</div>`;

    if (i < tasks.length - 1 && task.endTime < tasks[i + 1].startTime) {
      const start = new Date(task.endTime);
      const end = new Date(tasks[i + 1].startTime);
      while (start.getTime() < end.getTime()) {
        timeline.innerHTML += `<div class="timeline--row">
        <div class="hour">${start.getHours()}:${start.getMinutes()}</div>
        <div class="line"></div>`;
        start.setMinutes(start.getMinutes() + 30);
      }
    }
  });

  createTimeLineCardEventListeners();
};

const documentReady = () => {
  showTodaysTaskCount();
  showTaksSummary();
  showTasksCategory();
  showTasksInTimeline();
};
document.addEventListener("DOMContentLoaded", documentReady);

window.addEventListener("click", (e) => {
  if (e.target == viewModal || e.target == addModal) {
    viewModal.style.display = "none";
    addModal.style.display = "none";
  }
});

const generateCategoryLabels = () => {
  document.getElementById("task-category-container").innerHTML = "";
  categories.forEach((c) => {
    const categoryLabelDiv = document.createElement("div");
    categoryLabelDiv.classList.add("task-type-label");
    categoryLabelDiv.dataset.id = c.id;
    categoryLabelDiv.style.backgroundColor = c.color;
    categoryLabelDiv.textContent = c.name;
    categoryLabelDiv.addEventListener("click", (e) => {
      document
        .querySelectorAll(".task-type-label")
        .forEach((label) => label.classList.remove("selected"));
      e.target.classList.add("selected");
      addForm["categoryId"].value = e.target.dataset.id;
    });
    document.getElementById("task-category-container").append(categoryLabelDiv);
  });
};

const updateUI = () => {
  showTodaysTaskCount();
  showTaksSummary();
  showTasksCategory();
  showTasksInTimeline();
};

const saveTask = (e) => {
  e.preventDefault();

  const title = e.target["title"].value;
  const date = new Date(e.target["date"].value);
  const startTime = new Date(date);
  startTime.setHours(
    e.target["start-time"].value.toString().split(":")[0],
    e.target["start-time"].value.toString().split(":")[1]
  );
  const endTime = new Date(date);
  endTime.setHours(
    e.target["end-time"].value.toString().split(":")[0],
    e.target["end-time"].value.toString().split(":")[1]
  );
  const categoryId = Number(e.target["categoryId"].value);
  const description = e.target["description"].value;
  if (!title || !date || !startTime || !endTime || !categoryId) {
    alert("All fields are required");
    return;
  }

  if (endTime.getTime() < startTime.getTime()) {
    alert("End time should be greater than start time");
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    date,
    startTime,
    endTime,
    categoryId,
    description,
    done: false,
  };
  console.log(newTask);
  tasks.push(newTask);
  addModal.style.display = "none";
  updateUI();
};

document.getElementById("btn--addTask").addEventListener("click", () => {
  addModal.style.display = "block";
  generateCategoryLabels();
});

document.getElementById("btn--searchTask").addEventListener("click", () => {
  isSearchPanelOpen = !isSearchPanelOpen;
  if (isSearchPanelOpen) {
    Array.from(
      document.getElementsByTagName("main")[0].children
    )[0].style.display = "none";
    document.getElementById("box--searchTask").style.display = "block";
    tasks.forEach((t) => {
      document.getElementById(
        "box--taskList"
      ).innerHTML += `<div class="taskList--item"><div>${
        t.title
      }</div><div class="category-color-badge" style="background-color:${
        categories.find((c) => c.id === t.categoryId).color
      }"></div></div>`;
    });
  } else {
    Array.from(
      document.getElementsByTagName("main")[0].children
    )[0].style.display = "block";
    document.getElementById("box--searchTask").style.display = "none";
  }
});

addForm.addEventListener("submit", saveTask);
