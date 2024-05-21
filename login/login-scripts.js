const GENERAL_ERROR_TEXT = 'Что-то пошло не так, повторите попытку позднее.';
const REPEATED_PASSWORD_ERROR_TEXT = 'Пароли должны совпадать';
const PAGE_BEHAVIOUR = 'type';
const WAITING_FOR_ACCEPT_STATE = 'waiting-for-accept';
const PAGE_TYPES = {
    LOGIN: 'login',
    REGISTER: 'register'
}
const COMMON_FIELD_WRAPPER_IDS = {
    LOGIN: 'sign-in-login',
    PASSWORD: 'sign-in-password'
}
const REGISTER_FIELD_WRAPPER_IDS = {
    EMAIL: 'sign-in-email',
    TELEPHONE: 'sign-in-telephone',
    REPEATED_PASSWORD: 'sign-in-repeated-password'
}
const PAGE_BUTTONS = {
    LOGIN_BTN: 'login-btn',
    REGISTER_BTN: 'register-btn'
}

const FORM_FIELDS = {
    LOGIN: 'login',
    PASSWORD: 'password',
    REPEATED_PASSWORD: 'repeated-password',
    EMAIL: 'email',
    TELEPHONE: 'telephone',
    EMAIL_CODE: 'email-code',
    TELEPHONE_CODE: 'telephone-code'
}

const ACCENT_BTN_CLASS = 'accent-btn';

const getPageType = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(PAGE_BEHAVIOUR);
}

const clearWaitingForAccept = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const acceptId = urlParams.get(WAITING_FOR_ACCEPT_STATE);
    if (acceptId) {
        const url = new URL(window.location.href);
        url.searchParams.delete(WAITING_FOR_ACCEPT_STATE);
        window.history.pushState(null, '', url.toString());
    }
}

const changeQueryPageType = (type) => {
    const url = new URL(window.location.href);
    url.searchParams.set(PAGE_BEHAVIOUR, type);
    window.history.pushState(null, '', url.toString());
}

const addAcceptId = (id) => {
    const url = new URL(window.location.href);
    url.searchParams.set(WAITING_FOR_ACCEPT_STATE, id);
    window.history.pushState(null, '', url.toString());
}

const getAcceptId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(WAITING_FOR_ACCEPT_STATE);
}

const fillQueryParameters = () => {
    const actualType = getPageType()
    if (!actualType) {
        changeQueryPageType(PAGE_TYPES.LOGIN)
    }
    clearWaitingForAccept()
}

const getRegisterFields = () => {
    const emailField = document.getElementById(REGISTER_FIELD_WRAPPER_IDS.EMAIL);
    const telephoneField = document.getElementById(REGISTER_FIELD_WRAPPER_IDS.TELEPHONE);
    const repeatedPasswordField = document.getElementById(REGISTER_FIELD_WRAPPER_IDS.REPEATED_PASSWORD);

    return {
        emailField, telephoneField, repeatedPasswordField
    }
}

const getFormButtons = () => {
    const loginBtn = document.getElementById(PAGE_BUTTONS.LOGIN_BTN);
    const registerBtn = document.getElementById(PAGE_BUTTONS.REGISTER_BTN);

    return {loginBtn, registerBtn}
}

const changeHighlightButtonForClick = (type, highlighted) => {
    const {registerBtn, loginBtn} = getFormButtons()
    if (type === PAGE_TYPES.LOGIN) {
        if (highlighted) {
            loginBtn.classList.add(ACCENT_BTN_CLASS);
        } else {
            loginBtn.classList.remove(ACCENT_BTN_CLASS);
        }
    } else {
        if (highlighted) {
            registerBtn.classList.add(ACCENT_BTN_CLASS)
        } else {
            registerBtn.classList.remove(ACCENT_BTN_CLASS)
        }
    }
}

const clearForm = (actualType) => {
    document.querySelector('#' + COMMON_FIELD_WRAPPER_IDS.LOGIN + ' > input').value = ''
    document.querySelector('#' + COMMON_FIELD_WRAPPER_IDS.PASSWORD + ' > input').value = ''
    if (actualType === PAGE_TYPES.REGISTER) {
        document.querySelector('#' + REGISTER_FIELD_WRAPPER_IDS.EMAIL + ' > input').value = '';
        document.querySelector('#' + REGISTER_FIELD_WRAPPER_IDS.REPEATED_PASSWORD + ' > input').value = '';
        document.querySelector('#' + REGISTER_FIELD_WRAPPER_IDS.TELEPHONE + ' > input').value = '';
    }
}

const hideRegisterFields = () => {
    const {repeatedPasswordField, telephoneField, emailField} = getRegisterFields();

    emailField.classList.add('hidden');
    telephoneField.classList.add('hidden');
    repeatedPasswordField.classList.add('hidden');

    const emailCode = emailField.querySelector('.submit-code-wrapper');
    const telephoneCode = telephoneField.querySelector('.submit-code-wrapper');

    emailCode.classList.add('hidden');
    telephoneCode.classList.add('hidden');
}

const showRegisterFields = () => {
    const {repeatedPasswordField, telephoneField, emailField} = getRegisterFields();

    emailField.classList.remove('hidden');
    telephoneField.classList.remove('hidden');
    repeatedPasswordField.classList.remove('hidden');

}

const changeButtonsRatio = (type) => {
    const {registerBtn, loginBtn} = getFormButtons()
    if (type === PAGE_TYPES.LOGIN) {
        loginBtn.classList.add('dominant');
        registerBtn.classList.remove('dominant');
        loginBtn.classList.remove('subordinate');
        registerBtn.classList.add('subordinate');
    } else {
        loginBtn.classList.remove('dominant');
        registerBtn.classList.add('dominant');
        loginBtn.classList.add('subordinate');
        registerBtn.classList.remove('subordinate');
    }
}

const changeToWaitingState = (formData) => {
    const telephone = formData.get(FORM_FIELDS.TELEPHONE);
    const email = formData.get(FORM_FIELDS.EMAIL);
    let codeFieldSelector = ''
    if (email) {
        codeFieldSelector = '#' + REGISTER_FIELD_WRAPPER_IDS.EMAIL + ' > .submit-code-wrapper';
    } else if (telephone) {
        codeFieldSelector = '#' + REGISTER_FIELD_WRAPPER_IDS.TELEPHONE + ' > .submit-code-wrapper';
    }
    const codeField = document.querySelector(codeFieldSelector);
    codeField.classList.remove('hidden')
}

const selectFormType = () => {
    const actualType = getPageType()
    const form = document.getElementById('sign-in-form');

    if (actualType === PAGE_TYPES.LOGIN) {
        changeHighlightButtonForClick(PAGE_TYPES.REGISTER, false);
        hideRegisterFields();
        form.classList.add('login');
        form.classList.remove('register');
    } else {
        changeHighlightButtonForClick(PAGE_TYPES.LOGIN, false);
        showRegisterFields();
        form.classList.remove('login');
        form.classList.add('register');
    }
    clearForm(actualType)
    changeButtonsRatio(actualType);

}

const onLoginBtnClick = () => {
    const pageType = getPageType()
    if (pageType !== PAGE_TYPES.LOGIN) {
        changeQueryPageType(PAGE_TYPES.LOGIN)
        selectFormType()
    }

}

const onRegisterBtnClick = () => {
    const pageType = getPageType()
    if (pageType !== PAGE_TYPES.REGISTER) {
        changeQueryPageType(PAGE_TYPES.REGISTER)
        selectFormType()
    }
}

const displayGeneralError = (errorText) => {
    const error = document.getElementById('form-general-error');
    error.innerText = errorText || GENERAL_ERROR_TEXT;
}

const hideGeneralError = () => {
    const error = document.getElementById('form-general-error');
    error.innerText = '';
}

const displayRepeatedPasswordError = (errorText) => {
    const error = document.querySelector('#' + REGISTER_FIELD_WRAPPER_IDS.REPEATED_PASSWORD + ' > .field-error');
    error.classList.remove('hidden');
    error.innerText = errorText || REPEATED_PASSWORD_ERROR_TEXT;
}

const hideRepeatedPasswordError = () => {
    const error = document.querySelector('#' + REGISTER_FIELD_WRAPPER_IDS.REPEATED_PASSWORD + ' > .field-error');
    error.classList.add('hidden');
    error.innerText = '';
}

const displayLoginError = (errorText) => {
    const error = document.querySelector('#' + COMMON_FIELD_WRAPPER_IDS.LOGIN + ' > .field-error');
    error.innerText = errorText || GENERAL_ERROR_TEXT;
}

const hideLoginError = () => {
    const error = document.querySelector('#' + COMMON_FIELD_WRAPPER_IDS.LOGIN + ' > .field-error');
    error.innerText = '';
}

const validateFields = (pageType, formData) => {
    let isFormDataFilled = false;
    if (pageType === PAGE_TYPES.LOGIN) {
        isFormDataFilled = formData.get(FORM_FIELDS.LOGIN)
            && formData.get(FORM_FIELDS.PASSWORD)
    }
    if (pageType === PAGE_TYPES.REGISTER) {
        const acceptId = getAcceptId();
        if (acceptId) {
            isFormDataFilled = formData.get(FORM_FIELDS.TELEPHONE_CODE) || formData.get(FORM_FIELDS.EMAIL_CODE);
        } else {
            isFormDataFilled = formData.get(FORM_FIELDS.LOGIN)
                && (formData.get(FORM_FIELDS.EMAIL)
                    || formData.get(FORM_FIELDS.TELEPHONE))
                && formData.get(FORM_FIELDS.PASSWORD)
                && formData.get(FORM_FIELDS.REPEATED_PASSWORD)
        }
    }

    const isPasswordsAreEqual = isFormDataFilled && formData.get(FORM_FIELDS.REPEATED_PASSWORD) === formData.get(FORM_FIELDS.PASSWORD);
    return {
        isFormDataFilled,
        isPasswordsAreEqual
    }
}

function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

// add login logic here
const login = (formData) => {
    return new Promise((res, rej) => {
        console.log({
            [FORM_FIELDS.LOGIN]: formData.get(FORM_FIELDS.LOGIN),
            [FORM_FIELDS.PASSWORD]: formData.get(FORM_FIELDS.PASSWORD)
        });
        setTimeout(() => res({data: {'access-token': 'asd'}}), 300)
    }).then((response) => {
        const token = response.data['access-token'];
        setCookie('access-token', token, 1);
    })
}

const getAcceptCode = (formData) => {
    return new Promise((res, rej) => {
        console.dir({
            [FORM_FIELDS.LOGIN]: formData.get(FORM_FIELDS.LOGIN),
            [FORM_FIELDS.PASSWORD]: formData.get(FORM_FIELDS.PASSWORD),
            [FORM_FIELDS.EMAIL]: formData.get(FORM_FIELDS.EMAIL),
            [FORM_FIELDS.REPEATED_PASSWORD]: formData.get(FORM_FIELDS.REPEATED_PASSWORD),
            [FORM_FIELDS.TELEPHONE]: formData.get(FORM_FIELDS.TELEPHONE)
        });
        setTimeout(() => res({data: {'accept-id': 'asd'}}), 300)
    }).then((response) => {
        const waitingForAcceptId = response.data['accept-id'];
        addAcceptId(waitingForAcceptId)
    });
}

const register = (formData) => {
    return new Promise((res, rej) => {
        console.dir({
            [FORM_FIELDS.EMAIL_CODE]: formData.get(FORM_FIELDS.EMAIL_CODE),
            [FORM_FIELDS.TELEPHONE_CODE]: formData.get(FORM_FIELDS.TELEPHONE_CODE)
        });
        setTimeout(() => res({data: {'access-token': 'asd'}}), 300)
    }).then((response) => {
        const token = response.data['access-token'];
        setCookie('access-token', token, 1);
    });
}

const formSubmit = (e) => {
    const form = document.getElementById('sign-in-form');
    const formData = new FormData(form);
    const actualType = getPageType();
    const actualButtonId = e.target.id;
    if (actualType === PAGE_TYPES.LOGIN && actualButtonId === PAGE_BUTTONS.LOGIN_BTN) {
        const { isFormDataFilled} = validateFields(actualType, formData);
        if (!isFormDataFilled) {
            return;
        }
        login(formData)
            .then(() => {
                document.location.href = '/lessons/all-courses.html'
            })
            .catch(() => displayGeneralError())
    }
    if (actualType === PAGE_TYPES.REGISTER && actualButtonId === PAGE_BUTTONS.REGISTER_BTN) {
        const acceptId = getAcceptId();
        const { isFormDataFilled, isPasswordsAreEqual} = validateFields(actualType, formData);
        if (!isFormDataFilled) {
            return
        }
        hideRepeatedPasswordError();
        if (acceptId) {
            register(formData)
                .then(() => {
                    document.location.href = '/all-courses.html'
                })
                .catch(() => displayGeneralError())
        } else {
            if (!isPasswordsAreEqual) {
                displayRepeatedPasswordError()
                return;
            }
            getAcceptCode(formData)
                .then(() => changeToWaitingState(formData))
                .catch((err) => {
                    console.log(err)
                    displayGeneralError()
                })
        }
    }
}

const addHandlersToLoginForm = () => {
    const form = document.getElementById('sign-in-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    loginBtn.addEventListener('click', onLoginBtnClick);
    loginBtn.addEventListener('click', formSubmit);
    registerBtn.addEventListener('click', onRegisterBtnClick);
    registerBtn.addEventListener('click', formSubmit);

    form.addEventListener('change', (e) => {
        const actualType = getPageType()

        const formData = new FormData(form);
        const { isFormDataFilled } = validateFields(actualType, formData);

        changeHighlightButtonForClick(actualType, isFormDataFilled);
    });
}

fillQueryParameters()
selectFormType()
addHandlersToLoginForm()


