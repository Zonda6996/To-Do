export function searchHandler() {
	const searchInput = document.getElementById('header__search-input')
	const searchInputClear = document.querySelector('.header__search-clear')
	const searchButton = document.querySelector('.header__search-button')
	const taskList = document.querySelector('.todo-list-inner')

	const handleSearch = debounce(() => {
		// Получаем текст из поля ввода
		const searchQuery = searchInput.value.toLowerCase().replace(/\s+/g, '')

		// Отображаем/скрываем задачи в зависимости от результата поиска
		Array.from(taskList.children).forEach(taskItem => {
			const taskText = taskItem
				.querySelector('.task__text')
				.value.toLowerCase()
				.replace(/\s+/g, '')
			taskItem.style.display = taskText.includes(searchQuery) ? '' : 'none'
		})
	}, 300)

	// Отображаем икноку удаления текста в поле ввода при поиске
	const toggleClearButton = () => {
		searchInputClear.classList.toggle(
			'header__search-clear--visible',
			searchInput.value.length > 0
		)
	}

	// Применяем debounce к функции поиска
	searchInput.addEventListener('input', () => {
		toggleClearButton()
		handleSearch()
	})

	// Очистка поле ввода поиска
	searchInputClear.addEventListener('click', e => {
		e.preventDefault()
		searchInput.value = ''
		toggleClearButton()
		handleSearch() // Перезагружаем отображение задач при очистке
		searchInput.focus()
	})

	// Показ поля ввода поиска при клике на кнопку поиска
	searchButton.addEventListener('click', e => {
		e.preventDefault()

		searchInput.classList.add('visible')
		searchButton.classList.add('header__search-button--right')
		searchButton.classList.remove('header__search-button--left')

		setTimeout(() => {
			searchInput.focus()
		}, 50)

		setTimeout(() => {
			toggleClearButton()
		}, 600)
	})

	// Скрываем поле ввода поиска при клике вне его области
	document.addEventListener('mousedown', e => {
		const searchContainer = document.querySelector('.header__search')

		// Проверяем активен ли инпут
		const isSearchOpen = searchInput.classList.contains('visible')

		if (!searchContainer.contains(e.target) && isSearchOpen) {
			// Если клик был вне контейнера с поиском и инпут активен

			searchInput.classList.remove('visible')
			searchButton.classList.remove('header__search-button--right')
			searchButton.classList.add('header__search-button--left')
			searchInputClear.classList.remove('header__search-clear--visible')

			// Очищаем поле ввода при закрытии поиска
			searchInput.value = ''
			handleSearch() // Перезагружаем отображение задач при закрытии поиска
		}
	})
}

// Функция задержки для searchHandler
function debounce(fn, delay) {
	let timeoutId
	return function (...args) {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn.apply(this, args), delay)
	}
}
