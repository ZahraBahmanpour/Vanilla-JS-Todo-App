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

const documentReady = () => {
  showTodaysTaskCount();
  showTaksSummary();
};
document.addEventListener("DOMContentLoaded", documentReady);
