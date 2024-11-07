import { taskManager } from './taskManager.js'
import { renderTasks } from './taskRenderer.js'

export function settingsMenu() {
	// Получаем элементы меню настроек
	const optionsButton = document.getElementById('header__options-button')
	const optionsDropDown = document.getElementById('options-dropdown')

	// При клике показываем меню настроек
	optionsButton.addEventListener('click', e => {
		e.stopPropagation()
		optionsDropDown.classList.toggle('header__options-visible')
	})

	// Обрабатываем клики по пунктам меню настроек и вызываем соответствующие действия в taskManager
	optionsDropDown.addEventListener('click', e => {
		e.stopPropagation()

		const action = e.target.dataset.action

		if (action) {
			optionsDropDown.classList.remove('header__options-visible')

			taskManager.handleMenuAction(action)
		}

		renderTasks()
	})

	document.addEventListener('click', e => {
		if (!optionsDropDown.contains(e.target)) {
			optionsDropDown.classList.remove('header__options-visible')
		}
	})
}
