import { categories, tasks } from "./module.js";

const filterTodaysTasks = () => {
  return tasks.filter((task) => task.date.getDate() === new Date().getDate());
};

const viewModal = document.getElementById("view-task-modal");

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
      const categoryBadge = document.getElementById("view-modal-category");
      categoryBadge.textContent = category.name;
      categoryBadge.style.backgroundColor = category.color;
      categoryBadge.classList.add("task-type-badge");
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
  if (e.target == viewModal) {
    viewModal.style.display = "none";
  }
});
