const PATH_TO_STUB = '/lessons/stub';
const COURSE_PATH = '/lessons/pages/course.html';
const TASK_PATH = '/lessons/pages/lesson.html'

const COURSES_PAGE_SIZE = 3;
const PAGE_COURSES_TYPE = {
    USER: 'user-courses',
    COMMON: 'common-courses'
}

const insertCoursesPageToUrl = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set('coursesPage', page);
    window.history.pushState(null, '', url.toString());
}

const getCoursesPageFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('coursesPage');
};

const getUserCourses = ({
                            type,
                            search = '',
                            filters = {},
                            page = 1
                        }) => {
    const lessonsUrl = '/lessons/stub/lessons.json';
    const takenIndexes = new Array(COURSES_PAGE_SIZE).fill(undefined).map((_, idx) => COURSES_PAGE_SIZE * (Number(page) - 1) + idx);
    return fetch(`${PATH_TO_STUB}/user-courses.json`)
        .then(response => response.json())
        .then(data => data)
        .then(coursesData => {
            const enrichedCoursesData = [...coursesData];
            const promises = [];
            coursesData.forEach((courseData, idx) => {
                const coursePromise = fetch(lessonsUrl)
                    .then(lessons => lessons.json())
                    .then(lessons => lessons.filter(lesson => lesson.courseId === courseData.id))
                    .then(courseLessons => {
                        let lastTaskData;
                        if (courseData.lastTask) {
                            lastTaskData = courseLessons.find(lesson => lesson.id === courseData.lastTask.id)
                        }
                        return {courseLessons, lastTaskData}
                    }).then((lessonsData) => {
                        enrichedCoursesData[idx].lastTaskData = lessonsData.lastTaskData;
                        enrichedCoursesData[idx].allTasks = lessonsData.courseLessons;
                    })
                promises.push(coursePromise)
            })
            return Promise.all(promises).then(() => {
                console.log(enrichedCoursesData);
                return enrichedCoursesData
            })
        })
        .then(coursesTotal => {
            const filteredCourses = coursesTotal.filter((_, idx) => takenIndexes.includes(idx));
            return {courses: filteredCourses, total: coursesTotal.length}
        });
}

const getAllCourses = ({
                           type,
                           search = '',
                           filters = {},
                           page = 1
                       }) => {
    const lessonsUrl = '/lessons/stub/lessons.json';
    const takenIndexes = new Array(COURSES_PAGE_SIZE).fill(undefined).map((_, idx) => COURSES_PAGE_SIZE * (Number(page) - 1) + idx);
    return fetch(`${PATH_TO_STUB}/all-courses.json`)
        .then(response => response.json())
        .then(data => data)
        .then(coursesData => {
            const enrichedCoursesData = [...coursesData];
            const promises = [];
            coursesData.forEach((courseData, idx) => {
                const coursePromise = fetch(lessonsUrl)
                    .then(lessons => lessons.json())
                    .then(lessons => lessons.filter(lesson => lesson.courseId === courseData.id))
                    .then(courseLessons => {
                        let lastTaskData;
                        if (courseData.lastTask) {
                            lastTaskData = courseLessons.find(lesson => lesson.id === courseData.lastTask.id)
                        }
                        return {courseLessons, lastTaskData}
                    }).then((lessonsData) => {
                        enrichedCoursesData[idx].lastTaskData = lessonsData.lastTaskData;
                        enrichedCoursesData[idx].allTasks = lessonsData.courseLessons;
                    })
                promises.push(coursePromise)
            })
            return Promise.all(promises).then(() => enrichedCoursesData)
        })
        .then(coursesTotal => {
            const filteredCourses = coursesTotal.filter((_, idx) => takenIndexes.includes(idx));
            return {courses: filteredCourses, total: coursesTotal.length}
        });

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

const getCourses = (payload) => {
    const {type} = payload
    switch (type) {
        case PAGE_COURSES_TYPE.USER:
            return getUserCourses(payload);
        case PAGE_COURSES_TYPE.COMMON:
            return getAllCourses(payload);
        default:
            return Promise.resolve({courses: [], total: 0});
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
        <a href="${COURSE_PATH}?courseId=${course.id}&userCourse=true">
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
                        ${course.lastTaskData.title}
                    </a>
                    <div class="progress">
                        <div class="progress-bar" style="width: ${course.lastTask.progress}%">
                            
                        </div>
                        <div class="progress-label">
                            Выполнено: ${course.lastTaskData.progress} %
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

const createCoursesPagination = () => {
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

const createCoursesList = (payload) => {
    const coursesContainer = document.getElementById('courses-container');

    return getCourses(payload)
        .then(({courses, total}) => {
            coursesContainer.innerHTML = courses.reduce((acc, course) => acc + createHtmlCourse(payload.type, course), '');
            return { courses, total }
        })
        .then((coursesPayload) => coursesPayload)
}

const updateCoursesPaginationControls = (page, total) => {
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    const pageTotalLabel = document.getElementById('pagination-total');
    const actualPageLabel = document.getElementById('pagination-actual-page');

    const totalPages = Math.ceil(total / COURSES_PAGE_SIZE);
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

const changeCoursesPage = (page) => {
    insertCoursesPageToUrl(page);
    const coursesType = definePageCoursesType();
    const actualPage = Number(page) || 1
    const payload = {
        type: coursesType,
        search: '',
        filters: {},
        page: actualPage
    }
    createCoursesList(payload)
        .then(coursesPayload => {
            updateCoursesPaginationControls(actualPage, coursesPayload.total);
        })
}

const initCoursesList = () => {
    const page = getCoursesPageFromUrl();
    if (!page) {
        insertCoursesPageToUrl(1)
    }
    const coursesType = definePageCoursesType();
    const actualPage = Number(page) || 1
    const payload = {
        type: coursesType,
        search: '',
        filters: {},
        page: actualPage
    }
    createCoursesList(payload)
        .then(coursesPayload => {
            createCoursesPagination();
            updateCoursesPaginationControls(actualPage, coursesPayload.total);
        })
        .then(() => {
            const prevBtn = document.getElementById('prev-page-btn');
            const nextBtn = document.getElementById('next-page-btn');

            prevBtn.addEventListener('click', () => {
                const page = getCoursesPageFromUrl();
                changeCoursesPage(Number(page) - 1);
            });

            nextBtn.addEventListener('click', () => {
                const page = getCoursesPageFromUrl();
                changeCoursesPage(Number(page) + 1);
            });
        })
}

initCoursesList();





