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

addClicksListeners();
