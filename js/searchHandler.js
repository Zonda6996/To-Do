import { renderTasks } from './taskRenderer.js'

// Функция поиска задач
export function searchHandler() {
	// Получаем поле ввода для поиска
	const searchInput = document.getElementById('todo-create__search-input')

	searchInput.addEventListener(
		'input',
		debounce(() => {
			// Получаем все задачи
			const taskList = document.querySelector('.todo-list-inner')
			const taskItems = Array.from(taskList.children)

			// Получаем текст из поля ввода
			const searchQuery = searchInput.value.toLowerCase()

			// Отображаем/скрываем задачи в зависимости от результата поиска
			taskItems.forEach(taskItem => {
				const taskText = taskItem
					.querySelector('.task__text')
					.value.toLowerCase()

				taskItem.style.display = taskText.includes(searchQuery) ? '' : 'none'
			})
		}, 300)
	)

	const searchButton = document.querySelector('.todo-create__search-button')

	searchButton.addEventListener('click', e => {
		e.preventDefault()
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
