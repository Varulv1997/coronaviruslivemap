var global = {
	"cases": {
		"confirmed": 0,
		"deaths": 0,
		"recovered": 0
	},
	"countries": {
		/*"Mainland China": {
		  name: countryName,
		  cases: {
			confirmed: 123,
			deaths: 456,
			recovered: 78
		  },
		  states: ['Hubei']
		}*/
	},
	"states": {
		/*'Mainland China___Hubei': {
		  name: 'Hubei',
		  country: 'Mainland China',
		  lat: 12.34,
		  long: 56.78,
		  cases: {
			confirmed: 123,
			deaths: 456,
			recovered: 78
		  }
		}*/
	}
};
var dataInitialized = false;

var map = null;

// get the container id
var $globalConfirmed = $('#global-confirmed');

var $totalConfirmed = $('#total-confirmed');
var $totalDeaths = $('#total-deaths');
var $totalRecovered = $('#total-recovered');

var $deathsPercentage = $('#deaths-percentage');
var $recoverdPercentage = $('#recoverd-percentage');

var $countryTbody = $('#total-confirmed-by-country');
var $stateTbody = $('#total-confirmed-by-state');

var $totalConfirmedTbody = $('#total-confirmed-body');
var $totalDeathsTbody = $('#total-deaths-body');
var $totalRecoveredTbody = $('#total-recovered-body');

$countryTbody.on('click', 'tr', function (event) {
	event.preventDefault();
	var $this = $(this);
	var countryId = $this.data('country');
	
	if (countryId == 'global' || $this.hasClass('active')) {
		unselectCountry(countryId);
	} else {
		selectCountry(countryId);
	}
	
	$("#current_country").val($.trim(countryId));
	
 	myInit(countryId);
 	
});

$('.state-cases-header .close').on('click', function (event) {
  console.log('close clicked');
	$('#world-map').show();
	$('#state-cases').hide();
})
// $stateTbody.on('click', 'tr', function (event) {
// 	event.preventDefault();
// 	var $this = $(this);
// 	var country = $this.data('country');
// 	var state = $this.data('state');
	
// 	//alert(country);
	
// 	myInit(country);
	
// 	if ($this.hasClass('active')) {
// 		unselectState(country, state);
// 	} else {
// 		selectState(country, state);
// 	}
// });

// $totalDeathsTbody.on('click', 'tr', function (event) {
// 	event.preventDefault();
// 	var $this = $(this);
// 	var country = $this.data('country');
// 	var state = $this.data('state');
// });

// $totalRecoveredTbody.on('click', 'tr', function (event) {
// 	event.preventDefault();
// 	var $this = $(this);
// 	var country = $this.data('country');
// 	var state = $this.data('state');
// });

function selectCountry(countryId) {
	console.log('selectCountry()', 'country', countryId);

	// shoq/hide data in table
	$countryTbody.children('tr').removeClass('active');
	$countryTbody.children('tr[data-country="' + countryId + '"]').addClass('active');

	// scroll to lat,long
	var country = global.countries[countryId];

	var largestConfirmedCase = 0;
	var largestState = '';
	for (var i in global.countries[countryId].states) {
		var stateId = global.countries[countryId].states[i];
		var state = global.states[countryId + '___' + stateId];
		if (state.cases.confirmed > largestConfirmedCase) {
			largestConfirmedCase = state.cases.confirmed;
			largestState = stateId;
		}
	}

	console.log('largestState', largestState);

	var state = global.states[countryId + '___' + largestState];
	var latLng = new google.maps.LatLng(state.lat, state.lng);
	map.panTo(latLng);

	$totalConfirmed.text(Number(country.cases.confirmed + '').toLocaleString());
	$totalDeaths.text(Number(country.cases.deaths + '').toLocaleString());
	$totalRecovered.text(Number(country.cases.recovered + '').toLocaleString());
	
	//console.log('$deathsPercentage', (country.cases.deaths/country.cases.confirmed * 100).toFixed(2).toLocaleString() + "% of confirmed");
	//console.log('$recoverdPercentage', (country.cases.recovered/country.cases.confirmed * 100).toFixed(2).toLocaleString() + + "% of confirmed");
	
	$deathsPercentage.text((country.cases.deaths/country.cases.confirmed * 100).toFixed(2).toLocaleString() + "% of confirmed");
	$recoverdPercentage.text((country.cases.recovered/country.cases.confirmed * 100).toFixed(2).toLocaleString() + "% of confirmed");

	// $stateTbody.children('tr').removeClass('active');

	// $totalDeathsTbody.children('tr').hide();
	// $totalDeathsTbody.children('tr[data-country="' + id + '"]').show();

	// $totalRecoveredTbody.children('tr').hide();
	// $totalRecoveredTbody.children('tr[data-country="' + id + '"]').show();
	
	var statesArray = Object.keys(global.states).map(key => global.states[key]);
	var statesByConfirmed = _.filter(statesArray, function (state) { return state.country === countryId; });
	statesByConfirmed = _.sortBy(statesByConfirmed, ['cases.confirmed', 'name']).reverse();
	
	$totalConfirmedTbody.html('');
	for (var key in statesByConfirmed) {
		var state = statesByConfirmed[key];
		$('<tr data-country="' + state.country + '" data-state="' + state.name + '">'
			+ '<td>' + (state.name == '' ? '' : '<strong>' + state.name + '</strong><br/>') + state.country + '</td>'
			+ '<td class="confirmed-text">' + Number(state.cases.confirmed + '').toLocaleString() + '</td>'
			+ '</tr>'
		).appendTo($totalConfirmedTbody);

		console.log(state.name, state.lat, state.lng);
	};

	var statesByDeaths = _.filter(statesArray, function (state) { return state.country === countryId; });
	statesByDeaths = _.sortBy(statesByDeaths, ['cases.deaths', 'name']).reverse();
	$totalDeathsTbody.html('');
	for (var key in statesByDeaths) {
		var state = statesByDeaths[key];
		$('<tr data-country="' + state.country + '" data-state="' + state.name + '">'
			+ '<td>' + (state.name == '' ? '' : '<strong>' + state.name + '</strong><br/>') + state.country + '</td>'
			+ '<td>' + Number(state.cases.deaths + '').toLocaleString() + '</td>'
			+ '</tr>'
			+ '</td></tr>'
		).appendTo($totalDeathsTbody);
	};

	var statesByRecovered = _.filter(statesArray, function (state) { return state.country === countryId; });
	statesByRecovered = _.sortBy(statesByRecovered, ['cases.recovered', 'name']).reverse();
	$totalRecoveredTbody.html('');
	for (var key in statesByRecovered) {
		var state = statesByRecovered[key];
		$('<tr data-country="' + state.country + '" data-state="' + state.name + '">'
		+ '<td>' + (state.name == '' ? '' : '<strong>' + state.name + '</strong><br/>') + state.country + '</td>'
			+ '<td class="text-success">' + Number(state.cases.recovered + '').toLocaleString() + '</td>'
			+ '</tr>'
		).appendTo($totalRecoveredTbody);
	};
}

function unselectCountry(id) {
	$countryTbody.children('tr').removeClass('active');
	$countryTbody.children('tr:first').addClass('active');
	
	$totalConfirmed.text(Number(global.cases.confirmed + '').toLocaleString());
	$totalDeaths.text(Number(global.cases.deaths + '').toLocaleString());
	$totalRecovered.text(Number(global.cases.recovered + '').toLocaleString());
	
	$deathsPercentage.text((global.cases.deaths/global.cases.confirmed * 100).toFixed(2).toLocaleString() + "% of confirmed");
	$recoverdPercentage.text((global.cases.recovered/global.cases.confirmed * 100).toFixed(2).toLocaleString() + "% of confirmed");

	$totalConfirmedTbody.html('');
	$totalDeathsTbody.html('');
	$totalRecoveredTbody.html('');
	// $totalDeathsTbody.children('tr').show();
	// $totalRecoveredTbody.children('tr').show();
}

// function selectState(countryId, stateId) {
// 	if (!countryId || !stateId) {
// 		return;
// 	}
// 	// scroll to lat,long
// 	var state = global.states[countryId + '___' + stateId];
// 	var latLng = new google.maps.LatLng(state.lat, state.lng);
//     map.panTo(latLng);

// 	// shoq/hide data in table
// 	// $countryTbody.children('tr').removeClass('active');

// 	$stateTbody.children('tr').removeClass('active');
// 	$stateTbody.children('tr[data-country="' + countryId + '"][data-state="' + stateId + '"]').addClass('active');

// 	// $totalDeathsTbody.children('tr').hide();
// 	// $totalDeathsTbody.children('tr[data-country="' + country + '"][data-state="' + state + '"]').show();

// 	// $totalRecoveredTbody.children('tr').hide();
// 	// $totalRecoveredTbody.children('tr[data-country="' + country + '"][data-state="' + state + '"]').show();
// }

// function unselectState(country, state) {
// 	$stateTbody.children('tr').removeClass('active');

// 	// $totalDeathsTbody.children('tr').show();

// 	// $totalRecoveredTbody.children('tr').show();
// }

function onDataReterived(data) {
	$(data).find('row').each(function () {
		var countryName = $(this).find("Country").text();
		var stateName = $(this).find("State").text();
		var confirmed = parseInt($(this).find("Confirmed").text(), 10);
		var deaths = parseInt($(this).find("Deaths").text(), 10);
		var recovered = parseInt($(this).find("Recovered").text(), 10);
		var latitude = parseFloat($(this).find("Latitude").text(), 10);
		var longitude = parseFloat($(this).find("Longitude").text(), 10);

		if (confirmed < 1) {
			return;
		}

		if (global.countries[countryName] == undefined) {
			global.countries[countryName] = {
				name: countryName,
				cases: {
					confirmed: confirmed,
					deaths: deaths,
					recovered: recovered
				},
				states: []
			};
		} else {
			global.cases.confirmed += confirmed;
			global.cases.deaths += deaths;
			global.cases.recovered += recovered;

			global.countries[countryName].cases.confirmed += confirmed;
			global.countries[countryName].cases.deaths += deaths;
			global.countries[countryName].cases.recovered += recovered;
		}

		global.countries[countryName].states.push(stateName);

		global.states[countryName + '___' + stateName] = {
			name: stateName,
			country: countryName,
			lat: latitude,
			lng: longitude,
			cases: {
				confirmed: confirmed,
				deaths: deaths,
				recovered: recovered
			}
		};
	});

	dataInitialized = true;
}

function renderTable() {
	$globalConfirmed.text(Number(global.cases.confirmed + '').toLocaleString());
	$totalConfirmed.text(Number(global.cases.confirmed + '').toLocaleString());
	$totalDeaths.text(Number(global.cases.deaths + '').toLocaleString());
	$totalRecovered.text(Number(global.cases.recovered + '').toLocaleString());
	
	$deathsPercentage.text((global.cases.deaths/global.cases.confirmed * 100).toFixed(2).toLocaleString() + "% of confirmed");
	$recoverdPercentage.text((global.cases.recovered/global.cases.confirmed * 100).toFixed(2).toLocaleString() + "% of confirmed");

	var countriesArray = Object.keys(global.countries).map(key => global.countries[key]);
	var countriesByConfirmed = _.sortBy(countriesArray, ['cases.confirmed', 'name']).reverse();
	for (var key in countriesByConfirmed) {
		var country = countriesByConfirmed[key];

		$('<tr data-country="' + country.name + '"">'
			+ '<td>' + Number(country.cases.confirmed + '').toLocaleString() + '</td>'
			+ '<td>' + country.name + '</td>'
			+ '</tr>'
		).appendTo($countryTbody);
	};
}

var polling = setInterval(function () {
	console.log('polling...');
	if (dataInitialized && map != null) {
		clearInterval(polling);

		createMarker(map, global.states);
	}
}, 1000);

$.ajax({
	type: "GET",
	url: "dist/data/sample_2.xml",
	cache: false,
	dataType: "xml"
}).done(function (data, textStatus, jqXHR) {
	console.log("ajax success");
	onDataReterived(data);
	renderTable();
}).fail(function (qXHR, textStatus, errorThrown) {
	console.log("ajax error");
});

var styles = [{ elementType: 'geometry', stylers: [{ color: '#242f3e' }] }, { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] }, { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] }, { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] }, { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] }, { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] }, { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] }, { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] }, { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] }, { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] }, { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] }, { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] }, { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] }, { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] }, { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] }, { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] }, { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] }];

function initMap() {
	map = createMap("world-map");
}

// create the map
function createMap(id) {
	var options = {
		zoom: 5,
		styles: styles,
		gestureHandling: 'greedy',
		center: new google.maps.LatLng(30.9756, 112.2707),
		//scrollwheel : false,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		navigationControlOptions: {
			style: google.maps.NavigationControlStyle.SMALL,
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		panControl: false,
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		overviewMapControl: false,
		rotateControl: false
	};

	return new google.maps.Map(document.getElementById(id), options);
}

// create markers
function createMarker(map, states) {
	if (!states || states.length == 0) {
		return;
	}

	for (var key in states) {
		var state = states[key];
		console.log('createMarker()', key, state);

		// create marker
		var marker = new google.maps.Circle({
			strokeColor: '#FF0000',
			strokeOpacity: 0.6,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			map: map,
			myCountry: state.country,
			myState: state.name,
			position: {lat: state.lat, lng: state.lng},
			center: new google.maps.LatLng(state.lat, state.lng),
			radius: Math.sqrt(state.cases.confirmed) * (state.country == " Mainland China" ? CHINA_MULTIPLIER : DEFAULT_MULTIPLIER)
		});

		createMarkerInfoWindow(map, marker, state);
	}
}

var lastInfowindow = null;

var DEFAULT_MULTIPLIER = 3000;
var CHINA_MULTIPLIER = 1200;

function createMarkerInfoWindow(map, marker, state) {
	console.log('createMarkerInfoWindow()', '...', state.country, state.name);

	// // create the popup info window for each marker
	// var contentString = '<div class="state-marker"><h3>' + (state.name == '' ? state.country : state.name + '&nbsp;(' + state.country + ')') + '&nbsp;</h3><br>';
	// contentString += '<b>Confirmed : </b>' + state.cases.confirmed + '<br>'
	// contentString += '<b>Recovered : </b>' + state.cases.recovered + '<br>'
	// contentString += '<b>Deaths : </b>' + state.cases.deaths + '</div>'

	// var infowindow = new google.maps.InfoWindow({
	// 	content: contentString
	// });
	
	google.maps.event.addListener(marker, 'click', function (e) {
		console.log('click', state.name);
		// if (lastInfowindow != null) {
		// 	lastInfowindow.close();
		// }

		// infowindow.open(map, marker);

		// lastInfowindow = infowindow;

		selectCountry(state.country);

		$('#world-map').hide();
		$('#state-cases').show();
	});
}
