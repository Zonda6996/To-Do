import { taskManager } from './taskManager.js'
import { renderTasks } from './taskRenderer.js'
import * as constants from './constants.js'
import * as errorHandler from './errorHandler.js'

// Обрабочтик для изменения состояния задачи
function handleToggleCompletion(index) {
	taskManager.toggleTaskCompletion(index)
	renderTasks()
}

// Обрабоочтик для удаления задачи
function handleDeleteTask(index) {
	taskManager.removeTask(index)
	renderTasks()
}

// Обработчик для редактирования названия задачи
function handleEditTask(index, content) {
	const input = content.querySelector('input')
	const originalDescription = input.value

	input.removeAttribute('readonly')
	input.focus()

	// Проверяем валидность названия задачи
	function validateAndUpdateTask(e) {
		const newValue = e.target.value

		if (newValue.length < constants.MIN_TASK_NAME_LENGTH) {
			e.target.value = originalDescription
			errorHandler.showMinLengthExceeded()
		} else if (newValue.length > constants.MAX_TASK_NAME_LENGTH) {
			e.target.value = originalDescription
			errorHandler.showMaxLengthExceeded()
		} else {
			taskManager.editTask(index, newValue)
		}

		input.setAttribute('readonly', true)
		renderTasks()
	}

	// Обработка при нажатии на Enter
	input.addEventListener('keydown', e => {
		if (e.key === 'Enter') {
			validateAndUpdateTask(e)
		}
	})

	// Обработка при потере фокуса
	input.addEventListener('blur', validateAndUpdateTask)
}

function handleSetPriority(index) {
	taskManager.toggleTaskPriority(index)

	renderTasks()
}

function taskSelection() {
	const taskList = document.querySelector('.todo-list-inner')

	taskList.addEventListener('click', e => {
		if (e.target.tagName !== 'LI') return

		const li = e.target

		if (e.ctrlKey || e.metaKey) {
			li.classList.toggle('todo-list__item-selected')
		} else {
			li.classList.remove('todo-list__item-selected')
		}
	})

	document.addEventListener('click', e => {
		if (!taskList.contains(e.target)) {
			taskList
				.querySelectorAll('.todo-list__item-selected')
				.forEach(li => li.classList.remove('todo-list__item-selected'))
		}
	})
}

// Экспортируем обработчики событий
export {
	handleDeleteTask,
	handleToggleCompletion,
	handleEditTask,
	handleSetPriority,
	taskSelection,
}
