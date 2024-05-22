/*
    STUB DATA
 */

const COURSES_STUB = {
    data: [
        {
            id: '1',
            name: 'Что-то про 1С',
            teacher: {
                id: '1',
                name: 'Константинов М. К.'
            },
            tags: ['Бухгалтерия', 'Менеджмент'],
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid beatae dignissimos dolor exercitationem impedit ipsam minus modi necessitatibus nostrum omnis quaerat, quasi quia quisquam ratione, rerum sequi sunt vel!'
        },
        {
            id: '2',
            name: 'C# для чайников',
            teacher: {
                id: '2',
                name: 'Симонов А. М.'
            },
            tags: ['Программирование', 'ООП'],
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid beatae dignissimos dolor exercitationem impedit ipsam minus modi necessitatibus nostrum omnis quaerat, quasi quia quisquam ratione, rerum sequi sunt vel!'
        },
        {
            id: '3',
            name: 'Java: Beginner',
            teacher: {
                id: '3',
                name: 'Максимов Е. К.'
            },
            tags: ['Программирование', 'ООП', 'Стуктуры данных'],
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid beatae dignissimos dolor exercitationem impedit ipsam minus modi necessitatibus nostrum omnis quaerat, quasi quia quisquam ratione, rerum sequi sunt vel!'
        }
    ]
}

const USER_COURSES_STUB = {
    data: [
        {
            id: '1',
            name: 'Что-то про 1С',
            teacher: {
                id: '1',
                name: 'Константинов М. К.'
            },
            tags: ['Бухгалтерия', 'Менеджмент'],
            lastTask: {
                title: 'Настройка окружения',
                progress: 70
            }
        },
        {
            id: '2',
            name: 'C# для чайников',
            teacher: {
                id: '2',
                name: 'Симонов А. М.'
            },
            tags: ['Программирование', 'ООП'],
            lastTask: {
                title: 'Методы и функции',
                progress: 10
            }
        },
    ]
}

/*
    STUB DATA END
 */

const PAGE_COURSES_TYPE = {
    USER: 'user-courses',
    COMMON: 'common-courses'
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

const getUserCourses = (search, filters, page, limit) => {
    return new Promise((res, rej) => {
        setTimeout(() => res(USER_COURSES_STUB), 500)
    }).then(response => response.data);
}

const getAllCourses = (search, filters, page, limit) => {
    return new Promise((res, rej) => {
        setTimeout(() => res(COURSES_STUB), 500)
    }).then(response => response.data);
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
        <div class="course-list-item primary">
            <div class="course-list-item__header">
                <div class="course-list-item__header-title">
                    <a href="/lessons/generic-parts/single-course/single-course.html?courseId=${course.id}">${course.name}</a>
                </div>
                <div class="course-list-item__header-teacher">
                    ${course.teacher.name}
                </div>
            </div>
            <div class="tags-container">
                ${tagsHtmlContent}
            </div>
            <div class="course-list-item__task">
                <a class="course-list-item__task-title" href="/lessons/generic-parts/single-task/single-task.html">
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
    `;
}

const createCommonCourse = (course) => {
    const tagsHtmlContent = createTagsHtmlContent(course.tags);

    return `
        <div class="course-list-item primary">
            <div class="course-list-item__header">
                <div class="course-list-item__header-title">
                    <a href="/lessons/generic-parts/single-course/single-course.html?courseId=${course.id}">${course.name}</a>
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


