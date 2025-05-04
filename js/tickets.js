document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    
    // Загружаем корзину из localStorage или создаём новую
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

    // Добавляем обработчики для всех кнопок
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketCard = this.closest('.ticket-card');
            const ticketId = ticketCard.dataset.ticketId;
            const ticketName = ticketCard.querySelector('h3').textContent;
            const ticketPriceText = ticketCard.querySelector('.price').textContent;
            const ticketPrice = parseFloat(ticketPriceText.replace(/[^\d.]/g, ''));

            let cartXml = getCartXml();
            const товары = cartXml.getElementsByTagName('товар');
            let существующийТовар = null;
            for (let товар of товары) {
                if (товар.getAttribute('id') === ticketId) {
                    существующийТовар = товар;
                    break;
                }
            }
            if (существующийТовар) {
                const количествоЭлемент = существующийТовар.getElementsByTagName('количество')[0];
                количествоЭлемент.textContent = parseInt(количествоЭлемент.textContent) + 1;
            } else {
                const новыйТовар = cartXml.createElement('товар');
                новыйТовар.setAttribute('id', ticketId);
                const названиеЭлемент = cartXml.createElement('название');
                названиеЭлемент.textContent = ticketName;
                const ценаЭлемент = cartXml.createElement('цена');
                ценаЭлемент.textContent = ticketPrice.toFixed(2);
                const количествоЭлемент = cartXml.createElement('количество');
                количествоЭлемент.textContent = '1';
                const датаЭлемент = cartXml.createElement('дата');
                датаЭлемент.textContent = new Date().toISOString().split('T')[0];
                новыйТовар.appendChild(названиеЭлемент);
                новыйТовар.appendChild(ценаЭлемент);
                новыйТовар.appendChild(количествоЭлемент);
                новыйТовар.appendChild(датаЭлемент);
                cartXml.getElementsByTagName('корзина')[0].appendChild(новыйТовар);
            }
            saveCartXml(cartXml);
            updateCartCount();
            animateCartIcon();
            this.textContent = 'Добавлено!';
            this.style.backgroundColor = '#45a049';
            setTimeout(() => {
                this.textContent = 'В корзину';
                this.style.backgroundColor = '#4CAF50';
            }, 1000);
        });
    });

    function updateCartCount() {
        let cartXml = getCartXml();
        const товары = cartXml.getElementsByTagName('товар');
        let totalItems = 0;
        for (let товар of товары) {
            totalItems += parseInt(товар.getElementsByTagName('количество')[0].textContent);
        }
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    function animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (!cartIcon) return;
        cartIcon.classList.add('cart-animation');
        setTimeout(() => {
            cartIcon.classList.remove('cart-animation');
        }, 300);
    }

    // При загрузке страницы обновляем счетчик
    updateCartCount();
}); 