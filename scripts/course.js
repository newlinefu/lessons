const createFlatLessonsContainers = () => {
    const coursesRoot = document.getElementById('lessons');
    coursesRoot.innerHTML = `
        <div id="lessons-preview" class="lessons-preview">
            <h2 class="lessons-preview__title">Содержание</h2>
            <div id="lessons-preview-list-container">
            
            </div>
        </div>
    `
}

const insertHtmlFlatLessonsList = (courseData) => {
    createFlatLessonsContainers();
    const courseLessons = courseData.allTasks;
    const flatLessonsListContainer = document.getElementById('lessons-preview-list-container');

    flatLessonsListContainer.innerHTML = courseLessons.reduce((acc, lesson) => {
        return acc + `
            <div class="lessons-preview__lesson">
                ${lesson.title}
            </div>
        `
    }, '')
}

const insertCourseIdToUrl = (courseId) => {
    const url = new URL(window.location.href);
    url.searchParams.set('courseId', courseId);
    window.history.pushState(null, '', url.toString());
}

const getActualCourseIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('courseId');
};

const getIsUserCourseFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userCourse');
};

const getActualCourse = ({
                             isUserCourse,
                             courseId
                         }) => {
    const coursesUrl = isUserCourse ? '/lessons/stub/user-courses.json' : '/lessons/stub/all-courses.json';
    const lessonsUrl = '/lessons/stub/lessons.json';

    return fetch(coursesUrl)
        .then(response => response.json())
        .then(data => data.find(course => course.id === courseId))
        .then(courseData => {
            if (courseData) {
                return fetch(lessonsUrl)
                    .then(lessons =>
                        lessons.json()
                    )
                    .then(lessons => lessons.filter(lesson => lesson.courseId === courseId))
                    .then(courseLessons => {
                        let lastTaskData;
                        if (courseData.lastTask) {
                            lastTaskData = courseLessons.find(lesson => lesson.id === courseData.lastTask.id)
                        }
                        return {
                            ...courseData,
                            allTasks: courseLessons,
                            lastTaskData
                        }
                    })
            }
            return Promise.resolve(null)
        })

}


const getActualCourseData = async ({courseId}) => {
    const isUserCourse = getIsUserCourseFromUrl();
    return await getActualCourse({isUserCourse, courseId});
}

const insertHtmlContent = (courseData) => {
    console.log(courseData);

    const titleContainer = document.getElementById('course-title');
    const tagsContainer = document.getElementById('course-tags');
    const descriptionContainer = document.getElementById('course-description');
    const imgContainer = document.getElementById('course-img');
    const teacherContainer = document.getElementById('course-teacher');

    titleContainer.innerHTML = courseData.name;
    tagsContainer.innerHTML = (courseData.tags || []).reduce((acc, tag) => {
        return acc + `
            <div class="tag">
                ${tag}
            </div>
        `
    }, '');
    descriptionContainer.innerHTML = courseData.description;
    imgContainer.innerHTML = `<img src="${courseData.img}" alt="">`
    teacherContainer.innerHTML = courseData.teacher.name;

}

const initCoursePage = () => {
    let courseId = getActualCourseIdFromUrl();
    const isUserCourse = getIsUserCourseFromUrl();
    if (!courseId) {
        const initCourseId = "1"
        insertCourseIdToUrl(initCourseId);
        courseId = initCourseId;
    }
    getActualCourseData({
        courseId
    })
        .then((data) => {
            insertHtmlContent(data);
            if (!isUserCourse) {
                insertHtmlFlatLessonsList(data);
            }
        });
}

initCoursePage();