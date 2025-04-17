// Удалите весь этот код, связанный с лоадером

document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.gallery-item');
    const containers = document.querySelectorAll('.gallery-description-container');

    // Устанавливаем первый элемент как активный
    menuItems[0].classList.add('active');
    menuItems[0].classList.remove('inactive');
    containers[0].classList.remove('hidden'); // Показываем первый контейнер

    // Функция для переключения активного элемента
    let currentIndex = 0;

    function switchActiveItem() {
        // Убираем активный класс у текущего элемента
        menuItems[currentIndex].classList.remove('active');
        menuItems[currentIndex].classList.add('inactive');

        // Скрываем текущий контейнер
        containers[currentIndex].classList.add('hidden');

        // Увеличиваем индекс для следующего элемента
        currentIndex = (currentIndex + 1) % menuItems.length; // Циклический переход

        // Устанавливаем новый активный элемент
        menuItems[currentIndex].classList.add('active');
        menuItems[currentIndex].classList.remove('inactive');

        // Показываем новый контейнер
        containers[currentIndex].classList.remove('hidden');
    }

    // Сохраняем идентификатор интервала
    const intervalId = setInterval(switchActiveItem, 7000);

    // Обработчик клика для пунктов меню
    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Предотвращает переход по ссылке
            const targetId = this.getAttribute('data-target'); // Получаем ID контейнера из атрибута data-target

            // Скрываем все контейнеры
            containers.forEach(container => {
                container.classList.add('hidden');
            });

            // Показываем выбранный контейнер
            const targetContainer = document.getElementById(targetId);
            if (targetContainer) {
                targetContainer.classList.remove('hidden');
            }

            // Убираем активный класс у всех пунктов меню
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
                menuItem.classList.add('inactive'); // Добавляем класс неактивного состояния
            });

            // Устанавливаем активный класс для текущего элемента
            this.classList.add('active');
            this.classList.remove('inactive'); // Убираем класс неактивного состояния

            // Правильно останавливаем интервал
            clearInterval(intervalId);
        });
    });

    const aboutMeLink = document.querySelector('.menu-item'); // Находим ссылку "Обо мне"
    const aboutMeContainer = document.querySelector('.about-me-container'); // Находим контейнер
    const mainContainer = document.querySelector('.container');

    aboutMeLink.addEventListener('click', function(event) {
        event.preventDefault(); // Предотвращаем переход по ссылке
        
        // Переключаем видимость
        aboutMeContainer.classList.toggle('visible');
        
        // Управляем прозрачностью основного контента
        mainContainer.style.opacity = aboutMeContainer.classList.contains('visible') ? '0' : '1';
    });
});
