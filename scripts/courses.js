const PATH_TO_STUB = '/lessons/stub';
const COURSE_PATH = '/lessons/pages/course.html';
const TASK_PATH = '/lessons/pages/lesson.html'

const PAGE_COURSES_TYPE = {
    USER: 'user-courses',
    COMMON: 'common-courses'
}

const getUserCourses = (search, filters, page, limit) => {
    return fetch(`${PATH_TO_STUB}/user-courses.json`)
        .then(response => response.json())
        .then(data => data);
}

const getAllCourses = (search, filters, page, limit) => {
    return fetch(`${PATH_TO_STUB}/all-courses.json`)
        .then(response => response.json())
        .then(data => data);
}

const definePageCoursesType = () => {
    const href = window.location.href;
    if (href.includes('all-courses')) {
        return PAGE_COURSES_TYPE.COMMON
    }

    if (href.includes('user-courses')) {
        return PAGE_COURSES_TYPE.USER
    }
    return Promise.resolve([])
}

const getCourses = (type, search = '', filters = {}, page = 1, limit = 5) => {
    switch (type) {
        case PAGE_COURSES_TYPE.USER:
            return getUserCourses(search, filters, page, limit);
        case PAGE_COURSES_TYPE.COMMON:
            return getAllCourses(search, filters, page, limit);
        default:
            return Promise.resolve([]);
    }
}

const createTagsHtmlContent = (tags) => {
    return tags.reduce((acc, tag) => acc += `
        <div class="tag">
            ${tag}
        </div>
    `, '');
}

const createUserCourse = (course) => {
    const tagsHtmlContent = createTagsHtmlContent(course.tags);

    return `
        <a href="${COURSE_PATH}?courseId=${course.id}">
            <div class="course-list-item">
                <div class="course-list-item__header">
                    <div class="course-list-item__header-title">
                        ${course.name}
                    </div>
                    <div class="course-list-item__header-teacher">
                        ${course.teacher.name}
                    </div>
                </div>
                <div class="tags-container">
                    ${tagsHtmlContent}
                </div>
                <div class="course-list-item__task">
                    <a class="course-list-item__task-title" href="${TASK_PATH}">
                        ${course.lastTask.title}
                    </a>
                    <div class="progress">
                        <div class="progress-bar" style="width: ${course.lastTask.progress}%">
                            
                        </div>
                        <div class="progress-label">
                            Выполнено: ${course.lastTask.progress} %
                        </div>
                    </div>
                </div>
            </div>
        </a>
    `;
}

const createCommonCourse = (course) => {
    const tagsHtmlContent = createTagsHtmlContent(course.tags);

    return `
        <a href="${COURSE_PATH}?courseId=${course.id}">
            <div class="course-list-item">
                <div class="course-list-item__header">
                    <div class="course-list-item__header-title">
                        ${course.name}
                    </div>
                    <div class="course-list-item__header-teacher">
                        ${course.teacher.name}
                    </div>
                </div>
                <div class="tags-container">
                    ${tagsHtmlContent};
                </div>
                <div class="course-list-item__description">
                    ${course.description}
                </div>
            </div>
        </a>
    `;
}

const createHtmlCourse = (type, course) => {
    switch (type) {
        case PAGE_COURSES_TYPE.USER:
            return createUserCourse(course)
        case PAGE_COURSES_TYPE.COMMON:
            return createCommonCourse(course)
        default:
            return ''
    }
}

const createPagination = () => {
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

const createCoursesList = () => {
    const coursesContainer = document.getElementById('courses-container');
    const coursesType = definePageCoursesType();
    getCourses(coursesType)
        .then((courses) => {
            coursesContainer.innerHTML = courses.reduce((acc, course) => acc + createHtmlCourse(coursesType, course), '');
        })
}


createCoursesList();
createPagination();


