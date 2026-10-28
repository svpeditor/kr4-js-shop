// Проверка форм: форма заявки (order.html и окно быстрого заказа на главной)
// и форма обратной связи (contacts.html). Ошибки выводятся под полями
// через textContent, alert() не используется.

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-()\s]+$/;

// Текст ошибки под полем, aria-invalid подсвечивает поле красной рамкой
// и сообщает программе чтения с экрана, что поле заполнено неверно.
function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement.id);
}

function clearError(input, errorElement) {
    errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
}

// Общее сообщение под кнопками: красное при ошибке, зелёное при успехе.
function showFormMessage(messageElement, text, isError) {
    messageElement.textContent = text;

    if (isError) {
        messageElement.classList.add('form-message--error');
        messageElement.classList.remove('form-message--success');
    } else {
        messageElement.classList.add('form-message--success');
        messageElement.classList.remove('form-message--error');
    }
}

// Проверки, которые нужны обеим формам.
function checkName(input, errorElement) {
    const value = input.value.trim();

    if (value.length < 2) {
        showError(input, errorElement, 'Введите имя не короче 2 символов.');
        return false;
    }

    clearError(input, errorElement);
    return true;
}

function checkEmail(input, errorElement) {
    const value = input.value.trim();

    if (!emailPattern.test(value)) {
        showError(input, errorElement, 'Введите корректный e-mail, например name@mail.ru.');
        return false;
    }

    clearError(input, errorElement);
    return true;
}

function checkAgreement(checkbox, errorElement) {
    if (!checkbox.checked) {
        showError(checkbox, errorElement, 'Нужно согласие на обработку персональных данных.');
        return false;
    }

    clearError(checkbox, errorElement);
    return true;
}

// Для выпадающих списков: первый пункт "Выберите..." имеет пустой value.
function checkSelect(select, errorElement, message) {
    if (select.value === '') {
        showError(select, errorElement, message);
        return false;
    }

    clearError(select, errorElement);
    return true;
}

// ===== Форма заявки =====
// Ищем по id: класс order-form есть и у формы обратной связи на contacts.html.
const orderForm = document.querySelector('#order-form');

if (orderForm) {
    const nameInput = orderForm.querySelector('#order-name');
    const emailInput = orderForm.querySelector('#order-email');
    const phoneInput = orderForm.querySelector('#order-phone');
    const dateInput = orderForm.querySelector('#order-date');
    const commentInput = orderForm.querySelector('#order-comment');
    const agreementInput = orderForm.querySelector('#order-agreement');
    const nameError = orderForm.querySelector('#order-name-error');
    const emailError = orderForm.querySelector('#order-email-error');
    const phoneError = orderForm.querySelector('#order-phone-error');
    const agreementError = orderForm.querySelector('#order-agreement-error');
    const formMessage = orderForm.querySelector('.form-message');
    const submitButton = orderForm.querySelector('[type="submit"]');

    // Товар, количество и способ получения есть только на order.html,
    // тема и скрытое поле с товаром - только в окне на главной.
    // На другой странице querySelector вернёт null, это проверяется ниже.
    const productSelect = orderForm.querySelector('#order-product');
    const productError = orderForm.querySelector('#order-product-error');
    const quantityInput = orderForm.querySelector('#order-quantity');
    const quantityError = orderForm.querySelector('#order-quantity-error');
    const deliveryGroup = orderForm.querySelector('.order-form__options');
    const deliveryError = orderForm.querySelector('#order-delivery-error');
    const topicSelect = orderForm.querySelector('#order-topic');
    const topicError = orderForm.querySelector('#order-topic-error');
    const selectedProductInput = orderForm.querySelector('#selected-product');

    function validateName() {
        return checkName(nameInput, nameError);
    }

    function validateEmail() {
        return checkEmail(emailInput, emailError);
    }

    // Кроме символов проверяем, что в номере 11 цифр, как в +7 (900) 000-00-00.
    function validatePhone() {
        const value = phoneInput.value.trim();
        const digits = value.replace(/\D/g, '');

        if (value.length < 6 || !phonePattern.test(value) || digits.length !== 11) {
            showError(phoneInput, phoneError, 'Введите номер из 11 цифр, например +7 (900) 000-00-00.');
            return false;
        }

        clearError(phoneInput, phoneError);
        return true;
    }

    function validateAgreement() {
        return checkAgreement(agreementInput, agreementError);
    }

    // Товар можно не выбирать, если товары уже лежат в корзине.
    function validateProduct() {
        if (!productSelect) {
            return true;
        }

        if (productSelect.value === '' && getCartCount() === 0) {
            showError(productSelect, productError, 'Выберите товар или добавьте товары в корзину.');
            return false;
        }

        clearError(productSelect, productError);
        return true;
    }

    // Количество - целое число от 1 до 10.
    function validateQuantity() {
        if (!quantityInput) {
            return true;
        }

        const quantity = Number(quantityInput.value);

        if (quantityInput.value === '' || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
            showError(quantityInput, quantityError, 'Укажите количество от 1 до 10.');
            return false;
        }

        clearError(quantityInput, quantityError);
        return true;
    }

    function validateDelivery() {
        if (!deliveryGroup) {
            return true;
        }

        const checkedDelivery = orderForm.querySelector('input[name="delivery"]:checked');

        if (!checkedDelivery) {
            showError(deliveryGroup, deliveryError, 'Выберите способ получения.');
            return false;
        }

        clearError(deliveryGroup, deliveryError);
        return true;
    }

    function validateTopic() {
        if (!topicSelect) {
            return true;
        }

        return checkSelect(topicSelect, topicError, 'Выберите тему заявки.');
    }

    orderForm.addEventListener('submit', (event) => {
        // Отменяем обычную отправку, иначе страница перезагрузится.
        event.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isProductValid = validateProduct();
        const isQuantityValid = validateQuantity();
        const isDeliveryValid = validateDelivery();
        const isTopicValid = validateTopic();
        const isAgreementValid = validateAgreement();
        const isFormValid = isNameValid && isEmailValid && isPhoneValid && isProductValid
            && isQuantityValid && isDeliveryValid && isTopicValid && isAgreementValid;

        if (!isFormValid) {
            showFormMessage(formMessage, 'Проверьте поля формы, ошибки отмечены красным.', true);
            return;
        }

        const requestData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            date: dateInput.value,
            comment: commentInput.value.trim()
        };

        // На order.html к заявке добавляем товар, количество, доставку и корзину.
        if (productSelect) {
            const cartTotal = calculateCartTotal();
            requestData.product = productSelect.value;
            requestData.quantity = Number(quantityInput.value);
            requestData.delivery = orderForm.querySelector('input[name="delivery"]:checked').value;
            requestData.cartCount = getCartCount();
            requestData.cartTotal = cartTotal - getPromoDiscount(cartTotal);
        }

        // В окне быстрого заказа - товар, по которому нажали "Заказать", и тема.
        if (topicSelect) {
            requestData.product = selectedProductInput.value;
            requestData.topic = topicSelect.value;
        }

        // Сервера нет, поэтому отправку изображаем задержкой в 1 секунду,
        // пока кнопка заблокирована, второй раз форму не отправить.
        showFormMessage(formMessage, 'Отправляем заявку...', false);
        submitButton.disabled = true;
        submitButton.textContent = 'Отправляем...';

        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить заявку';

            console.table(requestData);

            if (productSelect && cartItems.length > 0) {
                console.table(cartItems);
                // Заказ оформлен, корзину очищаем.
                clearCart();
                renderOrderCart();
            }

            orderForm.reset();
            showFormMessage(formMessage, 'Заявка отправлена. Мы перезвоним в течение 15 минут в рабочее время.', false);
        }, 1000);
    });

    // Ошибка пропадает сразу, как только поле исправлено.
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    phoneInput.addEventListener('input', validatePhone);
    agreementInput.addEventListener('change', validateAgreement);

    if (productSelect) {
        productSelect.addEventListener('change', validateProduct);
        quantityInput.addEventListener('input', validateQuantity);
        deliveryGroup.addEventListener('change', validateDelivery);
    }

    if (topicSelect) {
        topicSelect.addEventListener('change', validateTopic);
    }

    // При сбросе формы (кнопка "Очистить форму", закрытие окна, после отправки)
    // убираем и старые ошибки, и общее сообщение.
    orderForm.addEventListener('reset', () => {
        const errors = orderForm.querySelectorAll('.form-error');
        errors.forEach((error) => {
            error.textContent = '';
        });

        const invalidFields = orderForm.querySelectorAll('[aria-invalid="true"]');
        invalidFields.forEach((field) => {
            field.removeAttribute('aria-invalid');
        });

        formMessage.textContent = '';
    });
}

// ===== Форма обратной связи на contacts.html =====
const feedbackForm = document.querySelector('#feedback-form');

if (feedbackForm) {
    const nameInput = feedbackForm.querySelector('#feedback-name');
    const emailInput = feedbackForm.querySelector('#feedback-email');
    const topicSelect = feedbackForm.querySelector('#feedback-topic');
    const messageInput = feedbackForm.querySelector('#feedback-message');
    const agreementInput = feedbackForm.querySelector('#feedback-agreement');
    const nameError = feedbackForm.querySelector('#feedback-name-error');
    const emailError = feedbackForm.querySelector('#feedback-email-error');
    const topicError = feedbackForm.querySelector('#feedback-topic-error');
    const messageError = feedbackForm.querySelector('#feedback-message-error');
    const agreementError = feedbackForm.querySelector('#feedback-agreement-error');
    const formMessage = feedbackForm.querySelector('.form-message');
    const submitButton = feedbackForm.querySelector('[type="submit"]');

    function validateFeedbackName() {
        return checkName(nameInput, nameError);
    }

    function validateFeedbackEmail() {
        return checkEmail(emailInput, emailError);
    }

    function validateFeedbackTopic() {
        return checkSelect(topicSelect, topicError, 'Выберите тему сообщения.');
    }

    function validateMessage() {
        const value = messageInput.value.trim();

        if (value.length < 10) {
            showError(messageInput, messageError, 'Напишите сообщение, хотя бы 10 символов.');
            return false;
        }

        clearError(messageInput, messageError);
        return true;
    }

    function validateFeedbackAgreement() {
        return checkAgreement(agreementInput, agreementError);
    }

    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const isNameValid = validateFeedbackName();
        const isEmailValid = validateFeedbackEmail();
        const isTopicValid = validateFeedbackTopic();
        const isMessageValid = validateMessage();
        const isAgreementValid = validateFeedbackAgreement();

        if (!isNameValid || !isEmailValid || !isTopicValid || !isMessageValid || !isAgreementValid) {
            showFormMessage(formMessage, 'Проверьте поля формы, ошибки отмечены красным.', true);
            return;
        }

        const feedbackData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            topic: topicSelect.value,
            message: messageInput.value.trim()
        };

        showFormMessage(formMessage, 'Отправляем сообщение...', false);
        submitButton.disabled = true;
        submitButton.textContent = 'Отправляем...';

        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить сообщение';

            console.table(feedbackData);
            feedbackForm.reset();
            showFormMessage(formMessage, 'Сообщение отправлено. Ответим на e-mail в течение дня.', false);
        }, 1000);
    });

    nameInput.addEventListener('input', validateFeedbackName);
    emailInput.addEventListener('input', validateFeedbackEmail);
    topicSelect.addEventListener('change', validateFeedbackTopic);
    messageInput.addEventListener('input', validateMessage);
    agreementInput.addEventListener('change', validateFeedbackAgreement);
}
