const addClicksListeners = () => {
    const taskContent = document.getElementById('task-content');

    taskContent.addEventListener('click', (e) => {
        const target = e.target;
        const header = target.closest('.collapsed-content');
        if (header) {
            const content = header.querySelector('.collapse-content__content');
            console.log(content);
            if (content) {
                content.classList.toggle('collapsed');
            }
        }
    })
}

addClicksListeners();
