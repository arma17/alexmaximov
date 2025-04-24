document.getElementById('about-me-link').addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем переход по ссылке
    const aboutMeContainer = document.getElementById('about-me-container');
    aboutMeContainer.classList.toggle('visible'); // Переключаем класс для анимации
});

document.addEventListener('DOMContentLoaded', function() {
    const cases = document.querySelectorAll('.gallery-description-container');
    const siteLinks = document.querySelectorAll('.site-item');
    const presentationLinks = document.querySelectorAll('.presentation-item');
    const allLinks = [...siteLinks, ...presentationLinks];
    const casesContainer = document.querySelector('.cases-container');
    
    // Флаг для определения программной прокрутки
    let isScrollingProgrammatically = false;
    // Таймер для обработки окончания прокрутки
    let scrollEndTimer = null;
    
    // Инициализация - проверяем какой кейс активен при загрузке
    updateActiveLink();
    
    // Функция для обновления активной ссылки на основе видимого кейса
    function updateActiveLink() {
        // Если выполняется программная прокрутка, не обновляем активные ссылки
        if (isScrollingProgrammatically) return;
        
        // Получаем центр видимой области контейнера с кейсами
        const containerScrollTop = casesContainer.scrollTop;
        const containerHeight = casesContainer.clientHeight;
        const scrollCenter = containerScrollTop + containerHeight / 2;
        
        // Проходим по всем кейсам, чтобы найти видимый
        for (let i = 0; i < cases.length; i++) {
            const caseElement = cases[i];
            const caseId = caseElement.id;
            
            // Получаем положение кейса относительно контейнера
            const caseTop = caseElement.offsetTop;
            const caseHeight = caseElement.offsetHeight;
            const caseBottom = caseTop + caseHeight;
            
            // Проверяем, находится ли центр скролла внутри этого кейса
            if (scrollCenter >= caseTop && scrollCenter <= caseBottom) {
                // Обновляем активный класс для ссылок
                allLinks.forEach(link => {
                    if (link.getAttribute('data-target') === caseId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                // Нашли видимый кейс, выходим из цикла
                break;
            }
        }
    }
    
    // Добавляем обработчик клика для всех ссылок
    allLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Получаем идентификатор целевого кейса
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            // Прокручиваем контейнер с кейсами до нужного кейса
            if (targetElement) {
                // Устанавливаем активный класс текущей ссылке сразу (без ожидания прокрутки)
                allLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Устанавливаем флаг, что прокрутка выполняется программно
                isScrollingProgrammatically = true;
                
                // Отменяем предыдущий таймер, если он существует
                if (scrollEndTimer) clearTimeout(scrollEndTimer);
                
                // Прокручиваем контейнер
                casesContainer.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Устанавливаем таймер для сброса флага после завершения анимации прокрутки
                scrollEndTimer = setTimeout(() => {
                    isScrollingProgrammatically = false;
                }, 1000); // Примерное время анимации прокрутки
            }
        });
    });
    
    // Слушаем событие прокрутки контейнера с кейсами - используем дебаунс для оптимизации
    let scrollTimeoutId = null;
    casesContainer.addEventListener('scroll', () => {
        if (scrollTimeoutId) {
            cancelAnimationFrame(scrollTimeoutId);
        }
        
        scrollTimeoutId = requestAnimationFrame(() => {
            // Вызываем обновление активной ссылки только если прокрутка не является программной
            if (!isScrollingProgrammatically) {
                updateActiveLink();
            }
        });
    });
});
