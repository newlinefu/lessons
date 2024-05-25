const ALL_COURSES_PATH = '/lessons/pages/all-courses.html';
const LOGIN_PATH = '/lessons/pages/login.html';
const PROFILE_PATH = '/lessons/pages/profile.html';
const USER_COURSES_PATH = '/lessons/pages/user-courses.html';

const MENU_ICON_PATH = '/lessons/static/burger-icon.svg';

window.getCookie = function (name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

const createMainHeader = () => {
    const headerRoot = document.querySelector('header');
    const headerContentWithoutAuthorization = `
        <div class="site-header__controls header-left-controls">
            <div class="site-header__single-control link-header-control">
                <a href="${ALL_COURSES_PATH}" class="link">Все курсы</a>
            </div>
        </div>
        <div class="site-header__controls header-right-controls">
            <div class="site-header__single-control link-header-control">
                <a href="${LOGIN_PATH}" class="link">Вход / Регистрация</a>
            </div>
        </div>
    `;
    const headerContentAuthorized = `
        <div class="site-header__controls header-left-controls">
            <div class="site-header__single-control link-header-control">
                <div class="site-header__menu-btn" id="header-menu-btn">
                    <img src="${MENU_ICON_PATH}" alt="Меню" width="20" height="20">
                </div>
            </div>
            <div class="site-header__single-control link-header-control">
                <a href="${ALL_COURSES_PATH}" class="link">Все курсы</a>
            </div>
            <div class="site-header__single-control link-header-control">
                <a href="${USER_COURSES_PATH}" class="link">Мои курсы</a>
            </div>
        </div>
        <div class="site-header__controls header-right-controls">
            <div class="site-header__single-control link-header-control">
                <a href="${PROFILE_PATH}" class="link">Мой профиль</a>
            </div>
        </div>
    `;

    const accessToken = window.getCookie('access-token');
    headerRoot.innerHTML = accessToken ? headerContentAuthorized : headerContentWithoutAuthorization
}

const createLoginHeader = () => {
    const headerRoot = document.querySelector('header');
    headerRoot.innerHTML = `
        <div class="site-header__controls header-left-controls">
            <div class="site-header__single-control link-header-control">
                <a href="${ALL_COURSES_PATH}" class="link">Вернуться ко всем курсам</a>
            </div>
        </div>
        <div class="site-header__controls header-right-controls">
        </div>
    `
}

const createHeader = () => {
    const href = window.location.href;
    if (href.includes('login')) {
        createLoginHeader()
    } else {
        createMainHeader()
    }
}

const onMenuClick = () => {
    const aside = document.querySelector('aside');
    const headerMenuBtn = document.getElementById('header-menu-btn');
    const menuWrapper = headerMenuBtn.closest('.link-header-control')

    aside.classList.toggle('opened');
    if (menuWrapper) {
        menuWrapper.classList.toggle('accent')
    }
}

const addHeaderListeners = () => {
    const menuBtn = document.getElementById('header-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', onMenuClick);
    }
}

const fetchAsideContent = () => {
    const accessToken = window.getCookie('access-token');
    if (accessToken) {
        return fetch('/lessons/stub/summary.json')
            .then(response => response.json())
            .then(data => data);
    }
    return Promise.resolve(null)
}

const createAnnouncementInformation = (announcement) => {
    return `
        <div class="summary-information__item primary">
            <p class="summary-information__item-title">
                ${announcement.courseName}
            </p>
            <p class="summary-information__item-content">
                ${announcement.announcement}
            </p>
        </div>
    `;
}

const createTestInformation = (test) => {
    return `
        <div class="summary-information__item primary">
            <p class="summary-information__item-title">
                ${test.courseName}
            </p>
            <div class="summary-information__item-content">
                <p class="divided centered">
                    Контрольная
                </p>
                <p>
                    Дата проведения: ${test.date}
                </p>
            </div>
        </div>
    `;
}

const createReminderInformation = (reminder) => {
    let tasksInformation = ''

    reminder.tasks.forEach((task) => {
        let tagsInformation = '';

        task.tags.forEach((tag) => {
            tagsInformation += `
                <div class="tag">${tag}</div>
            `
        });

        tasksInformation += `
            <div class="summary-information__item-content">
                <p class="divided">
                    ${task.title}
                </p>
                <div class="tags-container">
                    ${tagsInformation}
                </div>
            </div>
        `
    });

    return `
        <div class="summary-information__item primary">
            <p class="summary-information__item-title">
                ${reminder.courseName}
            </p>
            ${tasksInformation}
        </div>
    `;
}

const fillAsideContent = () => {
    fetchAsideContent().then((data) => {
        if (!data) {
            return;
        }
        let asideContent = '';
        data.forEach(item => {
            const type = item.type;
            switch (type) {
                case 'announcement':
                    asideContent += createAnnouncementInformation(item);
                    break;
                case 'test':
                    asideContent += createTestInformation(item);
                    break;
                case 'reminder':
                    asideContent += createReminderInformation(item);
                    break;
                default:
                    break;
            }
        })
        const aside = document.querySelector('aside');
        aside.innerHTML = asideContent;
    })
}


createHeader();
addHeaderListeners();
fillAsideContent();
