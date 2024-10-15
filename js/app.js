import { TaskManager } from './taskManager.js'

const taskManager = new TaskManager()

const wrapper = document.querySelector('.wrapper')
const addTaskButton = document.getElementById('addTaskButton')
const taskInput = document.getElementById('taskInput')
const taskList = document.getElementById('taskList')
const deleteTaskButton = document.getElementById('deleteTaskButton')
const settingsButton = document.getElementById('header__menu-btn')
const headerMenu = document.querySelector('.header__menu')
const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchButton')

function renderTasks() {
	taskList.innerHTML = ''

	const tasks = taskManager.getAllTasks()

	tasks.forEach((task, index) => {
		if (task.description.trim() !== '') {
			const taskItem = document.createElement('li')

			const textSpan = document.createElement('span')
			textSpan.classList.add('text__span')
			textSpan.textContent = task.description

			textSpan.setAttribute('title', 'Edit the Task name')

			const iconSpan = document.createElement('span')
			iconSpan.classList.add('icon__task')
			iconSpan.setAttribute(
				'title',
				`Complete the task\n\nChange the task status from Completed / Uncompleted`
			)

			iconSpan.innerHTML = `<?xml version="1.0" encoding="utf-8"?>
										<svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  										<path d="M21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3848 2.25 21.75 6.61522 21.75 12Z" 
 										stroke="#778899" 
 										stroke-width="0.5" 
  										stroke-linecap="round" 
  										stroke-linejoin="round"/>
										</svg>`

			const closeSpan = document.createElement('span')
			closeSpan.innerHTML = '\u00d7'
			closeSpan.classList.add('close__button')

			const prioritySpan = document.createElement('span')
			prioritySpan.innerHTML = `
				<svg
					width='24'
					height='24'
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
				>
					<polygon
						points='12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9'
						fill='none'
						stroke='rgb(92, 6, 103)'
						stroke-width='1'
					/>
				</svg>`

			prioritySpan.classList.add('priority__button')
			prioritySpan.setAttribute('title', 'Mark As Important')

			if (task.isPriorityActive) {
				prioritySpan.classList.add('priority__button--active')
				prioritySpan.setAttribute('title', 'Remove Importance Mark')
			}

			if (task.isCompleted) {
				taskItem.classList.add('completed__task')
				iconSpan.classList.add('completed__icon')
				iconSpan.innerHTML = `<?xml version="1.0" encoding="utf-8"?>
											<svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  											<path d="M8.81802 12.3107L10.9393 14.432L15.182 10.1893 M21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3848 2.25 21.75 6.61522 21.75 12Z" 
  											stroke="#00b75c" 
  											stroke-width="1.0" 
  											stroke-linecap="round" 
  											stroke-linejoin="round"/>
											</svg>`
			} else {
				taskItem.classList.add('uncompleted__task')
				iconSpan.classList.add('uncompleted__icon')
			}

			iconSpan.addEventListener('click', () => {
				taskManager.toggleTaskCompletion(index)
				renderTasks()
			})

			closeSpan.addEventListener('click', () => {
				taskManager.removeTask(index)
				renderTasks()
			})

			prioritySpan.addEventListener('click', () => {
				task.isPriorityActive = !task.isPriorityActive
				renderTasks()
			})

			textSpan.addEventListener('dblclick', () => {
				const newDesc = prompt('Enter a new task name')?.trim()

				if (newDesc) {
					textSpan.textContent = newDesc
					taskManager.editTask(index, newDesc)
				} else {
					alert("Task name can't be empty!")
				}
				renderTasks()
			})

			taskList.append(taskItem)
			taskItem.append(closeSpan, prioritySpan, iconSpan, textSpan)
		}
	})
}

function showMessage(
	element,
	messageText,
	messageType = 'error',
	duration = 5000
) {
	const existingMessage = document.querySelector('.task-input--message')

	if (!existingMessage) {
		let message = document.createElement('span')
		message.classList.add('task-input__message', `message--${messageType}`)
		message.innerHTML = messageText

		element.before(message)

		setTimeout(() => {
			message.remove()
		}, duration)
	}
}

addTaskButton.addEventListener('click', () => {
	const taskDescription = taskInput.value

	if (taskInput.value.length > 120) {
		showMessage(
			addTaskButton,
			`You have entered the max number of characters!<br>Enter ${
				taskInput.value.length - 120
			} characters less.`,
			'error',
			5000
		)
		return
	}

	if (taskInput.value === '') {
		showMessage(
			addTaskButton,
			`The input field cannot be empty.`,
			'warning',
			5000
		)
		return
	}

	taskManager.addTask(taskDescription)
	taskInput.value = ''
	renderTasks()
})

deleteTaskButton.addEventListener('click', () => {
	taskManager.deleteAllTasks()
	renderTasks()
})

settingsButton.addEventListener('click', () => {
	headerMenu.classList.toggle('header__menu-hidden')
	settingsButton.classList.toggle('menu__btn-rotate')
})

headerMenu.addEventListener('click', event => {
	const action = event.target.dataset.action
	if (action) {
		taskManager.handleMenuAction(action)
		headerMenu.classList.add('header__menu-hidden')
		settingsButton.classList.remove('menu__btn-rotate')
		renderTasks()
	}
})

//$ Скрытие меню за его пределами
document.addEventListener('click', event => {
	const click =
		event.composedPath().includes(headerMenu) ||
		event.composedPath().includes(settingsButton) ||
		event.composedPath().includes(searchButton) ||
		event.composedPath().includes(searchInput)
	if (!click) {
		headerMenu.classList.add('header__menu-hidden')
		settingsButton.classList.remove('menu__btn-rotate')

		searchInput.value = ''
		searchInput.classList.add('search__hidden')

		const taskItems = Array.from(taskList.children)
		taskItems.forEach(task => {
			task.style.display = 'block'
		})
	}
})

searchButton.addEventListener('click', () => {
	searchInput.classList.remove('search__hidden')
	searchInput.focus()
})

// Поиск задач
searchInput.addEventListener('input', () => {
	const query = searchInput.value.toLowerCase()
	const taskItems = Array.from(taskList.children)

	taskItems.forEach(task => {
		const taskText = task.querySelector('.text__span').textContent.toLowerCase()

		task.style.display = taskText.includes(query) ? '' : 'none'
	})
})

renderTasks()	