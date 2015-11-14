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
			console.log("Geocode was not successful for the following reason: " + status);
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
				console.log('Reverse geocoding: No results found');
			}
		} else {
			console.log('Reverse geocoding: Geocoder failed due to: ' + status);
		}
	});
};

Template.map.created = function() {
	var centerMarker = null;

	GoogleMaps.ready('meetupMap', function(map) {
		map.instance.geocoder = new google.maps.Geocoder;

		centerMarker = new google.maps.Marker({
			position: map.options.center,
			map: map.instance
		});

		map.instance.addListener('center_changed', function(e) {
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
				zoom: 8
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

      		Connections.update({ _id: t.data.connectionId }, {
				$set: {
					meetupLocation: address,
					meetupLatLong: latLng 
				}
      		});
		});
	}
});
