import { taskManager } from './taskManager.js'
import * as constants from './constants.js'
import { renderTasks } from './taskRenderer.js'
import { settingsMenu } from './settingsMenu.js'
import { searchHandler } from './searchHandler.js'
import { taskSelection } from './eventHandlers.js'
import * as errorHandler from './errorHandler.js'
// import { messageHandler } from './messageHandler.js'
// import { eventHandlers } from './eventHandlers.js'

window.addEventListener('load', () => {
	const todoForm = document.getElementById('todo-create__form')
	const taskInput = document.getElementById('todo-create__form-input-text')

	todoForm.addEventListener('submit', e => {
		e.preventDefault()

		const taskDescription = taskInput.value.trim()

		if (taskDescription.length === 0) return

		// Проверка длины задачи
		if (!errorHandler.validateTaskName(taskDescription)) {
			taskInput.focus()
			return
		}

		taskManager.addTask(taskDescription)

		taskInput.value = ''
		taskInput.focus()

		renderTasks()
	})

	// Инициализируем поиск
	searchHandler()

	// Инициализируем меню настроек
	settingsMenu()

	// Рендиерим задачи
	renderTasks()

	taskSelection()
})
