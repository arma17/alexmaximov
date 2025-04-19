document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.gallery-item');
    const containers = document.querySelectorAll('.gallery-description-container');
    let currentIndex = 0;
    let intervalId = null;
    let isDetailOpen = false;
    let pauseTime = 0;
    let startTime = Date.now();
    const intervalDuration = 7000; // 7 секунд
    let startX; // Начальная позиция касания
    let endX; // Конечная позиция касания

    // Функция для переключения активного элемента
    function switchActiveItem() {
        if (isDetailOpen) return; // Если открыто детальное описание, не выполняем переключение

        // Убираем активный класс у текущего элемента
        menuItems[currentIndex].classList.remove('active');
        menuItems[currentIndex].classList.add('inactive');

        // Скрываем текущий контейнер
        containers[currentIndex].classList.add('hidden');

        // Увеличиваем индекс для следующего элемента
        currentIndex = (currentIndex + 1) % menuItems.length;

        // Устанавливаем новый активный элемент
        menuItems[currentIndex].classList.add('active');
        menuItems[currentIndex].classList.remove('inactive');

        // Показываем новый контейнер
        containers[currentIndex].classList.remove('hidden');

        // Обновляем время начала для нового элемента
        startTime = Date.now();
    }

    // Функция для сброса анимации прогресс-бара
    function resetProgressBarAnimation(element) {
        // Удаляем текущую анимацию
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = null;
    }

    // Функция для запуска автоматического переключения
    function startAutoSwitch() {
        // Отключаем автоматическое переключение на мобильных и планшетах
        if (window.innerWidth <= 768) {
            return; // Не запускаем автоматическое переключение
        }
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(switchActiveItem, intervalDuration);
    }

    // Функция для остановки автоматического переключения
    function stopAutoSwitch() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            pauseTime = Date.now(); // Запоминаем время, когда была приостановлена анимация
        }
    }

    // Функция для возобновления автоматического переключения
    function resumeAutoSwitch() {
        if (intervalId) clearInterval(intervalId);
        const elapsedBeforePause = Date.now() - pauseTime; // Вычисляем время, прошедшее с момента остановки
        const remainingTime = Math.max(0, intervalDuration - elapsedBeforePause); // Оставшееся время до переключения

        // Устанавливаем таймер на оставшееся время
        intervalId = setTimeout(() => {
            switchActiveItem(); // Выполняем переключение
            intervalId = setInterval(switchActiveItem, intervalDuration); // Запускаем обычный интервал
        }, remainingTime);
    }

    // Инициализация первого элемента
    menuItems[0].classList.add('active');
    containers[0].classList.remove('hidden');

    // Запускаем автоматическое переключение только если устройство не мобильное
    if (window.innerWidth > 768) {
        startAutoSwitch();
    }

    // Обработчик клика для пунктов меню
    menuItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
            event.preventDefault();

            // Если открыто детальное описание, закрываем его
            if (isDetailOpen) {
                closeDetailView();
            }

            // Обновляем текущий индекс
            currentIndex = index;

            // Скрываем все контейнеры
            containers.forEach(container => {
                container.classList.add('hidden');
            });

            // Показываем выбранный контейнер
            const targetId = this.getAttribute('data-target');
            const targetContainer = document.getElementById(targetId);
            if (targetContainer) {
                targetContainer.classList.remove('hidden');
            }

            // Обновляем классы меню
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
                menuItem.classList.add('inactive');
            });

            // Устанавливаем активный класс
            this.classList.add('active');
            this.classList.remove('inactive');
            resetProgressBarAnimation(this);

            // Перезапускаем автоматическое переключение
            if (!isDetailOpen) {
                startTime = Date.now();
                startAutoSwitch();
            }
        });
    });

    const aboutMeLink = document.querySelector('.menu-item');
    const aboutMeContainer = document.querySelector('.about-me-container');
    const mainContainer = document.querySelector('.container');

    aboutMeLink.addEventListener('click', function(event) {
        event.preventDefault();
        aboutMeContainer.classList.toggle('visible');
        mainContainer.style.opacity = aboutMeContainer.classList.contains('visible') ? '0' : '1';
    });

    // Находим все кнопки "Посмотреть кейс"
    const viewButtons = document.querySelectorAll('.view-case-button');
    const closeButtons = document.querySelectorAll('.close-case');
    const overlay = document.querySelector('.overlay');

    // Обработчик для открытия кейса
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const galleryContainer = button.closest('.gallery-description-container');
            const caseId = galleryContainer.id;
            const detailContainer = document.getElementById(`${caseId}-detail`);
            
            if (detailContainer) {
                detailContainer.classList.add('visible');
                overlay.classList.add('visible');
                document.body.style.overflow = 'hidden';
                
                // Останавливаем автоматическое переключение
                isDetailOpen = true;
                stopAutoSwitch(); // Останавливаем переключение
            }
        });
    });

    // Функция для закрытия детального просмотра
    const closeDetailView = () => {
        const visibleCase = document.querySelector('.case-detail-container.visible');
        if (visibleCase) {
            visibleCase.classList.remove('visible');
            overlay.classList.remove('visible');
            document.body.style.overflow = '';
            
            // Возобновляем автоматическое переключение только если устройство не мобильное
            isDetailOpen = false;
            if (window.innerWidth > 768) {
                resumeAutoSwitch(); // Возобновляем переключение только на устройствах с шириной больше 768px
            }
        }
    };

    // Закрытие по кнопке
    closeButtons.forEach(button => {
        button.addEventListener('click', closeDetailView);
    });

    // Закрытие по клику на overlay
    if (overlay) {
        overlay.addEventListener('click', closeDetailView);
    }

    // Функция для обработки начала касания
    function handleTouchStart(event) {
        startX = event.touches[0].clientX; // Получаем начальную позицию касания
    }

    // Функция для обработки перемещения касания
    function handleTouchMove(event) {
        endX = event.touches[0].clientX; // Получаем конечную позицию касания
    }

    // Функция для обработки окончания касания
    function handleTouchEnd() {
        if (startX > endX + 50) {
            // Если свайп влево
            switchActiveItem(); // Переключаем на следующий проект
        } else if (startX < endX - 50) {
            // Если свайп вправо
            currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length; // Переходим к предыдущему проекту
            switchActiveItem(); // Переключаем на предыдущий проект
        }
    }

    // Добавляем обработчики событий для контейнеров проектов
    const galleryContainers = document.querySelectorAll('.gallery-description-container');

    galleryContainers.forEach(container => {
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchmove', handleTouchMove);
        container.addEventListener('touchend', handleTouchEnd);
    });
});
