// Кнопка "Меню" в шапке. На телефоне и планшете пункты меню скрыты,
// кнопка показывает и прячет их. С 1024px кнопка скрыта через CSS.
const menuButton = document.querySelector('.site-header__toggle');
const siteNav = document.getElementById('site-nav');

if (menuButton && siteNav) {
    menuButton.addEventListener('click', () => {
        // toggle добавляет класс, если его нет, и убирает, если есть.
        // Возвращает true, если меню открылось.
        const isOpen = siteNav.classList.toggle('site-nav--open');

        // aria-expanded сообщает программе чтения с экрана, открыто ли меню.
        menuButton.setAttribute('aria-expanded', isOpen);
    });

    // Клавиша Escape закрывает меню и возвращает фокус на кнопку.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && siteNav.classList.contains('site-nav--open')) {
            siteNav.classList.remove('site-nav--open');
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.focus();
        }
    });

    // После нажатия на пункт меню (например, якорь на этой же странице)
    // меню закрывается, чтобы не закрывать собой раздел.
    siteNav.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            siteNav.classList.remove('site-nav--open');
            menuButton.setAttribute('aria-expanded', 'false');
        }
    });
}

// Кнопка "Показать фильтры" в каталоге. На узком экране фильтры свёрнуты,
// с 1200px они всегда открыты, а кнопка скрыта через CSS.
const filtersButton = document.querySelector('.catalog-filters__toggle');
const catalogFilters = document.querySelector('.catalog-filters');

if (filtersButton && catalogFilters) {
    filtersButton.addEventListener('click', () => {
        const isOpen = catalogFilters.classList.toggle('catalog-filters--open');

        filtersButton.setAttribute('aria-expanded', isOpen);
        filtersButton.textContent = isOpen ? 'Скрыть фильтры' : 'Показать фильтры';
    });
}

// Модальное окно быстрого заказа есть только на главной странице,
// поэтому сначала проверяем, что оно найдено.
const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
    // Получаем все кнопки заказа в карточках товаров.
    const orderButtons = document.querySelectorAll('.product-card__button');

    // Получаем кнопку закрытия модального окна.
    const closeDialogButton = document.getElementById('close-order-dialog');

    // Получаем скрытое поле, в которое будет записан выбранный товар.
    const selectedProductInput = document.getElementById('selected-product');

    // Получаем место в окне, где показывается название товара.
    const dialogProductName = document.getElementById('order-dialog-product');

    // Перебираем все кнопки "Заказать".
    orderButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Получаем название товара из data-атрибута.
            const productName = button.dataset.product;

            // Записываем название товара в скрытое поле формы.
            selectedProductInput.value = productName;

            // Показываем название товара в модальном окне.
            dialogProductName.textContent = productName;

            // Открываем модальное окно.
            orderDialog.showModal();
        });
    });

    // Закрываем модальное окно по кнопке "Закрыть".
    closeDialogButton.addEventListener('click', () => {
        orderDialog.close();
    });
}

// Если на страницу заявки перешли по кнопке "Заказать" из каталога,
// в адресе есть ?product=... и этот товар сразу выбирается в списке.
const productSelect = document.getElementById('order-product');

if (productSelect) {
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');

    if (product) {
        productSelect.value = product;
    }
}

// Проверка формы перед отправкой. Одинаково работает для формы заявки
// (в модальном окне или на order.html) и формы обратной связи на contacts.html.
function setupForm(form, successMessage) {
    form.addEventListener('submit', (event) => {
        // Отменяем стандартную отправку формы,
        // потому что backend пока не подключён.
        event.preventDefault();

        // Сбрасываем предыдущие признаки ошибок.
        const formElements = Array.from(form.elements);

        formElements.forEach((element) => {
            if (element.willValidate) {
                element.removeAttribute('aria-invalid');
            }
        });

        // Проверяем встроенные HTML-ограничения формы.
        if (!form.checkValidity()) {
            formElements.forEach((element) => {
                if (element.willValidate && !element.checkValidity()) {
                    element.setAttribute('aria-invalid', 'true');
                }
            });

            // Показываем стандартные сообщения браузера.
            form.reportValidity();
            return;
        }

        // Показываем сообщение об успешной отправке.
        successMessage.hidden = false;

        // Очищаем форму.
        form.reset();

        // Закрываем модальное окно, если форма была в нём.
        if (orderDialog) {
            orderDialog.close();
        }
    });
}

// Форма заявки и сообщение об успешной отправке.
const orderForm = document.getElementById('order-form');

if (orderForm) {
    setupForm(orderForm, document.getElementById('success-message'));
}

// Форма обратной связи на странице контактов.
const feedbackForm = document.getElementById('feedback-form');

if (feedbackForm) {
    setupForm(feedbackForm, document.getElementById('feedback-success'));
}
