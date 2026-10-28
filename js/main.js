// Общие функции и код, который нужен на всех страницах.
// main.js подключается сразу после data.js, поэтому функции отсюда
// можно вызывать в cart.js, catalog.js, modal.js и validation.js.

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

// Цена товара с его скидкой, чтобы не писать каждый раз два свойства.
function getFinalPrice(product) {
    return calculateFinalPrice(product.price, product.discountPercent);
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

// Учебный блок "Проверка JavaScript" внизу главной (практики 15 и 16).
// Проверочный вывод в консоль тоже делаем только там,
// чтобы не засорять консоль на остальных страницах.
const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

if (messageElement && productOutputElement) {
    console.log('Файл main.js подключён');
    console.table(products);

    // Перебор массива циклом for по индексам: сколько товаров со скидкой.
    let discountCount = 0;

    for (let i = 0; i < products.length; i += 1) {
        if (products[i].discountPercent > 0) {
            discountCount += 1;
        }
    }

    console.log(`Товаров со скидкой: ${discountCount}`);

    // Перебор циклом for...of: названия товаров, которых нет в наличии.
    const notAvailableTitles = [];

    for (const product of products) {
        if (!product.isAvailable) {
            notAvailableTitles.push(product.title);
        }
    }

    console.log(`Нет в наличии: ${notAvailableTitles.join(', ')}`);

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

    messageElement.textContent = 'Массив товаров и функции обработки данных подключены.';
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

// Если на страницу заявки перешли по ссылке "Оформить заявку" со страницы товара,
// в адресе есть ?product=... и этот товар сразу выбирается в списке.
const productSelect = document.getElementById('order-product');

if (productSelect) {
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');

    if (product) {
        productSelect.value = product;
    }
}
