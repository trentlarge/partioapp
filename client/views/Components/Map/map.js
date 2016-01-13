var codeAddress = function(address, successCallback) {
	var map = GoogleMaps.maps.meetupMap
	if(!map) {
		return;
	}
	map.instance.geocoder.geocode( { 'address': address }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if(successCallback) {
				successCallback(results[0].geometry.location);
			}
		} else {
//			console.log("Geocode was not successful for the following reason: " + status);
		}
	});
};

var codeLocation = function(location, successCallback) {
	var map = GoogleMaps.maps.meetupMap
	if(!map) {
		return;
	}

	map.instance.geocoder.geocode( { 'location': location }, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				if(successCallback) {
					successCallback(results[1].formatted_address);
				}
			} else {
//				console.log('Reverse geocoding: No results found');
			}
		} else {
//			console.log('Reverse geocoding: Geocoder failed due to: ' + status);
		}
	});
};

Template.map.created = function() {
	var centerMarker = null;

	GoogleMaps.ready('meetupMap', function(map) {
		map.instance.geocoder = new google.maps.Geocoder;

		centerMarker = new google.maps.Marker({
			position: map.options.center,
			//opacity: 0,
			visible: false,
			//icon: '/icons/icon-marker-destination.png',
			map: map.instance,
			//draggable:true, //Change to false for B
			//suppressMarkers: true
		});

		map.instance.addListener('center_changed', function(e) {
			centerMarker.setPosition(map.instance.getCenter());
		});

		map.instance.addListener('drag', function(e) {
			centerMarker.setPosition(map.instance.getCenter());
		});

	});
};

Template.map.helpers({
	"meetupMapOptions": function() {
		// initial map position
		var meetingCoordinates = null;
		var savedLocation = Connections.findOne(this.connectionId);
		if(
			savedLocation &&
			savedLocation.meetupLatLong &&
			savedLocation.meetupLatLong.lat &&
			savedLocation.meetupLatLong.lng
		) {
			meetingCoordinates = savedLocation.meetupLatLong;
		}

		if(!meetingCoordinates) {
			var currentLoc = Session.get("currentLoc");
			if(currentLoc && currentLoc.lat && currentLoc.lng) {
				meetingCoordinates = currentLoc;
			} else {
				meetingCoordinates = { lat: 0, lng: 0 };
			}
		}

		if (GoogleMaps.loaded()) {
			var meetupMapOptions = {
				center: meetingCoordinates,
				zoom: 18
			};

			return meetupMapOptions;
		}
	}
});

Template.map.events({
	"input #map-search": function(e, t) {
		var editBox = $(e.currentTarget);
		codeAddress(editBox.val(), function(location) {
			GoogleMaps.maps.meetupMap.instance.setCenter(location);
		});
	},
	"click #update-map-location": function(e, t) {
		var map = GoogleMaps.maps.meetupMap
		if(!map) {
			return;
		}

		var mapCenter = map.instance.getCenter();
		codeLocation(mapCenter, function(address) {
			var latLng = {
				lat: mapCenter.lat(),
				lng: mapCenter.lng()
			};

			Meteor.call("updateMeetupLocation", t.data.connectionId, address, latLng, function(err, res) {
				if(err) {
					var errorMessage = err.reason || err.message;
					if(err.details) {
						errorMessage = errorMessage + "\nDetails:\n" + err.details;
					}
					sAlert.error(errorMessage);
					return;
				}
			});
		});
	}
});

// ---

Template.onlyMap.created = function() {
	var self = this;

	GoogleMaps.ready('onlyMap', function(map) {
		var meetupLocation = self.data.meetupLocation || { lat: 0, lng: 0 };
		var takerLocation = self.data.takerLocation || { lat: 0, lng: 0 };

		var meetupMarker = new google.maps.Marker({
			position: meetupLocation,
			icon: '/icons/icon-marker-destination.png',
			map: map.instance
		});

		var takerMarker = new google.maps.Marker({
			position: self.data.takerLocation,
			icon: '/icons/icon-current-location.png',
			map: map.instance
		});

		var latlngbounds = new google.maps.LatLngBounds();
		latlngbounds.extend(meetupMarker.getPosition());
		latlngbounds.extend(takerMarker.getPosition());
		map.instance.fitBounds(latlngbounds);

		var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
		var directionsService = new google.maps.DirectionsService();
		directionsDisplay.setMap(map.instance);

		var request = {
			origin: takerMarker.getPosition(),
			destination: meetupMarker.getPosition(),
			travelMode: google.maps.TravelMode.WALKING
		};
		directionsService.route(request, function(result, status)
		{
			if(status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
			} else {
//				console.log('Directions service: failed due to: ' + status);
			}
		});
	});
};

Template.onlyMap.helpers({
	"onlyMapOptions": function() {
		var meetupLocation = this.meetupLocation || { lat: 0, lng: 0 };
		if (GoogleMaps.loaded()) {

			var meetupMapOptions = {
				center: meetupLocation,
				zoom: 18
			};
			return meetupMapOptions;
		}
	}
});
