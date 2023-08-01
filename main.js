import { categories, tasks } from "./module.js";

const filterTodaysTasks = () => {
  return tasks.filter((task) => task.date.getDate() === new Date().getDate());
};

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

const documentReady = () => {
  showTodaysTaskCount();
  showTaksSummary();
  showTasksCategory();
};
document.addEventListener("DOMContentLoaded", documentReady);
