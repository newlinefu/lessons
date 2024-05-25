const LESSON_PATH = '/lessons/pages/lesson.html'

const createTasksPagination = () => {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = `
        <button disabled="disabled">
             <<
        </button>
        <div class="pagination__page-label">
            1 / 2
        </div>
        <button class="accent">
            >>
        </button>
    `;
}

const createHtmlSingleTask = (task) => {
    return `
        <a href="${LESSON_PATH}">
            <div class="course-single-task">
                <h3 class="course-single-task__title">${task.title}</h3>
                <div class="progress">
                    <div class="progress-bar" style="width: ${task.progress}%">
    
                    </div>
                    <div class="progress-label">
                        Выполнено: ${task.progress} %
                    </div>
                </div>
            </div>
        </a>
    `
}

const getTasks = (page, limit) => {
    return fetch('/lessons/stub/lessons.json')
        .then(response => response.json())
        .then(data => data);
}

const createTasksList = () => {
    const tasksContainer = document.getElementById('tasks-container');
    getTasks()
        .then((tasks) => {
            tasksContainer.innerHTML = tasks.reduce((acc, task) => acc + createHtmlSingleTask(task), '');
        })
}

createTasksPagination();
createTasksList();