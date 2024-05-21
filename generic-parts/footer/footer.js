const addFooterToPage = () => {
    const footerElem = document.querySelector('footer');
    footerElem.classList.add('primary-dark');

    footerElem.innerHTML = `
        <section class="page-content-block footer__content">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores cumque, delectus doloremque dolorum
            eaque eligendi esse id, labore laboriosam nulla sapiente tempore vero voluptate! Aut facere iste odio
            possimus repudiandae?
        </section>
    `
}


addFooterToPage()