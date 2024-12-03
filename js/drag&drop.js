import { taskManager } from './taskManager.js'
import { renderTasks } from './taskRenderer.js'

// Потенциальная цель переноса, над которой мы пролетаем прямо сейчас
let currentDroppable = null
// Визуальное представление перетаскиваемого элемента
let placeholder
// Начат ли перенос нашего элемента
let isDraggingStarted = false
// Текущий перетаскиваемый элемент
let movingElement = null

export function dragAndDrop() {
	// Рассчитываем смещение

	const shifts = {
		shiftX: 0,
		shiftY: 0,
		set: (clientX, clientY, movingElement) => {
			shifts.shiftX = clientX - movingElement.getBoundingClientRect().left
			shifts.shiftY = clientY - movingElement.getBoundingClientRect().top
		},
	}

	const setInactiveStateForElements = () => {
		const activeElements = document.querySelectorAll(
			'.todo-list__item:not(.dragging)'
		)

		activeElements.forEach(el => {
			el.classList.add('todo-list__item-inactive')
		})
	}

	const removeInactiveState = () => {
		const inactiveElements = document.querySelectorAll(
			'.todo-list__item:not(.dragging)'
		)

		inactiveElements.forEach(el => {
			el.classList.remove('todo-list__item-inactive')
		})
	}

	// Получаем координаты перемещаемого элемента
	const getElementCoordinates = node => {
		const rect = node.getBoundingClientRect()
		return {
			top: rect.top + rect.height / 2,
			left: rect.left + rect.width / 2,
		}
	}

	const isAbove = (nodeA, nodeB) => {
		const rectA = nodeA.getBoundingClientRect()
		const rectB = nodeB.getBoundingClientRect()

		return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2
	}

	// Получаем элемент который находится под перемещаемым
	const getElementBelow = movingElement => {
		const movingElementCenter = getElementCoordinates(movingElement)
		movingElement.style.display = 'none'
		const elementBelow = document.elementFromPoint(
			movingElementCenter.left,
			movingElementCenter.top
		)
		movingElement.style.display = ''
		return elementBelow
	}

	// Создаём placeholder перед перемещаемым элементом
	const createPlaceholder = () => {
		placeholder = document.createElement('div')
		placeholder.classList.add('todo-list__item-placeholder')
		placeholder.style.height = `${movingElement.offsetHeight}px`
		placeholder.style.width = `${movingElement.offsetWidth}px`
		movingElement.parentNode.insertBefore(placeholder, movingElement)
	}

	// При движении мыши с элементом
	const onMouseMove = event => {
		if (!isDraggingStarted) {
			isDraggingStarted = true
			createPlaceholder()
			movingElement.style.width = movingElement.offsetWidth + 'px'
			movingElement.style.position = 'absolute'
			movingElement.style.zIndex = '1000'
			movingElement.classList.add('dragging')
			setInactiveStateForElements()
		}

		moveAt(movingElement, event.pageX, event.pageY)

		let elementBelow = getElementBelow(movingElement)

		if (!elementBelow) return
		let droppableBelow = elementBelow.closest('.todo-list__item')

		if (currentDroppable != droppableBelow) {
			currentDroppable = droppableBelow

			if (currentDroppable) {
				if (!isAbove(movingElement, currentDroppable)) {
					currentDroppable.parentNode.insertBefore(
						placeholder,
						currentDroppable
					)
				} else {
					currentDroppable.parentNode.insertBefore(
						placeholder,
						currentDroppable.nextElementSibling
					)
				}
			}
		}
	}

	// Перемещение элемента
	const moveAt = (element, pageX, pageY) => {
		// element - текущий перемещаемый элемент
		// pageX - координаты курсора отностиельно страницы по горизонтали
		// pageY - координаты курсора отностиельно страницы по вертикали

		// Координаты верхнего левого угла на странице
		let newX = pageX - shifts.shiftX
		let newY = pageY - shifts.shiftY

		// Нижняя граница документа с прокруткой
		const documentBottom = document.documentElement.scrollHeight

		// Верхняя граница экрана
		const documentTop = window.scrollY

		// Высота видимой части экрана
		const viewportHeight = document.documentElement.clientHeight

		// Проверка автопрокрутки вниз
		if (pageY + 20 > documentTop + viewportHeight) {
			window.scrollBy(0, 10)
		}

		// Проверка автопрокрутки вверх
		if (pageY - 20 < documentTop) {
			window.scrollBy(0, -10)
		}

		// Ограничение координат
		if (newY < documentTop) newY = documentTop // Ограничение сверху

		if (newY + element.offsetHeight > documentBottom) {
			newY = documentBottom - element.offsetHeight // Ограничение снизу
		}

		if (newX < 0) newX = 0 // Ограничение слева
		if (newX + element.offsetWidth > document.documentElement.clientWidth) {
			newX = document.documentElement.clientWidth - element.offsetWidth // Ограничение справа
		}

		// Применяем новые координаты
		element.style.left = `${newX}px`
		element.style.top = `${newY}px`
	}

	// Устанавливаем текущий перетаскиваемый элемент
	const setMovingElement = event => {
		movingElement = event.target.closest('li')
	}

	// При отпускании мыши
	const onMouseUp = () => {
		if (!isDraggingStarted) {
			document.removeEventListener('mousemove', onMouseMove)
			movingElement.onmouseup = null
			return
		}

		placeholder.parentNode.insertBefore(movingElement, placeholder)
		movingElement.style.position = ''
		movingElement.style.zIndex = ''
		movingElement.style.left = ''
		movingElement.style.top = ''
		movingElement.classList.remove('dragging')
		document.removeEventListener('mousemove', onMouseMove)
		isDraggingStarted = false
		placeholder.parentNode.removeChild(placeholder)
		movingElement.onmouseup = null
		movingElement = null
		removeInactiveState()
	}

	// При нажатии мыши на элемент
	const onMouseDown = event => {
		setMovingElement(event)
		event.preventDefault()
		shifts.set(event.clientX, event.clientY, movingElement)
		document.addEventListener('mousemove', onMouseMove)
		movingElement.onmouseup = onMouseUp
	}
	// Выбираем все наши задачи и добавляем к ним события
	for (const draggableElement of document.querySelectorAll(
		'.todo-list__item'
	)) {
		draggableElement.onmousedown = onMouseDown
		draggableElement.ondragstart = () => {
			return false
		}
	}
}
