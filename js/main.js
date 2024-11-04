class Overlay {
	constructor() {
		this.body = document.body
		this.noScroll = document.querySelector('body')
		this.overlay = document.createElement('div')
	}

	add() {
		this.body.classList.add('scroll-lock')
		this.body.append(this.overlay)
		this.overlay.classList.add('overlay')
	}
	remove() {
		this.body.classList.remove('scroll-lock')
		this.overlay.classList.remove('overlay')
		this.overlay.remove()
	}
}

class HeaderMenu {
	constructor() {
			this.overlay = new Overlay();
			this.noScrollBody = document.body;
			this.header = document.querySelector('.header');
			this.btn = document.querySelector('.header__burger');
			this.menu = document.querySelector('.header__menu');

			this.setupEventListeners();
			this.handleClickHeaderMenu();
	}

	setupEventListeners() {
			this.btn.addEventListener('click', this.toggle.bind(this));
	}

	toggle() {
			if (this.header.classList.contains('header__mobile--open')) {
					this.close();
			} else {
					this.open();
			}
	}

	open() {
			this.header.classList.add('header__mobile--open');
			this.btn.classList.add('active');
			this.noScrollBody.classList.add('scroll-lock');
			this.overlay.add();
			this.focusOfFirstItem();
			this.trapFocus(); // Добавляем ловушку для фокуса при открытии
	}

	close() {
			this.header.classList.remove('header__mobile--open');
			this.btn.classList.remove('active');
			this.noScrollBody.classList.remove('scroll-lock');
			this.overlay.remove();
			this.removeFocusTrap(); // Убираем ловушку для фокуса при закрытии
	}

	handleClickHeaderMenu() {
			if (window.innerWidth < 768) {
					const headerMenuLinks = this.menu.querySelectorAll('a');
					headerMenuLinks.forEach(link => {
							link.addEventListener('click', () => {
									this.close();
							});
					});
			}
	}

	focusOfFirstItem() {
			const firstItem = this.menu.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
			setTimeout(() => {
					if (firstItem) firstItem.focus();
			}, 100);
	}

	trapFocus() {
			const focusableElements = this.header.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
			const firstFocusableElement = focusableElements[0];
			const lastFocusableElement = focusableElements[focusableElements.length - 1];

			this.handleFocusTrap = this.handleFocusTrap.bind(this, firstFocusableElement, lastFocusableElement); // Сохраняем привязанный обработчик
			this.header.addEventListener('keydown', this.handleFocusTrap);
	}

	handleFocusTrap(firstFocusableElement, lastFocusableElement, e) {
			const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

			if (!isTabPressed) {
					return;
			}

			if (e.shiftKey) { // Если Shift + Tab
					if (document.activeElement === firstFocusableElement) {
							e.preventDefault();
							lastFocusableElement.focus();
					}
			} else { // Если просто Tab
					if (document.activeElement === lastFocusableElement) {
							e.preventDefault();
							firstFocusableElement.focus();
					}
			}
	}

	removeFocusTrap() {
			this.header.removeEventListener('keydown', this.handleFocusTrap);
	}
}





function lockScroll() {
	document.body.classList.add('scroll-lock')
}

function initTelMask() {
	const telMasks = document.querySelectorAll('input[type="tel"]')
	if (telMasks.length === 0) {
		return
	}
	telMasks.forEach(telMask => {
		Inputmask('+7 (999) 999-99-99').mask(telMask)
	})
}

function isTouchDevice() {
	return (
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0
	)
}

function createValidator(formElement, callback) {
	const validationConfig = {
		validateBeforeSubmitting: true,
		errorFieldCssClass: 'invalid',
		errorLabelStyle: {
			color: 'var(--input-error)',
		},
		successFieldStyle: {
			borderColor: 'var(--input-active-success)',
		},
	}

	const validator = new window.JustValidate(formElement, validationConfig)
	setupValidationRules(validator, formElement)

	let isFormValid = false
	formElement.addEventListener('submit', e => {
		e.preventDefault()
		if (!isFormValid) {
			return
		}
		if (callback && typeof callback === 'function') {
			callback(e)
		}
		isFormValid = false
	})

	validator.onSuccess(() => {
		isFormValid = true
		console.log('Validation successful')
	})
}

function setupValidationRules(validator, formElement) {
	formElement.querySelectorAll('[required]').forEach(input => {
		validator.addField(input, [
			{
				rule: 'required',
				errorMessage: 'необходимо заполнить поле',
			},
		])
	})

	formElement.querySelectorAll('[type="email"]').forEach(email => {
		validator.addField(email, [
			{
				rule: 'email',
				errorMessage: 'Поле заполнено некорректно',
			},
			{
				rule: 'required',
				errorMessage: 'необходимо заполнить поле',
			},
		])
	})

	validator.onValidate(({ isValid, isSubmitted, fields, groups }) => {
		for (i in fields) {
			const item = fields[i]
			item.rules.forEach(obj => {
				if (obj.rule === 'required') {
					item.elem.closest('.input')?.classList.add('invalid')
				}
			})
			if (item.isValid) {
				item.elem.closest('.input')?.classList.remove('invalid')
			}
		}
	})
}

async function handleFormSubmission(e) {
	e.preventDefault()
	const form = e.currentTarget
	const formData = new FormData(form)
	const actionUrl = form.action
	console.log('Form action URL:', actionUrl)

	for (const [key, value] of formData.entries()) {
		console.log(`${key}: ${value}`)
	}

	// try {
	// 	const response = await fetch(actionUrl, {
	// 		method: 'POST',
	// 		body: formData,
	// 	})
	// 	const result = await response.json()
	// 	form.reset()
	showSuccessModal()

	// } catch (error) {
	// 	alert('Ошибка при отправке формы')
	// 	console.error('Form submission error:', error)
	// }
}

function showSuccessModal() {
	const successModal = document.querySelector('#modalConsultationSuccess')
	successModal.showModal()
	lockScroll()
}

function initializeForm(formElement, callback) {
	createValidator(formElement, callback)
}

function initValidationForms() {
	const consultationForms = document.querySelectorAll('.consultation-form')
	consultationForms.forEach(consultationForm => {
		initializeForm(consultationForm, handleFormSubmission)
	})
}

function initModal() {
	const dialogs = document.querySelectorAll('dialog')
	const modalConsultation = document.querySelector('#modalConsultation')
	const modalConsultationOpenBtns = document.querySelectorAll(
		'.modal-consultation__open'
	)

	const returnScroll = () => {
		document.body.classList.remove('scroll-lock')
	}
	modalConsultationOpenBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			modalConsultation.showModal()
			lockScroll()
		})
	})

	dialogs.forEach(dialogElement => {
		dialogElement.addEventListener('close', returnScroll)
		dialogElement.addEventListener('click', closeOnBackDropClick)
	})

	function closeOnBackDropClick({ currentTarget, target }) {
		const dialogElement = currentTarget
		const isClickedOnBackDrop = target === dialogElement
		if (isClickedOnBackDrop) {
			dialogElement.close()
		}
	}
}

function initDropdownMenu() {
	const dropdowns = document.querySelectorAll('.dropdown');

	if (!dropdowns || dropdowns.length === 0) {
		return;
	}

	dropdowns.forEach(function (dropdown) {
		const caption = dropdown.querySelector('.dropdown__caption');
		const body = dropdown.querySelector('.dropdown__body');

		if (!caption || !body) {
			return;
		}

		let hoverTimeout;

		function toggleDropdown() {
			const expanded = caption.getAttribute('aria-expanded') === 'true';
			caption.setAttribute('aria-expanded', !expanded);
			body.setAttribute('aria-hidden', expanded);
			setInertAttribute(body, expanded);
		}

		function closeDropdown() {
			caption.setAttribute('aria-expanded', 'false');
			body.setAttribute('aria-hidden', 'true');
			setInertAttribute(body, true);
		}

		function setInertAttribute(element, isInert) {
			const focusableElements = element.querySelectorAll('a, button, input, select, textarea, [tabindex]');
			focusableElements.forEach(el => {
				if (isInert) {
					el.setAttribute('inert', 'true');
				} else {
					el.removeAttribute('inert');
				}
			});
		}

		caption.addEventListener('click', function () {
			if (isTouchDevice()) {
				toggleDropdown();
			}
		});

		caption.addEventListener('keydown', function (event) {
			if (event.key === 'Enter') {
				toggleDropdown();
			}
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				closeDropdown();
			}
		});

		dropdown.addEventListener('mouseenter', function () {
			clearTimeout(hoverTimeout);
			setInertAttribute(body, false);
		});

		dropdown.addEventListener('mouseleave', function () {
			hoverTimeout = setTimeout(() => {
				if (caption.getAttribute('aria-expanded') === 'false') {
					setInertAttribute(body, true);
				}
			}, 100);
		});

		closeDropdown();
	});
}


function init() {
	new HeaderMenu()
	initTelMask()
	initValidationForms()
	initModal()
	initDropdownMenu()

	
}

document.addEventListener('DOMContentLoaded', init)
