/*
    STUB DATA
 */

const TASKS_LIST_STUB = {
    data: [
        {
            title: 'Методы и функции',
            progress: 50
        },
        {
            title: 'Классы',
            progress: 10
        },
        {
            title: 'Наследование',
            progress: 0
        }
    ]
}

/*
    END OF STUB DATA
 */


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
        <a href="/lessons/generic-parts/single-task/single-task.html">
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
    return new Promise((res, rej) => {
        setTimeout(() => res(TASKS_LIST_STUB), 500)
    }).then(response => response.data);
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