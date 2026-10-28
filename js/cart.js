// Корзина. Подключается на всех страницах после data.js и main.js:
// счётчик в шапке есть везде, а список товаров только на cart.html.
// В корзине хранятся только id товара и количество, название и цену
// берём из массива products.

// Ключи, под которыми корзина и промокод лежат в localStorage.
const cartStorageKey = 'klac-cart';
const promoStorageKey = 'klac-promo';

// Промокоды и скидка по ним в процентах.
const promoCodes = {
    KLAC10: 10
};

// В localStorage можно сохранить только строку,
// поэтому массив переводим в JSON и обратно.
function loadCart() {
    const savedCart = localStorage.getItem(cartStorageKey);

    if (savedCart === null) {
        return [];
    }

    return JSON.parse(savedCart);
}

function saveCart() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
}

// Пример: [{ id: 1, count: 2 }, { id: 6, count: 1 }]
let cartItems = loadCart();
let activePromo = localStorage.getItem(promoStorageKey) || '';

function addToCart(productId) {
    const cartItem = cartItems.find((item) => item.id === productId);

    if (cartItem) {
        cartItem.count += 1;
    } else {
        cartItems.push({ id: productId, count: 1 });
    }

    saveCart();
    updateCartCounter();
}

function removeFromCart(productId) {
    cartItems = cartItems.filter((item) => item.id !== productId);

    // Удалили последний товар - очищаем корзину целиком вместе с промокодом.
    if (cartItems.length === 0) {
        clearCart();
        return;
    }

    saveCart();
    updateCartCounter();
}

// change равен 1 (кнопка "+") или -1 (кнопка "-").
function changeCartCount(productId, change) {
    const cartItem = cartItems.find((item) => item.id === productId);

    if (!cartItem) {
        return;
    }

    cartItem.count += change;

    if (cartItem.count < 1) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartCounter();
}

function clearCart() {
    cartItems = [];
    activePromo = '';
    localStorage.removeItem(cartStorageKey);
    localStorage.removeItem(promoStorageKey);
    updateCartCounter();
}

// Сколько всего штук товаров в корзине.
function getCartCount() {
    return cartItems.reduce((sum, item) => sum + item.count, 0);
}

// Сумма корзины через reduce: цена со скидкой товара умножается на количество.
function calculateCartTotal() {
    return cartItems.reduce((sum, item) => {
        const product = findProductById(products, item.id);

        // find вернёт undefined, если такого id нет в products.
        if (!product) {
            return sum;
        }

        return sum + getFinalPrice(product) * item.count;
    }, 0);
}

// Скидка по промокоду в рублях, округляем до целых.
function getPromoDiscount(total) {
    if (activePromo === '') {
        return 0;
    }

    return Math.round(calculateDiscount(total, promoCodes[activePromo]));
}

// Если код неверный, старый промокод тоже снимается.
function applyPromo(code) {
    const normalizedCode = code.trim().toUpperCase();

    if (!promoCodes[normalizedCode]) {
        activePromo = '';
        localStorage.removeItem(promoStorageKey);
        return false;
    }

    activePromo = normalizedCode;
    localStorage.setItem(promoStorageKey, activePromo);
    return true;
}

// Число товаров в шапке на всех страницах.
function updateCartCounter() {
    const headerCounter = document.querySelector('.site-header__cart-count');

    if (headerCounter) {
        headerCounter.textContent = getCartCount();
    }
}

updateCartCounter();

// ===== Кнопка "В корзину" на странице товара product.html =====

const productPageButton = document.querySelector('.product__actions [data-action="add-to-cart"]');
const productPageMessage = document.querySelector('.product__message');

if (productPageButton) {
    productPageButton.addEventListener('click', () => {
        addToCart(Number(productPageButton.dataset.productId));
        productPageMessage.textContent = `Товар в корзине. Всего в корзине: ${getCartCount()} шт.`;
    });
}

// ===== Страница корзины cart.html =====

const cartList = document.querySelector('[data-cart-list]');
const cartEmpty = document.querySelector('.cart-empty');
const cartSummary = document.querySelector('.cart-summary');
const cartCountElement = document.querySelector('[data-cart-count]');
const cartSumElement = document.querySelector('[data-cart-sum]');
const cartDiscountElement = document.querySelector('[data-cart-discount]');
const cartTotalElement = document.querySelector('[data-cart-total]');
const promoForm = document.querySelector('.promo-form');
const promoInput = document.querySelector('#promo-code');
const promoMessage = document.querySelector('.promo-form__message');
const clearCartButton = document.querySelector('[data-action="clear-cart"]');

// Кнопка "-" или "+" для изменения количества.
function createCountButton(text, action, product) {
    const button = document.createElement('button');
    button.classList.add('cart-item__count-button');
    button.type = 'button';
    button.textContent = text;
    button.dataset.action = action;
    button.dataset.productId = String(product.id);

    if (action === 'decrease') {
        button.setAttribute('aria-label', `Уменьшить количество: ${product.title}`);
    } else {
        button.setAttribute('aria-label', `Увеличить количество: ${product.title}`);
    }

    return button;
}

function createCartItem(product, count) {
    const item = document.createElement('li');
    item.classList.add('cart-item');

    const image = document.createElement('img');
    image.classList.add('cart-item__image');
    image.src = product.image;
    image.alt = product.title;
    image.width = 800;
    image.height = 600;

    const info = document.createElement('div');
    info.classList.add('cart-item__info');

    const title = document.createElement('h2');
    title.classList.add('cart-item__title');
    title.textContent = product.title;

    const price = document.createElement('p');
    price.classList.add('cart-item__price');
    price.textContent = `${formatPrice(getFinalPrice(product))} за шт.`;

    info.append(title, price);

    const counter = document.createElement('div');
    counter.classList.add('cart-item__counter');

    const countElement = document.createElement('span');
    countElement.classList.add('cart-item__count');
    countElement.textContent = count;

    counter.append(
        createCountButton('-', 'decrease', product),
        countElement,
        createCountButton('+', 'increase', product)
    );

    const sum = document.createElement('p');
    sum.classList.add('cart-item__sum');
    sum.textContent = formatPrice(getFinalPrice(product) * count);

    const removeButton = document.createElement('button');
    removeButton.classList.add('button', 'button--secondary', 'button--small', 'cart-item__remove');
    removeButton.type = 'button';
    removeButton.textContent = 'Удалить';
    removeButton.dataset.action = 'remove';
    removeButton.dataset.productId = String(product.id);

    item.append(image, info, counter, sum, removeButton);
    return item;
}

function renderCart() {
    cartList.textContent = '';

    const isEmpty = cartItems.length === 0;
    cartEmpty.hidden = !isEmpty;
    cartSummary.hidden = isEmpty;

    cartItems.forEach((cartItem) => {
        const product = findProductById(products, cartItem.id);

        if (product) {
            cartList.append(createCartItem(product, cartItem.count));
        }
    });

    const total = calculateCartTotal();
    const discount = getPromoDiscount(total);

    cartCountElement.textContent = `${getCartCount()} шт.`;
    cartSumElement.textContent = formatPrice(total);
    cartDiscountElement.textContent = formatPrice(discount);
    cartTotalElement.textContent = formatPrice(total - discount);
}

if (cartList) {
    renderCart();

    // Делегирование: кнопки товаров создаются заново при каждом renderCart.
    cartList.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');

        if (!button) {
            return;
        }

        const productId = Number(button.dataset.productId);

        if (button.dataset.action === 'increase') {
            changeCartCount(productId, 1);
        }

        if (button.dataset.action === 'decrease') {
            changeCartCount(productId, -1);
        }

        if (button.dataset.action === 'remove') {
            removeFromCart(productId);
        }

        renderCart();
    });
}

if (promoForm) {
    if (activePromo !== '') {
        promoInput.value = activePromo;
        promoMessage.textContent = `Промокод ${activePromo} применён.`;
    }

    promoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (applyPromo(promoInput.value)) {
            promoMessage.textContent = `Промокод ${activePromo} применён.`;
            promoMessage.classList.remove('promo-form__message--error');
        } else {
            promoMessage.textContent = 'Такого промокода нет, скидка не применяется.';
            promoMessage.classList.add('promo-form__message--error');
        }

        renderCart();
    });
}

if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
        clearCart();
        promoInput.value = '';
        promoMessage.textContent = '';
        renderCart();
    });
}

// ===== Корзина на странице заявки order.html =====

const orderCart = document.querySelector('.order-cart');

// Список товаров из корзины над формой заявки. Если корзина пустая, блок скрыт.
function renderOrderCart() {
    const orderCartList = orderCart.querySelector('.order-cart__list');
    const orderCartTotal = orderCart.querySelector('.order-cart__total');

    orderCartList.textContent = '';
    orderCart.hidden = cartItems.length === 0;

    cartItems.forEach((cartItem) => {
        const product = findProductById(products, cartItem.id);

        if (product) {
            const item = document.createElement('li');
            item.textContent = `${product.title}, ${cartItem.count} шт. - ${formatPrice(getFinalPrice(product) * cartItem.count)}`;
            orderCartList.append(item);
        }
    });

    const total = calculateCartTotal();
    const discount = getPromoDiscount(total);
    orderCartTotal.textContent = `Итого: ${formatPrice(total - discount)}`;

    if (discount > 0) {
        orderCartTotal.textContent += ` (с промокодом ${activePromo})`;
    }
}

if (orderCart) {
    renderOrderCart();
}
