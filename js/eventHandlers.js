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
function handleEditTask(index, content, event) {
	const input = content.querySelector('input')
	const originalDescription = input.value

	// Получаем текущий элемент задачи
	const currTaskItem = event.target.closest('.todo-list__item')

	if (!currTaskItem) return // Если не текущий элемент, выходим

	// Разрешаем редактирование текста и добавляем соответствующий класс
	input.removeAttribute('readonly')
	input.focus()
	currTaskItem.classList.add('todo-list__item-editing')

	// Устанавливаем курсор в конец текст и выделяем его
	input.setSelectionRange(input.value.length, input.value.length)
	input.select()

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

		// Удаляем редактирование и класс
		input.setAttribute('readonly', true)
		currTaskItem.classList.remove('todo-list__item-editing')
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
