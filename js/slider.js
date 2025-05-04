document.addEventListener('DOMContentLoaded', function() {
    const slidesContainer = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slider-btn.prev');
    const nextButton = document.querySelector('.slider-btn.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Функция для показа слайда
    function showSlide(index) {
        // Проверяем границы
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        // Перемещаем слайды
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Следующий слайд
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Предыдущий слайд
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Обработчики кнопок
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // Автоматическое переключение
    let autoSlideInterval = setInterval(nextSlide, 5000);

    // Пауза при наведении
    slidesContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    // Возобновление после ухода курсора
    slidesContainer.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });

    // Свайпы на мобильных устройствах
    let touchStartX = 0;

    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(autoSlideInterval);
    });

    slidesContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) { // Минимальное расстояние для свайпа
            if (diff > 0) {
                nextSlide(); // Свайп влево - следующий слайд
            } else {
                prevSlide(); // Свайп вправо - предыдущий слайд
            }
        }

        autoSlideInterval = setInterval(nextSlide, 5000);
    });
}); 