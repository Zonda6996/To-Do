import { TaskManager } from './taskManager.js'

const taskManager = new TaskManager()

const addTaskButton = document.getElementById('addTaskButton')
const taskInput = document.getElementById('taskInput')
const taskList = document.getElementById('taskList')
const deleteTaskButton = document.getElementById('deleteTaskButton')
const settingsButton = document.getElementById('header__menu-btn')
const headerMenu = document.querySelector('.header__menu')

function renderTasks() {
	taskList.innerHTML = ''

	const tasks = taskManager.getAllTasks()

	tasks.forEach((task, index) => {
		if (task.description.trim() !== '') {
			const taskItem = document.createElement('li')
			taskItem.textContent = task.description

			const closeSpan = document.createElement('span')
			closeSpan.innerHTML = '\u00d7'
			closeSpan.classList.add('close__button')

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
			prioritySpan.setAttribute('title', 'Mark As Important')

			if (task.isPriorityActive) {
				prioritySpan.classList.add('priority__button--active')
				prioritySpan.setAttribute('title', 'Remove Importance Mark')
			}

			taskItem.classList.add(
				task.isCompleted ? 'completed__task' : 'uncompleted__task'
			)

			taskItem.onclick = function (event) {
				if (event.target.tagName == 'LI') {
					taskManager.toggleTaskCompletion(index)
				} else if (event.target.tagName == 'SPAN') {
					event.target.parentElement.remove()
					taskManager.removeTask(index)
				}
				renderTasks()
			}

			prioritySpan.addEventListener('click', () => {
				task.isPriorityActive = !task.isPriorityActive
				renderTasks()
			})

			taskList.append(taskItem)
			taskItem.append(closeSpan)
			taskItem.append(prioritySpan)
		}
	})
}

addTaskButton.addEventListener('click', () => {
	const taskDescription = taskInput.value
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
		renderTasks()
	}
})

//$ Скрытие меню за его пределами
document.addEventListener('click', event => {
	const click =
		event.composedPath().includes(headerMenu) ||
		event.composedPath().includes(settingsButton)
	if (!click) {
		headerMenu.classList.add('header__menu-hidden')
		settingsButton.classList.remove('menu__btn-rotate')
	}
})
