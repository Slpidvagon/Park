document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем значения полей
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Простая валидация
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }
        
        if (!terms) {
            alert('Пожалуйста, примите условия использования');
            return;
        }
        
        // Если все проверки пройдены, можно отправлять данные на сервер
        alert('Регистрация успешна!');
        form.reset();
    });
}); 