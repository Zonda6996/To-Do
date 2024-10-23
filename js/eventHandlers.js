import { taskManager } from './taskManager.js'
import { renderTasks } from './taskRenderer.js'

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

	input.removeAttribute('readonly')
	input.focus()

	input.addEventListener('keydown', e => {
		if (e.key === 'Enter') {
			input.setAttribute('readonly', true)

			const newDescription = e.target.value

			taskManager.editTask(index, newDescription)

			renderTasks()
		}
	})

	input.addEventListener('blur', e => {
		input.setAttribute('readonly', true)

		const newDescription = e.target.value

		taskManager.editTask(index, newDescription)

		renderTasks()
	})
}

function handleSetPriority(index) {
	taskManager.toggleTaskPriority(index)

	renderTasks()
}



// Экспортируем обработчики событий
export {
	handleDeleteTask,
	handleToggleCompletion,
	handleEditTask,
	handleSetPriority,
}
