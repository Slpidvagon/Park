// Загрузка XML файла корзины
function loadCart() {
    fetch('../data/cart.xml')
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            displayCart(data);
            updateTotal(data);
        })
        .catch(error => console.error('Error loading cart:', error));
}

// Отображение товаров из XML
function displayCart(xmlDoc) {
    const cartItems = document.getElementById('cart-items');
    const items = xmlDoc.getElementsByTagName('item');
    
    cartItems.innerHTML = '';
    
    Array.from(items).forEach(item => {
        const itemElement = createCartItem(item);
        cartItems.appendChild(itemElement);
    });
}

// Создание элемента товара
function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.setAttribute('data-id', item.getAttribute('id'));

    const details = document.createElement('div');
    details.className = 'item-details';

    const name = document.createElement('h3');
    name.className = 'item-name';
    name.textContent = item.getElementsByTagName('name')[0].textContent;

    const price = document.createElement('p');
    price.className = 'item-price';
    price.textContent = `${item.getElementsByTagName('price')[0].textContent} $`;

    const date = document.createElement('p');
    date.className = 'item-date';
    date.textContent = `Дата: ${item.getElementsByTagName('date')[0].textContent}`;

    details.appendChild(name);
    details.appendChild(price);
    details.appendChild(date);

    const quantity = createQuantityControl(item);
    const removeButton = createRemoveButton();

    div.appendChild(details);
    div.appendChild(quantity);
    div.appendChild(removeButton);

    return div;
}

// Создание контрола количества
function createQuantityControl(item) {
    const div = document.createElement('div');
    div.className = 'item-quantity';

    const minusBtn = document.createElement('button');
    minusBtn.className = 'quantity-btn';
    minusBtn.textContent = '-';
    minusBtn.onclick = () => updateQuantity(item.getAttribute('id'), -1);

    const value = document.createElement('span');
    value.className = 'quantity-value';
    value.textContent = item.getElementsByTagName('quantity')[0].textContent;

    const plusBtn = document.createElement('button');
    plusBtn.className = 'quantity-btn';
    plusBtn.textContent = '+';
    plusBtn.onclick = () => updateQuantity(item.getAttribute('id'), 1);

    div.appendChild(minusBtn);
    div.appendChild(value);
    div.appendChild(plusBtn);

    return div;
}

// Создание кнопки удаления
function createRemoveButton() {
    const button = document.createElement('button');
    button.className = 'remove-item';
    button.textContent = '✕';
    button.onclick = (e) => removeItem(e.target.parentElement.getAttribute('data-id'));
    return button;
}

// Обновление общей суммы
function updateTotal(xmlDoc) {
    const items = xmlDoc.getElementsByTagName('item');
    let total = 0;
    
    Array.from(items).forEach(item => {
        const price = parseFloat(item.getElementsByTagName('price')[0].textContent);
        const quantity = parseInt(item.getElementsByTagName('quantity')[0].textContent);
        total += price * quantity;
    });
    
    document.getElementById('total-amount').textContent = `${total.toFixed(2)} $`;
}

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const cartCountElement = document.querySelector('.cart-count');

    function getCartXml() {
        const savedCart = localStorage.getItem('cartXml');
        if (savedCart) {
            return new window.DOMParser().parseFromString(savedCart, 'text/xml');
        } else {
            return new window.DOMParser().parseFromString('<?xml version="1.0" encoding="UTF-8"?><корзина></корзина>', 'text/xml');
        }
    }

    function saveCartXml(cartXml) {
        localStorage.setItem('cartXml', new XMLSerializer().serializeToString(cartXml));
    }

    function updateCartCount() {
        let cartXml = getCartXml();
        const товары = cartXml.getElementsByTagName('товар');
        let totalItems = 0;
        for (let товар of товары) {
            totalItems += parseInt(товар.getElementsByTagName('количество')[0].textContent);
        }
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    function renderCart() {
        let cartXml = getCartXml();
        cartItemsContainer.innerHTML = '';
        const товары = cartXml.getElementsByTagName('товар');
        let total = 0;
        if (товары.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
            totalAmountElement.textContent = '$0.00';
            updateCartCount();
            animateCartIcon();
            return;
        }
        Array.from(товары).forEach(товар => {
            const id = товар.getAttribute('id');
            const название = товар.getElementsByTagName('название')[0].textContent;
            const цена = parseFloat(товар.getElementsByTagName('цена')[0].textContent);
            const количество = parseInt(товар.getElementsByTagName('количество')[0].textContent);
            const дата = товар.getElementsByTagName('дата')[0].textContent;
            const итого = цена * количество;
            total += итого;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-details">
                    <h3 class="item-name">${название}</h3>
                    <p class="item-price">$${цена.toFixed(2)} за билет</p>
                    <p class="item-date">Дата: ${дата}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity-value">${количество}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="item-total">$${итого.toFixed(2)}</div>
                <button class="remove-item">✕</button>
            `;
            // Кнопки +, - и удалить
            cartItem.querySelector('.quantity-btn.minus').addEventListener('click', function() {
                updateQuantity(id, -1);
            });
            cartItem.querySelector('.quantity-btn.plus').addEventListener('click', function() {
                updateQuantity(id, 1);
            });
            cartItem.querySelector('.remove-item').addEventListener('click', function() {
                removeItem(id);
            });
            cartItemsContainer.appendChild(cartItem);
        });
        totalAmountElement.textContent = `$${total.toFixed(2)}`;
        updateCartCount();
        animateCartIcon();
    }

    function updateQuantity(id, change) {
        let cartXml = getCartXml();
        const товары = cartXml.getElementsByTagName('товар');
        for (let товар of товары) {
            if (товар.getAttribute('id') === id) {
                const количествоЭлемент = товар.getElementsByTagName('количество')[0];
                let новоеКоличество = parseInt(количествоЭлемент.textContent) + change;
                if (новоеКоличество < 1) новоеКоличество = 1;
                количествоЭлемент.textContent = новоеКоличество;
                break;
            }
        }
        saveCartXml(cartXml);
        renderCart();
        animateCartIcon();
    }

    function removeItem(id) {
        let cartXml = getCartXml();
        const товары = cartXml.getElementsByTagName('товар');
        for (let товар of товары) {
            if (товар.getAttribute('id') === id) {
                товар.parentNode.removeChild(товар);
                break;
            }
        }
        saveCartXml(cartXml);
        renderCart();
        animateCartIcon();
    }

    function animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (!cartIcon) return;
        cartIcon.classList.add('cart-animation');
        setTimeout(() => {
            cartIcon.classList.remove('cart-animation');
        }, 300);
    }

    // Оформление заказа
    const checkoutBtn = document.querySelector('.checkout-button');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            let cartXml = getCartXml();
            const товары = cartXml.getElementsByTagName('товар');
            if (товары.length > 0) {
                alert('Спасибо за заказ! Мы свяжемся с вами для подтверждения.');
                while (товары.length > 0) {
                    товары[0].parentNode.removeChild(товары[0]);
                }
                saveCartXml(cartXml);
                renderCart();
            } else {
                alert('Корзина пуста');
            }
        });
    }

    // При загрузке страницы
    renderCart();
}); 