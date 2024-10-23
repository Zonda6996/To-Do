import { taskManager } from './taskManager.js'
import * as eventHandlers from './eventHandlers.js'

// Функция для отрисовки списка задач

export function renderTasks() {
	// Контейнер для списка задач
	const todoList = document.querySelector('.todo-list-inner')

	// Получение списка всех задач из менеджера задач
	const tasks = taskManager.getAllTasks()

	// Очистка списка задач
	todoList.innerHTML = ''

	// Формирование HTML для каждой задачи
	tasks.forEach((task, index) => {
		// Создание элемента списка для текущей задачи
		const taskItem = document.createElement('li')
		taskItem.classList.add('todo-list__item')

		// Создание элементов для текущей задачи
		const label = document.createElement('label')
		const input = document.createElement('input')
		const checkbox = document.createElement('span')

		// Добавление блока с контентом
		const content = document.createElement('div')

		// Установка действий для текущей задачи
		const actions = document.createElement('div')

		const editTaskButton = document.createElement('button')
		const editTaskIcon = document.createElement('img')

		const importantTaskButton = document.createElement('button')
		const importantTaskIcon = document.createElement('img')

		const deleteTaskButton = document.createElement('button')
		const deleteTaskIcon = document.createElement('img')

		// Проверяем выполнена ли задача
		input.type = 'checkbox'
		input.checked = task.isCompleted
		input.name = 'checkbox'

		input.addEventListener('change', () =>
			eventHandlers.handleToggleCompletion(index)
		)

		// Добавляем классы для каждого элемента
		content.classList.add('todo-list-content')
		actions.classList.add('todo-list__actions')
		checkbox.classList.add('checkbox__custom')

		// Элемент кнопки редактирования
		editTaskButton.classList.add('todo-list__edit')
		editTaskIcon.setAttribute('src', './image/icons/edit-task.svg')

		// Элемент кнопки пометки как важной
		importantTaskButton.classList.add('todo-list__important-mark')
		importantTaskIcon.setAttribute('src', './image/icons/important-mark.svg')

		// Элемент кнопки удаления задачи
		deleteTaskButton.classList.add('todo-list__delete')
		deleteTaskIcon.setAttribute('src', './image/icons/delete-task.svg')

		// Добавляем обработчики событий для кнопок
		editTaskButton.addEventListener('click', () =>
			eventHandlers.handleEditTask(index, content)
		)

		deleteTaskButton.addEventListener('click', () =>
			eventHandlers.handleDeleteTask(index)
		)

		// Если задача важная, добавляем соответствующий класс
		if (task.isPriorityActive) {
			importantTaskIcon.classList.add('important__button_active')
		}
		
		// При клике на кнопку пометки как важной, меняем состояние важности
		importantTaskButton.addEventListener('click', () => {
			eventHandlers.handleSetPriority(index)
		})

		// Отображение задачи на странице
		content.innerHTML = `<input class="task__text" type="text" name="task" value="${task.description}" readonly>`

		// Добавляем элементы к нашей задаче
		label.append(input, checkbox)
		actions.append(editTaskButton, importantTaskButton, deleteTaskButton)

		editTaskButton.append(editTaskIcon)
		deleteTaskButton.append(deleteTaskIcon)
		importantTaskButton.append(importantTaskIcon)

		taskItem.append(label, content, actions)

		todoList.append(taskItem)
	})
}

renderTasks()
