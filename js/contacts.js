// Яндекс карта
function initYMap() {
	var map = new ymaps.Map('map', {
		center: [56.32291856843109,44.00434249999999],
		zoom: 17,
	})
	map.controls.add('zoomControl')
	// Добавление геометки
	var placemark = new ymaps.Placemark([56.32291856843109,44.00434249999999], {
		hintContent: 'Алексеевская улица, 13',
		balloonContent: 'Алексеевская улица, 13',
	})
	map.geoObjects.add(placemark)
}

function init() {
	ymaps.ready(initYMap)
}

document.addEventListener('DOMContentLoaded', init)
