const LESSON_PATH = '/lessons/pages/lesson.html'

const LESSONS_PAGE_SIZE = 3;

const insertLessonsPageToUrl = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set('lessonsPage', page);
    window.history.pushState(null, '', url.toString());
}

const getLessonsPageFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lessonsPage');
};

const getCourseIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('courseId');
};

const addLessonsListContainers = () => {
    const coursesRoot = document.getElementById('lessons');

    coursesRoot.innerHTML = `
        <div class="single-course-tasks">
            <div class="tasks-list" id="tasks-container">

            </div>
            <div class="pagination" id="pagination-container"></div>
        </div>
    `
}

const createLessonsPagination = () => {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = `
        <button id="prev-page-btn">
             <<       
        </button>
        <div class="pagination__page-label">
            <span id="pagination-actual-page"></span> 
            / 
            <span id="pagination-total"></span>
        </div>
        <button id="next-page-btn">
            >>
        </button>
    `;
}

const updateLessonsPaginationControls = (page, total) => {
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    const pageTotalLabel = document.getElementById('pagination-total');
    const actualPageLabel = document.getElementById('pagination-actual-page');

    const totalPages = Math.ceil(total / LESSONS_PAGE_SIZE);
    pageTotalLabel.innerHTML = totalPages;
    actualPageLabel.innerHTML = page;
    if (page === 1) {
        prevBtn.disabled = true;
        prevBtn.classList.remove('accent');
    } else {
        prevBtn.disabled = false;
        prevBtn.classList.add('accent');
    }
    if (page === totalPages) {
        nextBtn.disabled = true;
        nextBtn.classList.remove('accent');
    } else {
        nextBtn.disabled = false;
        nextBtn.classList.add('accent');
    }
}

const createHtmlSingleTask = (task) => {
    return `
        <a href="${LESSON_PATH}?lessonId=${task.id}">
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


const getLessons = ({
                        courseId,
                        page,
                        search = ''
                    }) => {
    const takenIndexes = new Array(LESSONS_PAGE_SIZE).fill(undefined).map((_, idx) => LESSONS_PAGE_SIZE * (Number(page) - 1) + idx);
    return fetch('/lessons/stub/lessons.json')
        .then(response => response.json())
        .then(allLessons => {
            const totalCourseLessons = allLessons
                .filter(lesson => lesson.courseId === courseId)
            const pageLessons = totalCourseLessons
                .filter((_, idx) => takenIndexes.includes(idx));
            return {
                lessons: pageLessons,
                total: totalCourseLessons.length
            }
        });
}

const createLessonsList = (payload) => {
    const tasksContainer = document.getElementById('tasks-container');
    return getLessons(payload)
        .then((lessonsPayload) => {
            tasksContainer.innerHTML = lessonsPayload.lessons.reduce((acc, task) => acc + createHtmlSingleTask(task), '');
            return lessonsPayload;
        })
}

const changeLessonsPage = (page) => {
    insertLessonsPageToUrl(page);
    const courseId = getCourseIdFromUrl();
    const actualPage = Number(page) || 1
    const payload = {
        search: '',
        page: actualPage,
        courseId
    }
    createLessonsList(payload)
        .then(lessonsPayload => {
            updateLessonsPaginationControls(actualPage, lessonsPayload.total);
        })
}

const initLessonsList = () => {
    addLessonsListContainers();
    const courseId = getCourseIdFromUrl();
    const page = getLessonsPageFromUrl();
    if (!page) {
        insertLessonsPageToUrl("1");
    }
    const initialPage = Number(page) || 1
    createLessonsPagination();
    createLessonsList({courseId: courseId, page: initialPage})
        .then(lessonsPayload => {
            createLessonsPagination();
            updateLessonsPaginationControls(initialPage, lessonsPayload.total);
        })
        .then(() => {
            const prevBtn = document.getElementById('prev-page-btn');
            const nextBtn = document.getElementById('next-page-btn');

            prevBtn.addEventListener('click', () => {
                const page = getLessonsPageFromUrl();
                changeLessonsPage(Number(page) - 1);
            });

            nextBtn.addEventListener('click', () => {
                const page = getLessonsPageFromUrl();
                changeLessonsPage(Number(page) + 1);
            });
        })
}

initLessonsList();


