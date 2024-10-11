
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const error = document.getElementById('error');
const showAllBtn = document.getElementById('showAll');
const showActiveBtn = document.getElementById('showActive');
const showCompletedBtn = document.getElementById('showCompleted');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText.length < 3) {
        showError('Task must be at least 3 characters!');
        return;
    }

    const newTask = { text: taskText, completed: false };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
});

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    taskInput.classList.add('error');
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) li.classList.add('completed');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            deleteTask(index);
        });
        
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = task.completed ? 'Undo' : 'Complete';
        toggleBtn.addEventListener('click', () => {
            toggleTask(index);
        });

        li.appendChild(deleteBtn);
        li.appendChild(toggleBtn);
        taskList.appendChild(li);
    });
    updateTaskCount();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function updateTaskCount() {
    const openTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = openTasks;
}


showAllBtn.addEventListener('click', function () {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();
});

showActiveBtn.addEventListener('click', function () {
    const activeTasks = tasks.filter(task => !task.completed);
    renderFilteredTasks(activeTasks);
});

showCompletedBtn.addEventListener('click', function () {
    const completedTasks = tasks.filter(task => task.completed);
    renderFilteredTasks(completedTasks);
});

function renderFilteredTasks(filteredTasks) {
    taskList.innerHTML = '';
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) li.classList.add('completed');

        taskList.appendChild(li);
    });
}

renderTasks();
