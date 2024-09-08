import { TaskManager } from './taskManager.js'

const taskManager = new TaskManager()

// DOM элементы для работы с задачами интерфейсом
const addTaskButton = document.getElementById('addTaskButton')
const taskInput = document.getElementById('taskInput')
const taskList = document.getElementById('taskList')
const deleteTaskButton = document.getElementById('deleteTaskButton')
const settingsButton = document.getElementById('header__menu-btn')
const headerMenu = document.querySelector('.header__menu')

/**
 * Функция создания одного элемента задачи
 * @param {Object} task - Задача из taskManager
 * @param {number} index - Индекс задачи
 * @returns {HTMLLIElement} - Возвращает HTML элемент задачи
 */

function createTaskItem(task, index) {
	const taskItem = document.createElement('li') // Создаём элемент <li> для задачи
	taskItem.textContent = task.description // Добавляем текст задачи
	taskItem.classList.add(
		task.isCompleted ? 'completed__task' : 'uncompleted__task'
	) // Добавляем класс, в зависимости от состояния задачи

	const closeSpan = createCloseButton() // Создаём кнопку удаления
	const prioritySpan = createPriorityButton(task.isPriorityActive) // Создаём кнопку приоритета

	// Обработчик удаления задачи
	closeSpan.addEventListener('click', () => handleTaskRemoval(index))

	// Обработчик переключения приоритета
	prioritySpan.addEventListener('click', () => togglePriority(task, index))

	// Обработчик на клик по задаче (завершена/незавершена)
	taskItem.addEventListener('click', event => handleTaskClick(event, index))

	// Добавляем кнопки в элемент задачи
	taskItem.append(closeSpan, prioritySpan)

	return taskItem
}

/**
 * Функция создания кнопки для удаления задачи
 * @returns {HTMLSpanElement} - Элемент кнопки
 */

function createCloseButton() {
	const closeSpan = document.createElement('span')
	closeSpan.innerHTML = '\u00d7' // Символ ×
	closeSpan.classList.add('close__button')
	return closeSpan
}

/**
 * Функция создания кнопки для приоритета задач
 * @param {boolean} - Активен ли приоритет
 * @returns {HTMLSpanElement} - Элемент кнопки приоритета
 */

function createPriorityButton(isActive) {
	const prioritySpan = document.createElement('span')
	prioritySpan.innerHTML = `
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<polygon
							points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
							fill="none"
							stroke="rgb(92, 6, 103)"
							stroke-width="1"
						/>
					</svg>`
	prioritySpan.classList.add('priority__button')
	prioritySpan.setAttribute(
		'title',
		isActive ? 'Remove Importance Mark' : 'Mark As Important'
	)

	if (isActive) {
		prioritySpan.classList.add('priority__button--active')
	}

	return prioritySpan
}

/**
 * Обработчик клика по задаче (для завершения/отмены завершения задачи)
 * @param {Event} event - события клика
 * @param {number} index - Индекс задачи
 */

function handleTaskClick(event, index) {
	if (event.target.tagName == 'LI') {
		taskManager.toggleTaskCompletion(index)
		renderTasks()
	}
}

/**
 * Обработчик удаления задачи
 * @param {number} index - Индекс задачи
 */

function handleTaskRemoval(index) {
	taskManager.removeTask(index) // Удаляем задачу
	renderTasks()
}

/**
 * Обработчик переключения приоритета
 * @param {Object} task - Задача
 * @param {number} index - Индекс задачи
 */

function togglePriority(task, index) {
	task.isPriorityActive = !task.isPriorityActive // Меняем состояние приоритета
	renderTasks()
}

/**
 * Обработчик добавления задачи
 */

function handleAddTask() {
	const taskDescription = taskInput.value
	taskManager.addTask(taskDescription)
	taskInput.value = ''
	renderTasks()
}

/**
 * Обработчик удаления всех задач
 */
function handleDeleteAllTasks() {
	taskManager.deleteAllTasks() // Удаляем все задачи
	renderTasks()
}

/**
 * Обработчик переключения меню настроек
 */

function toggleSettingsMenu() {
	headerMenu.classList.toggle('header__menu-hidden')
	settingsButton.classList.toggle('menu__btn-rotate')
}

/**
 * Функция отрисовки всех задач
 */

function renderTasks() {
	taskList.innerHTML = '' // Очищаем список задач

	const tasks = taskManager.getAllTasks()

	tasks.forEach((task, index) => {
		if (task.description.trim() !== '') {
			const taskItem = createTaskItem(task, index) // Создаём элемент задачи
			taskList.appendChild(taskItem) // Добавляем задачу в DOM
		}
	})
}

/**
 * Обработчик клика вне меню (чтобы скрывать его)
 * @param {Event} event - Событие клика
 */

function handleDocumentClick(event) {
	const click =
		event.composedPath().includes(headerMenu) || // Проверяем, кликнули ли по меню
		event.composedPath().includes(settingsButton) // или по кнопке настроек
	if (!click) {
		headerMenu.classList.add('header__menu-hidden') // Если не по меню — скрываем
		settingsButton.classList.remove('menu__btn-rotate') // Возвращаем кнопку в исходное состояние
	}
}

/**
 * Добавляем все обработчики событий
 */

function addEventListeners() {
	addTaskButton.addEventListener('click', handleAddTask) // Кнопка добавления задачи
	deleteTaskButton.addEventListener('click', handleDeleteAllTasks) // Кнопка удаления всех задач
	settingsButton.addEventListener('click', toggleSettingsMenu) // Кнопка настроек
	document.addEventListener('click', handleDocumentClick) // Клик по документу для скрытия меню

	headerMenu.addEventListener('click', event => {
		const action = event.target.dataset.action
		if (action) {
			taskManager.handleMenuAction(action)
			headerMenu.classList.add('header__menu-hidden')
			settingsButton.classList.remove('menu__btn-rotate')
			renderTasks()
		}
	})
}

// Инициализация приложения
addEventListeners()
renderTasks()
