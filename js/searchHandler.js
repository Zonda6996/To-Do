export function searchHandler() {
	// Получаем поле ввода для поиска
	const searchInput = document.getElementById('header__search-input')

	searchInput.addEventListener(
		'input',
		debounce(() => {
			// Получаем текст из поля ввода
			const searchQuery = searchInput.value.toLowerCase()

			// Получаем все задачи
			const taskList = document.querySelector('.todo-list-inner')
			const taskItems = Array.from(taskList.children)

			// Отображаем/скрываем задачи в зависимости от результата поиска
			taskItems.forEach(taskItem => {
				const taskText = taskItem
					.querySelector('.task__text')
					.value.toLowerCase()

				taskItem.style.display = taskText.includes(searchQuery) ? '' : 'none'
			})
		}, 300)
	)

	// Отображаем икноку удаления текста в поле ввода при поиске
	const searchInputClear = document.querySelector('.header__search-clear')
	searchInput.addEventListener('input', e => {
		if (searchInput.value.length > 0) {
			searchInputClear.classList.add('header__search-clear--visible')
		} else {
			searchInputClear.classList.remove('header__search-clear--visible')
		}

		searchInputClear.addEventListener('click', () => {
			e.preventDefault()

			searchInput.value = ''
			searchInputClear.classList.remove('header__search-clear--visible')
			searchInput.focus()

			const taskList = document.querySelector('.todo-list-inner')
			const taskItems = Array.from(taskList.children)

			taskItems.forEach(taskItem => (taskItem.style.display = ''))
		})
	})

	const searchButton = document.querySelector('.header__search-button')

	searchButton.addEventListener('click', e => {
		e.preventDefault()

		searchInput.classList.add('header__search-visible')
		searchButton.classList.remove('header__search-button-input--hidden')
		searchInput.focus()
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
