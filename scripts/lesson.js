const getLessonIdFromUrlId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lessonId');
}

const getPartIdFromUrlId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('partId');
}

const getLessonParts = (lessonId) => {
    return fetch(`/lessons/stub/lessons.json`)
        .then(response => response.json())
        .then(lessons => lessons.find(l => l.id === lessonId)?.content || [])
}

const getPartContent = (lessonId, partId, prevLessonId) => {
    return fetch(`/lessons/stub/lessons.json`)
        .then(response => response.json())
        .then(lessons => {
            if (prevLessonId) {
                const actualLesson = lessons.find(l => l.id === prevLessonId)
                const actualLessonCourseId = actualLesson?.courseId;
                return lessons.find(l => l.id === lessonId && l.courseId === actualLessonCourseId);
            }
            return lessons.find(l => l.id === lessonId);
        })
        .then(lesson => {
            return {
                lesson: lesson,
                part: partId ? lesson?.content?.find(part => part?.id === partId) : lesson?.content?.[0]
            }
        })
}

const getLessonPartContent = async (lessonId, partId) => {
    const {part, lesson} = await getPartContent(lessonId, partId);
    const nextPartId = `${Number(partId) + 1}`;
    const prevPartId = `${Number(partId) - 1}`;
    const nextLessonId = `${Number(lessonId) + 1}`
    const nextPart = await getPartContent(lessonId, nextPartId);
    const prevPart = await getPartContent(lessonId, prevPartId);
    const nextLesson = await getPartContent(nextLessonId, null, lessonId);

    return {
        content: part,
        lesson: lesson,
        nextPartId: nextPart.part ? nextPartId : null,
        prevPartId: prevPart.part ? prevPartId : null,
        nextLessonId: nextLesson.lesson ? nextLessonId : null,
        firstNextLessonPart: nextLesson.part?.id
    }
}


const addClicksListeners = () => {
    const taskContent = document.getElementById('task-content');

    taskContent.addEventListener('click', (e) => {
        const target = e.target;
        const header = target.closest('.collapse-content__header');
        if (header) {
            const container = header.closest('.collapsed-content')
            const content = container.querySelector('.collapse-content__content');
            if (content) {
                content.classList.toggle('collapsed');
            }
        }
    })
}

const createVideoContent = (video) => {
    const {url} = video
    return `
        <iframe width="560" height="315" src="${url}"
            title="YouTube video player" frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    `
}

const createFilesHtml = (files) => {
    return files.reduce((acc, file) => {
        return acc + `
            <div class="single-file">
                 <div class="single-file__icon">
            
                 </div>
                 <div class="single-file__name">
                     ${file.name}
                 </div>
             </div>
        `
    }, '');
}

const createTestHtml = (test) => {
    return test.reduce((acc, question, qIdx) => {
        let answers = '';
        question.ans.forEach((answer, aIdx) => {
            answers += `
                <div class="task-test__question-answer">
                     <input type="radio" id="q${qIdx}-ans-${aIdx}" name="q${qIdx}-ans" value="q${qIdx}-ans-${aIdx}"/>
                     <label htmlFor="q${qIdx}-ans-${aIdx}" class="task-test__question-answer-label">${answer}</label>
                 </div>
            `
        })
        return acc + `
            <fieldset id="q1" name="q1" class="task-test__question">
                <h3 class="task-test__question-text">
                    ${question.title}
                </h3>
                ${answers}
            </fieldset>
        
        `
    }, '');
}

const insertProgress = (container, progress, withoutUniqueClass) => {
    container.innerHTML = `
        <div class="progress part-section-progress ${withoutUniqueClass ? '' : 'lesson-section'}">
            <div class="progress-bar" style="width: ${progress}%">
                
            </div>
            <div class="progress-label">
                Выполнено: ${progress} %
            </div>
        </div>
    `
}

const fillHtmlContentOnPage = (part, lesson) => {
    const lessonTitle = document.getElementById('lesson-title');

    const videoContent = document.getElementById('video-content');
    const textContent = document.getElementById('lecture-text');
    const filesContainer = document.getElementById('files-container');
    const testForm = document.getElementById('test-form');
    const homeworkText = document.getElementById('homework-text');

    const partProgressContainer = document.getElementById('part-progress');
    const videoProgressContainer = document.getElementById('video-progress');
    const audioProgressContainer = document.getElementById('audio-progress');
    const testProgressContainer = document.getElementById('test-progress');
    const lectureProgressContainer = document.getElementById('lecture-progress');


    lessonTitle.innerHTML = lesson.title;
    videoContent.innerHTML = createVideoContent(part.video);
    textContent.innerHTML = part.text.content;
    filesContainer.innerHTML = createFilesHtml(part.files);
    testForm.innerHTML = createTestHtml(part.test);
    homeworkText.innerHTML = part.homework.text;

    insertProgress(partProgressContainer, part.progress, true);
    insertProgress(videoProgressContainer, part.video.progress);
    insertProgress(audioProgressContainer, part.audio.progress);
    insertProgress(testProgressContainer, part.testProgress);
    insertProgress(lectureProgressContainer, part.text.progress);
}

const createLessonNavigation = (parts, partId, lessonId) => {
    const navigationContainer = document.getElementById('lesson-navigation');

    const partsHtmlContent = parts.reduce((acc, part) => {
        return acc + `
            <a href="/lessons/pages/lesson.html?lessonId=${lessonId}&partId=${part.id}">
                <div class="lesson-part-navigation-item ${partId === part.id ? 'active' : ''}">
                    ${part.name}
                </div>
            <a>
        `
    }, '');

    navigationContainer.innerHTML = `
        <div class="lesson-navigation__controls">
            <button id="prev-lesson-part-btn" class="accent">
                Предыдущая часть
            </button>
            <button id="next-lesson-part-btn" class="accent">
                Далее
            </button>
        </div>
        <div class="lesson-navigation__items">
            ${partsHtmlContent}
        </div>
    `
}

const enrichNavigationControls = (lessonId, partId, nextPartId, prevPartId, nextLessonId, firstNextLessonPart) => {
    const prevBtn = document.getElementById('prev-lesson-part-btn');
    const nextBtn = document.getElementById('next-lesson-part-btn');

    if (!prevPartId) {
        prevBtn.disabled = true;
        prevBtn.classList.remove('accent');
    } else {
        prevBtn.addEventListener('click', () => {
            window.location.href = `/lessons/pages/lesson.html?lessonId=${lessonId}&partId=${prevPartId}`;
        })
    }
    if (nextPartId) {
        nextBtn.addEventListener('click', () => {
            window.location.href = `/lessons/pages/lesson.html?lessonId=${lessonId}&partId=${nextPartId}`;
        })
    } else if (nextLessonId) {
        nextBtn.addEventListener('click', () => {
            window.location.href = `/lessons/pages/lesson.html?lessonId=${nextLessonId}&partId=${firstNextLessonPart}`;
        })
    } else {
        nextBtn.disabled = true;
        nextBtn.classList.remove('accent');
    }
}

const initPage = () => {
    addClicksListeners();

    const lessonId = getLessonIdFromUrlId();
    const partId = getPartIdFromUrlId();

    getLessonParts(lessonId)
        .then(parts => {
            console.log(parts)
            createLessonNavigation(parts, partId, lessonId)
        })
    getLessonPartContent(lessonId, partId)
        .then(result => {
            const {
                content,
                nextPartId,
                nextLessonId,
                prevPartId,
                lesson,
                firstNextLessonPart
            } = result
            fillHtmlContentOnPage(content, lesson);
            enrichNavigationControls(lessonId, partId, nextPartId, prevPartId, nextLessonId, firstNextLessonPart);
        })
}

initPage();

