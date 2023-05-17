// Создаем класс MovieService для взаимодействия с API
class MovieService {
    // Конструктор принимает ключ API
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    // Метод для поиска фильмов по названию, типу и странице
    async search(title, type, page) {
        const response = await fetch(`http://www.omdbapi.com/?s=${title}&type=${type}&page=${page}&apikey=${this.apiKey}`);
        const data = await response.json();
        return data;
    }
    // Метод для получения информации о фильме по его идентификатору
    async getMovie(movieId) {
        const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${this.apiKey}`);
        const data = await response.json();
        return data;
    }
}

// Инициализируем новый объект MovieService с нашим ключом API
const movieService = new MovieService('2386dbaf');

// Добавляем обработчик событий для формы поиска
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    let title = document.getElementById('searchInput').value;
    let type = document.getElementById('typeSelect').value;
    // Включаем отображение загрузчика
    document.getElementById('loader').style.display = 'block';
    // Запрашиваем данные с API
    const data = await movieService.search(title, type, 1);
    // Обрабатываем результаты поиска
    handleSearchResult(data, title, type, 1);
    // Показываем кнопку закрытия модального окна
    document.querySelector('.close').style.display = 'block';
    // Отключаем отображение загрузчика
    document.getElementById('loader').style.display = 'none';
});

// Получаем ссылки на модальное окно и кнопку закрытия
const modal = document.getElementById('movieDetailsModal');
const span = document.querySelector('.close');

// Добавляем обработчик событий для кнопки закрытия модального окна
span.onclick = () => {
    modal.style.display = "none";
};

// Закрываем модальное окно при клике вне его области
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// При загрузке страницы скрываем кнопку закрытия модального окна
window.onload = () => {
    document.querySelector('.close').style.display = 'none';
};

// Функция для обработки результатов поиска
function handleSearchResult(data, title, type, page, append = false) {
    document.getElementById('loader').style.display = 'none'; 
    if (data.Response === 'False') {
        let moviesList = document.getElementById('moviesList');
        if (!append) {
            moviesList.innerHTML = `<p class='error'>${data.Error}</p>`;
            document.getElementById('pagination').innerHTML = '';
        }
        document.getElementById('moreButton').style.display = 'none'; 
    } else {
        displayMovies(data.Search, append);
        displayPagination(data.totalResults, title, type, page);
        document.getElementById('moreButton').style.display = 'block';
    }
}
// Функция для отображения списка фильмов
const displayMovies = (movies, append = false) => {
    // Получаем элемент списка фильмов
    let moviesList = document.getElementById('moviesList');
    // Если флаг append не установлен, очищаем список фильмов
    if (!append) {
        moviesList.innerHTML = '';
    }
    // Обрабатываем каждый фильм
    movies.forEach(movie => {
        // Если у фильма нет постера, используем изображение по умолчанию
        movie.Poster = movie.Poster !== "N/A" ? movie.Poster : defaultPoster;
        // Создаем элемент div для каждого фильма
        let movieItem = document.createElement('div');
        movieItem.classList.add('movieItem');
        // Заполняем элемент шаблоном фильма
        movieItem.innerHTML = movieTemplate(movie);
        // Добавляем элемент в список фильмов
        moviesList.appendChild(movieItem);
    });
};

const defaultPoster = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Film_reel.svg"; 

// Функция для отображения пагинации
const displayPagination = (totalResults, title, type, currentPage) => {
    // Получаем элемент пагинации
    let pagination = document.getElementById('pagination');
    // Очищаем пагинацию
    pagination.innerHTML = '';
    // Вычисляем количество страниц
    let pages = Math.ceil(totalResults / 10);
    // Определяем начальную и конечную страницы для отображения
    // Мы показываем до 5 страниц вокруг текущей страницы
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, pages);
    // Убираем активный класс у всех кнопок
    Array.from(pagination.getElementsByTagName('button')).forEach(button => {
        button.classList.remove('active');
    });
    // Если это не первая страница, добавляем кнопку "предыдущая"
    if (currentPage > 1) {
        let prevButton = document.createElement('button');
        prevButton.classList.add('btnPrev');
        prevButton.innerText = '<';
        prevButton.addEventListener('click', async () => {
            const data = await movieService.search(title, type, currentPage - 1);
            handleSearchResult(data, title, type, currentPage - 1);
        });
        pagination.appendChild(prevButton);
    }
    // Добавляем кнопки страниц
    for (let i = startPage; i <= endPage; i++) {
        let pageButton = document.createElement('button');
        pageButton.classList.add('btnNum');
        pageButton.innerText = i;
        // Если текущая страница является активной, добавляем соответствующий класс
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        // При нажатии на кнопку страницы делаем запрос к API с новым номером страницы
        pageButton.addEventListener('click', async () => {
            const data = await movieService.search(title, type, i);
            handleSearchResult(data, title, type, i);
        });
        // Добавляем кнопку страницы в пагинацию
        pagination.appendChild(pageButton);
    }
    // Если это не последняя страница, добавляем кнопку "следующая"
    if (currentPage < pages) {
        let nextButton = document.createElement('button');
        nextButton.classList.add('btnNext');
        nextButton.innerHTML = '>';
        nextButton.addEventListener('click', async () => {
            const data = await movieService.search(title, type, currentPage + 1);
            handleSearchResult(data, title, type, currentPage + 1);
        });
        pagination.appendChild(nextButton);
    }
};

// Функция для форматирования данных фильма
function formatMovieData(data) {
    // Если данные отсутствуют, заменяем их на "No information"
    for (let key in data) {
        if (data[key] === "N/A") {
            data[key] = "No information";
        }
    }
    // Возвращаем отформатированные данные
    return data;
}

// Функция для получения деталей фильма
const getMovieDetails = async (id) => {
    // Отображаем модальное окно и загрузчик
    modal.style.display = 'block';
    document.getElementById('modalLoader').style.display = 'block';
    document.getElementById('movieDetails').innerHTML = '';

    try {
        // Делаем запрос к API для получения деталей фильма
        let data = await movieService.getMovie(id);
        // Форматируем полученные данные
        data = formatMovieData(data);
        // Если постера нет, используем изображение по умолчанию
        data.Poster = data.Poster !== "No information" ? data.Poster : defaultPoster;
        // Заполняем модальное окно деталями фильма
        let movieDetails = document.getElementById('movieDetails');
        movieDetails.innerHTML = movieDetailsTemplate(data);
        // Скрываем индикатор загрузки
        document.getElementById('modalLoader').style.display = 'none'; 
    } catch (error) {
        // В случае ошибки, показываем сообщение об ошибке и скрываем индикатор загрузки
        console.error(error);
        document.getElementById('modalLoader').style.display = 'none';
        document.getElementById('movieDetails').innerHTML = 'ERROR: Could not load movie details.';
    }
};
let page = 1;

// Функция для кнопки "Показать больше"
document.getElementById('moreButton').addEventListener('click', async () => {
    // Делаем кнопку "Показать больше" недоступной во время загрузки
    document.getElementById('moreButton').disabled = true; 
    // Показываем индикатор загрузки
    document.getElementById('loader').style.display = 'block'; 
    // Получаем текущие значения из полей ввода
    let title = document.getElementById('searchInput').value;
    let type = document.getElementById('typeSelect').value;
    // Увеличиваем номер страницы на 1
    page++;
     // Делаем запрос к API
    const data = await movieService.search(title, type, page);
    // Обрабатываем результаты поиска и добавляем их к текущим
    handleSearchResult(data, title, type, page, true);
    // Скрываем индикатор загрузки и делаем кнопку "Показать больше" снова доступной
    document.getElementById('loader').style.display = 'none'; 
    document.getElementById('moreButton').disabled = false; 
});
