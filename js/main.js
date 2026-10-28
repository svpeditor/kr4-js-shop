// Проверка подключения. Массив products создан в data.js,
// поэтому data.js подключается на страницах раньше main.js.
console.log('Файл main.js подключён');
console.table(products);

// Цена в виде строки. toLocaleString('ru-RU') разделяет разряды: 9400 -> "9 400 ₽".
function formatPrice(price) {
    return `${price.toLocaleString('ru-RU')} ₽`;
}

// Размер скидки в рублях.
function calculateDiscount(price, discountPercent) {
    return price * discountPercent / 100;
}

// Цена с учётом скидки.
function calculateFinalPrice(price, discountPercent) {
    const discountValue = calculateDiscount(price, discountPercent);
    return price - discountValue;
}

function getProductStatus(product) {
    if (product.isAvailable) {
        return 'В наличии';
    }

    return 'Нет в наличии';
}

// Краткое описание товара: название, цена со скидкой и наличие.
function createProductSummary(product) {
    const finalPrice = calculateFinalPrice(product.price, product.discountPercent);
    const status = getProductStatus(product);
    return `${product.title}: ${formatPrice(finalPrice)}. Статус: ${status}.`;
}

// Массив названий товаров.
function getProductTitles(products) {
    return products.map((product) => product.title);
}

// Только товары в наличии.
function getAvailableProducts(products) {
    return products.filter((product) => product.isAvailable);
}

function findProductById(products, id) {
    return products.find((product) => product.id === id);
}

// Сумма цен всех товаров через reduce.
function calculateTotalPrice(products) {
    return products.reduce((sum, product) => {
        return sum + product.price;
    }, 0);
}

function countAvailableProducts(products) {
    return products.filter((product) => product.isAvailable).length;
}

function calculateAveragePrice(products) {
    if (products.length === 0) {
        return 0;
    }

    const totalPrice = calculateTotalPrice(products);
    return Math.round(totalPrice / products.length);
}

// Перебор массива циклом for по индексам и циклом for...of.
for (let i = 0; i < products.length; i += 1) {
    console.log(`${i + 1}. ${products[i].title}`);
}

for (const product of products) {
    if (product.isAvailable) {
        console.log(`${product.title} - в наличии`);
    } else {
        console.log(`${product.title} - нет в наличии`);
    }
}

console.log(getProductTitles(products));
console.table(getAvailableProducts(products));

const selectedProduct = findProductById(products, 3);

if (selectedProduct) {
    console.log(`Найден товар: ${selectedProduct.title}`);
    console.log(createProductSummary(selectedProduct));
} else {
    console.log('Товар не найден');
}

console.log(calculateTotalPrice(products));
console.log(countAvailableProducts(products));
console.log(calculateAveragePrice(products));

// Краткая статистика на странице. Блок "Проверка JavaScript" есть только
// на главной, поэтому перед записью проверяем, что элемент найден.
const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

if (messageElement) {
    messageElement.textContent = 'Массив товаров и функции обработки данных подключены.';
}

if (productOutputElement) {
    productOutputElement.textContent = [
        `Всего товаров: ${products.length}`,
        `Товаров в наличии: ${countAvailableProducts(products)}`,
        `Средняя цена: ${formatPrice(calculateAveragePrice(products))}`
    ].join('\n');
}

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

// Проверка формы обратной связи на contacts.html (осталась из КР №3).
// Форма заявки теперь проверяется в validation.js.
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
    });
}

// Форма обратной связи на странице контактов.
const feedbackForm = document.getElementById('feedback-form');

if (feedbackForm) {
    setupForm(feedbackForm, document.getElementById('feedback-success'));
}
