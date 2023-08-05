import { categories, tasks } from "./module.js";

const filterTodaysTasks = () => {
  return tasks.filter(
    (task) => task.date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
  );
};

const viewModal = document.getElementById("view-task-modal");
const addModal = document.getElementById("add-task-modal");
const addForm = document.getElementById("add-form");
const taskListBox = document.getElementById("box--taskList");

let isSearchPanelOpen = false;
let showDeleteCheckboxes = false;
let editTaskId = false;
let filteredTasks = tasks;
let deleteTaskList = [];

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
  const categoriesDiv = document.getElementById("box--categories");
  categoriesDiv.innerHTML = "";
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
      categoriesDiv.innerHTML += card;
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
    addForm.reset();
  }
});

const generateCategoryLabels = (editedTask) => {
  const categoryContainerDiv = document.getElementById(
    "task-category-container"
  );
  categoryContainerDiv.innerHTML = "";
  categories.forEach((c) => {
    const categoryLabelDiv = document.createElement("div");
    categoryLabelDiv.classList.add("task-type-label");
    categoryLabelDiv.dataset.id = c.id;
    categoryLabelDiv.style.backgroundColor = c.color;
    categoryLabelDiv.textContent = c.name;
    if (editedTask && c.id === editedTask)
      categoryLabelDiv.classList.add("selected");
    categoryLabelDiv.addEventListener("click", (e) => {
      document
        .querySelectorAll(".task-type-label")
        .forEach((label) => label.classList.remove("selected"));
      e.target.classList.add("selected");
      addForm["categoryId"].value = e.target.dataset.id;
    });
    categoryContainerDiv.append(categoryLabelDiv);
  });
};

const createDeleteAllCheckbox = () => {
  const container = document.createElement("div");
  container.classList.add("check--all-container");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "delete--check--all";
  checkbox.addEventListener("change", (e) => {
    deleteTaskList = [];
    if (checkbox.checked) {
      document.querySelectorAll(".delete--item--checkbox").forEach((ch) => {
        ch.checked = true;
        deleteTaskList.push(ch.value);
      });
    } else {
      document.querySelectorAll(".delete--item--checkbox").forEach((ch) => {
        ch.checked = false;
      });
    }
  });
  container.append(checkbox);
  taskListBox.append(container);
};

const updateUI = () => {
  showTodaysTaskCount();
  showTaksSummary();
  showTasksCategory();
  showTasksInTimeline();
  showTasksList();
};

const gatherFormData = (e) => {
  const title = addForm["title"].value;
  const date = new Date(addForm["date"].value);
  const startTime = new Date(date);
  startTime.setHours(
    addForm["start-time"].value.toString().split(":")[0],
    addForm["start-time"].value.toString().split(":")[1]
  );
  const endTime = new Date(date);
  endTime.setHours(
    addForm["end-time"].value.toString().split(":")[0],
    addForm["end-time"].value.toString().split(":")[1]
  );
  const categoryId = Number(addForm["categoryId"].value);
  const description = addForm["description"].value;
  const done = addForm["done"].checked;

  if (!title || !date || !startTime || !endTime || !categoryId) {
    alert("All fields are required");
    return;
  }

  if (endTime.getTime() < startTime.getTime()) {
    alert("End time should be greater than start time");
    return;
  }

  const newTask = {
    title,
    date,
    startTime,
    endTime,
    categoryId,
    description,
    done,
  };
  return newTask;
};

document.getElementById("btn--addTask").addEventListener("click", () => {
  addModal.style.display = "block";
  generateCategoryLabels();
});

const showTasksList = () => {
  taskListBox.innerHTML = "";
  filteredTasks.forEach((t) => {
    taskListBox.innerHTML += `<div class="taskList--item ${
      t.done ? "taskList--item--done" : ""
    }"><div><button class="btn--editTask" data-task-id="${
      t.id
    }"><i class="fa-solid fa-edit"></i></button>${
      t.title
    }</div><div style="display: flex"><div class="category-color-badge" style="background-color:${
      categories.find((c) => c.id === t.categoryId).color
    }"></div><input type="checkbox" class="delete--item--checkbox" value="${
      t.id
    }"/></div</div>`;
  });

  document.querySelectorAll(".btn--editTask").forEach((btnEdit) =>
    btnEdit.addEventListener("click", () => {
      const editedTask = tasks.find(
        (task) => task.id === btnEdit.dataset.taskId
      );
      editTaskId = editedTask.id;
      addModal.style.display = "block";
      generateCategoryLabels(editedTask.categoryId);
      const editForm = document.getElementById("add-form");
      editForm["title"].value = editedTask.title;
      editForm["date"].value = moment(editedTask.date).format("YYYY-MM-DD");
      Array.from(editForm["start-time"].children).find(
        (op) => op.innerText === moment(editedTask.startTime).format("HH:mm")
      ).selected = true;
      Array.from(editForm["end-time"].children).find(
        (op) => op.innerHTML === moment(editedTask.endTime).format("HH:mm")
      ).selected = true;
      editForm["categoryId"].value = editedTask.categoryId;
      editForm["description"].value = editedTask.description;
      editForm.children[editForm.children.length - 2].classList.remove("hide");
      editForm["done"].checked = editedTask.done;
    })
  );
};

const openSearchBox = () => {
  isSearchPanelOpen = !isSearchPanelOpen;
  if (isSearchPanelOpen) {
    Array.from(
      document.getElementsByTagName("main")[0].children
    )[0].style.display = "none";
    document.getElementById("box--searchTask").style.display = "block";

    showTasksList();
  } else {
    Array.from(
      document.getElementsByTagName("main")[0].children
    )[0].style.display = "block";
    document.getElementById("box--searchTask").style.display = "none";
  }
};

document
  .getElementById("btn--searchTask")
  .addEventListener("click", openSearchBox);

const submitForm = (e) => {
  e.preventDefault();
  const task = gatherFormData();
  if (task) {
    if (editTaskId) {
      tasks.splice(
        tasks.findIndex((t) => t.id === editTaskId),
        1,
        { id: editTaskId, ...task }
      );
    } else {
      tasks.push({ id: Date.now().toString(), ...task, done: false });
    }
    addModal.style.display = "none";
    // localStorage.setItem("tasks", JSON.stringify(tasks));
    updateUI();
  }
};
addForm.addEventListener("submit", submitForm);

document.getElementById("input--searchTask").addEventListener("input", (e) => {
  filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(e.target.value.toLowerCase())
  );
  showTasksList();
});

const deleteTasks = () => {
  deleteTaskList.forEach((del) =>
    tasks.splice(
      tasks.findIndex((t) => t.id === del),
      1
    )
  );
  //localStorage.setItem("tasks", JSON.stringify(tasks));
  updateUI();
};
document.getElementById("btn--deleteTask").addEventListener("click", () => {
  showDeleteCheckboxes = !showDeleteCheckboxes;
  const checkboxes = document.querySelectorAll(".delete--item--checkbox");
  if (showDeleteCheckboxes) {
    createDeleteAllCheckbox();
    deleteTaskList = [];
    checkboxes.forEach((ch) => {
      ch.classList.add("show");

      ch.addEventListener("change", (e) => {
        if (ch.checked) {
          deleteTaskList.push(ch.value);
        } else {
          document.getElementById("delete--check--all").checked = false;
          deleteTaskList = deleteTaskList.filter((d) => d !== ch.value);
        }
      });
    });
  } else {
    checkboxes.forEach((ch) => ch.classList.remove("show"));
    deleteTasks();
  }
});
