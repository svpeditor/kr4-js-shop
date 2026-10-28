// Модальные окна сделаны на теге <dialog>. showModal() открывает окно
// поверх страницы, клавишу Escape браузер обрабатывает сам и закрывает окно.

// ===== Окно быстрого заказа на главной (перенесено из main.js) =====

const orderDialog = document.querySelector('#order-dialog');

if (orderDialog) {
    // Кнопки "Заказать" в карточках популярных товаров.
    const orderButtons = document.querySelectorAll('.product-card__button');
    const closeDialogButton = document.querySelector('#close-order-dialog');
    // Скрытое поле формы, в которое записывается выбранный товар.
    const selectedProductInput = document.querySelector('#selected-product');
    const dialogProductName = document.querySelector('#order-dialog-product');
    const dialogTopic = document.querySelector('#order-topic');
    const dialogForm = orderDialog.querySelector('form');

    orderButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Название товара берём из data-product у кнопки.
            const productName = button.dataset.product;

            // Сбрасываем форму, чтобы не остались ошибки и сообщение от прошлой заявки.
            dialogForm.reset();
            selectedProductInput.value = productName;
            dialogProductName.textContent = productName;
            // Окно открыто кнопкой "Заказать", поэтому тема сразу "Заказ товара".
            dialogTopic.value = 'product';

            orderDialog.showModal();
        });
    });

    closeDialogButton.addEventListener('click', () => {
        orderDialog.close();
    });
}

// ===== Окно товара в каталоге (кнопка "Подробнее" в карточке) =====

const productModal = document.querySelector('#product-modal');

// Заполняем окно данными товара и открываем его.
// Вызывается из catalog.js при нажатии на "Подробнее".
function openProductModal(product) {
    const image = productModal.querySelector('.product-modal__image');
    const category = productModal.querySelector('.product-modal__category');
    const title = productModal.querySelector('.product-modal__title');
    const description = productModal.querySelector('.product-modal__description');
    const rating = productModal.querySelector('.product-modal__rating');
    const price = productModal.querySelector('.product-modal__price');
    const discount = productModal.querySelector('.product-modal__discount');
    const status = productModal.querySelector('.product-modal__status');
    const addButton = productModal.querySelector('[data-action="add-to-cart"]');
    const message = productModal.querySelector('.product-modal__message');

    image.src = product.image;
    image.alt = product.title;
    category.textContent = categoryNames[product.category];
    title.textContent = product.title;
    description.textContent = product.description;
    rating.textContent = `Рейтинг: ${product.rating} из 5`;
    price.textContent = formatPrice(getFinalPrice(product));
    status.textContent = getProductStatus(product);
    message.textContent = '';

    if (product.isAvailable) {
        status.classList.remove('product-modal__status--none');
    } else {
        status.classList.add('product-modal__status--none');
    }

    // Строка про скидку видна только у товаров со скидкой.
    discount.hidden = product.discountPercent === 0;
    discount.textContent = `Скидка ${product.discountPercent}%, без скидки ${formatPrice(product.price)}`;

    addButton.dataset.productId = String(product.id);
    addButton.disabled = !product.isAvailable;

    productModal.showModal();
}

if (productModal) {
    productModal.addEventListener('click', (event) => {
        // Клик по затемнённому фону: событие приходит на сам dialog.
        if (event.target === productModal) {
            productModal.close();
            return;
        }

        if (event.target.closest('[data-action="close-modal"]')) {
            productModal.close();
            return;
        }

        const addButton = event.target.closest('[data-action="add-to-cart"]');

        if (addButton) {
            const productId = Number(addButton.dataset.productId);
            addToCart(productId);

            const message = productModal.querySelector('.product-modal__message');
            message.textContent = `Добавлено в корзину. Всего в корзине: ${getCartCount()} шт.`;
        }
    });
}
