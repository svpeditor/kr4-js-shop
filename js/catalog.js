// Каталог: карточки товаров из массива products, поиск, фильтры и сортировка.
// Подключается на catalog.html после data.js, main.js и cart.js
// (formatPrice, getFinalPrice, getProductStatus находятся в main.js,
// addToCart - в cart.js). openProductModal находится в modal.js, который
// подключён после catalog.js, но вызывается она только по клику,
// а к этому моменту все скрипты уже выполнены.

const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const availableCheckbox = document.querySelector('#only-available');
const resetButton = document.querySelector('[data-action="reset-filters"]');
const catalogCount = document.querySelector('.catalog-count');
const catalogEmpty = document.querySelector('.catalog-empty');
const catalogMessage = document.querySelector('.catalog-message');

if (!productsContainer) {
    console.warn('Контейнер товаров не найден. Проверьте data-products-container.');
}

// Состояние каталога: строка поиска, выбранная категория, сортировка
// и флажок "Только в наличии".
const catalogState = {
    query: '',
    category: 'all',
    sort: 'default',
    onlyAvailable: false
};

function searchProducts(products, query) {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery === '') {
        return products;
    }

    return products.filter((product) => {
        return product.title.toLowerCase().includes(normalizedQuery);
    });
}

function filterProductsByCategory(products, category) {
    if (category === 'all') {
        return products;
    }

    return products.filter((product) => {
        return product.category === category;
    });
}

// Сортируем копию массива, чтобы не менять порядок в products.
// Цена берётся со скидкой, та же, что показана в карточке.
function sortProducts(products, sortType) {
    const productsCopy = [...products];

    if (sortType === 'price-asc') {
        return productsCopy.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
    }

    if (sortType === 'price-desc') {
        return productsCopy.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
    }

    if (sortType === 'title-asc') {
        return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
    }

    return productsCopy;
}

// Поиск, фильтры, затем сортировка.
function getPreparedProducts(products, state) {
    let result = [...products];
    result = searchProducts(result, state.query);
    result = filterProductsByCategory(result, state.category);

    if (state.onlyAvailable) {
        result = getAvailableProducts(result);
    }

    result = sortProducts(result, state.sort);
    return result;
}

// Бейдж в углу карточки: скидка важнее, чем "Хит" или "Новинка".
// Если показывать нечего, возвращается null.
function createBadge(product) {
    const badge = document.createElement('span');
    badge.classList.add('badge', 'product-card__badge');

    if (product.discountPercent > 0) {
        badge.classList.add('badge--sale');
        badge.textContent = `Скидка ${product.discountPercent}%`;
        return badge;
    }

    if (product.badge === '') {
        return null;
    }

    if (product.badge === 'Новинка') {
        badge.classList.add('badge--new');
    }

    badge.textContent = product.badge;
    return badge;
}

// Карточка собирается из элементов через createElement,
// текст записывается через textContent, а не через innerHTML.
function createProductCard(product) {
    const card = document.createElement('article');
    card.classList.add('product-card');

    const badge = createBadge(product);

    if (badge) {
        card.append(badge);
    }

    const image = document.createElement('img');
    image.classList.add('product-card__image');
    image.src = product.image;
    image.alt = product.title;
    image.width = 800;
    image.height = 600;
    image.loading = 'lazy';

    // Внутренний блок с отступами, как у карточек в КР №3.
    const body = document.createElement('div');
    body.classList.add('product-card__body');

    const category = document.createElement('p');
    category.classList.add('product-card__category');
    category.textContent = categoryNames[product.category];

    const title = document.createElement('h3');
    title.classList.add('product-card__title');
    title.textContent = product.title;

    const description = document.createElement('p');
    description.classList.add('product-card__description');
    description.textContent = product.description;

    const rating = document.createElement('p');
    rating.classList.add('product-card__rating');
    rating.textContent = `Рейтинг: ${product.rating} из 5`;

    // Цена со скидкой, а старая цена рядом зачёркнутой.
    const price = document.createElement('p');
    price.classList.add('product-card__price');
    price.textContent = formatPrice(getFinalPrice(product));

    if (product.discountPercent > 0) {
        card.classList.add('product-card--discount');

        const oldPrice = document.createElement('s');
        oldPrice.classList.add('product-card__old-price');
        oldPrice.textContent = formatPrice(product.price);
        price.append(' ', oldPrice);
    }

    const status = document.createElement('p');
    status.classList.add('product-card__status');
    status.textContent = getProductStatus(product);

    const actions = document.createElement('div');
    actions.classList.add('product-card__actions');

    const detailsButton = document.createElement('button');
    detailsButton.classList.add('button', 'button--secondary', 'button--small');
    detailsButton.type = 'button';
    detailsButton.textContent = 'Подробнее';
    detailsButton.dataset.action = 'show-details';
    detailsButton.dataset.productId = String(product.id);

    const button = document.createElement('button');
    button.classList.add('button', 'button--primary', 'button--small', 'product-card__button');
    button.type = 'button';
    button.textContent = 'В корзину';
    button.dataset.action = 'add-to-cart';
    button.dataset.productId = String(product.id);

    if (!product.isAvailable) {
        card.classList.add('product-card--unavailable');
        button.disabled = true;
        button.textContent = 'Недоступно';
    }

    actions.append(detailsButton, button);
    body.append(category, title, description, rating, price, status, actions);
    card.append(image, body);

    return card;
}

function renderProducts(productsToRender) {
    // Очищаем контейнер, иначе карточки будут добавляться к старым.
    productsContainer.textContent = '';

    if (catalogCount) {
        catalogCount.textContent = `Найдено товаров: ${productsToRender.length}`;
    }

    if (catalogEmpty) {
        catalogEmpty.hidden = productsToRender.length > 0;
    }

    productsToRender.forEach((product) => {
        const card = createProductCard(product);
        productsContainer.append(card);
    });
}

function updateCatalog() {
    const preparedProducts = getPreparedProducts(products, catalogState);
    renderProducts(preparedProducts);
}

// Если перешли по ссылке вида catalog.html?category=keyboards
// (со страницы товара), сразу выбираем эту категорию.
const urlParams = new URLSearchParams(window.location.search);
const categoryFromUrl = urlParams.get('category');

// Берём категорию, только если она есть в списке категорий.
if (categoryFilter && Object.keys(categoryNames).includes(categoryFromUrl)) {
    catalogState.category = categoryFromUrl;
    categoryFilter.value = categoryFromUrl;
}

if (searchInput) {
    searchInput.addEventListener('input', (event) => {
        catalogState.query = event.target.value;
        updateCatalog();
    });
}

if (categoryFilter) {
    categoryFilter.addEventListener('change', (event) => {
        catalogState.category = event.target.value;
        updateCatalog();
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', (event) => {
        catalogState.sort = event.target.value;
        updateCatalog();
    });
}

if (availableCheckbox) {
    availableCheckbox.addEventListener('change', (event) => {
        catalogState.onlyAvailable = event.target.checked;
        updateCatalog();
    });
}

// "Сбросить": возвращаем состояние и элементы управления к начальным значениям.
if (resetButton) {
    resetButton.addEventListener('click', () => {
        catalogState.query = '';
        catalogState.category = 'all';
        catalogState.sort = 'default';
        catalogState.onlyAvailable = false;

        searchInput.value = '';
        categoryFilter.value = 'all';
        sortSelect.value = 'default';
        availableCheckbox.checked = false;
        catalogMessage.textContent = '';

        updateCatalog();
    });
}

if (productsContainer) {
    updateCatalog();
}

// Делегирование: один обработчик на контейнер вместо обработчика на каждой кнопке.
// Карточки перерисовываются, а контейнер остаётся тем же.
if (productsContainer) {
    productsContainer.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');

        if (!button) {
            return;
        }

        const productId = Number(button.dataset.productId);
        const selectedProduct = findProductById(products, productId);

        if (!selectedProduct) {
            console.warn('Товар не найден:', productId);
            return;
        }

        if (button.dataset.action === 'add-to-cart') {
            addToCart(productId);

            if (catalogMessage) {
                catalogMessage.textContent = `В корзину добавлено: ${selectedProduct.title}. Всего в корзине: ${getCartCount()} шт.`;
            }
        }

        if (button.dataset.action === 'show-details') {
            openProductModal(selectedProduct);
        }
    });
}
