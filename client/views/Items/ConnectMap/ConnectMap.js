Template.connectMap.created = function() {
    GoogleMaps.ready('connectMap', function(map) {
        map.instance.geocoder = new google.maps.Geocoder;
    });

    Session.set('inputlocked', false);
    Session.set('inputMapsearch', '');
};

Template.connectMap.rendered = function() {

};

Template.connectMap.events({
    'click #item-location-update': function(e,t) {
        var map = GoogleMaps.maps.itemMap,
            mapCenter = map.instance.getCenter(),
            location = {
                lat: mapCenter.lat(),
                lng: mapCenter.lng(),
                point: [mapCenter.lat(), mapCenter.lng()]
            };

        Session.set('connectLocation', location);
    },

    "input #item-map-search": function(e, t) {
        var editBox = $(e.currentTarget).val();

        Session.set('inputMapsearch', editBox);

        if(!Session.get('inputlocked')){
            Session.set('inputlocked', true);
            var i = 0;

            var interval = Meteor.setInterval(function(){
                i++;

                //waiting 3 secs to make request to API
                if(i == 3) {
                    Meteor.clearInterval(interval);
                    Session.set('inputlocked', false);
                    console.log(Session.get('inputMapsearch'));
                    seekOnMap();
                }
                //if()
            }, 1000);
        }
    },
});

Template.connectMap.helpers({

    view: function() {
        return Session.get('view');
    },

    "itemLocationMapOptions": function() {
        var coords = Session.get('connectLocation');

        if (GoogleMaps.loaded()) {
            return {
                center: coords,
                zoom: 18
            }
        }
    }
});

function seekOnMap() {
    var map = GoogleMaps.maps.itemMap;

    if(!map) {
        return;
    }

    map.instance.geocoder.geocode( { 'address': Session.get('inputMapsearch') }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //console.log(results, status);
            if (results[0]) {
                //console.log(results[0].geometry.location)
                GoogleMaps.maps.itemMap.instance.setCenter(results[0].geometry.location);

            } else {
                console.log(results);
                console.log('Maps > No results found');
            }
            //location);

        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}


Template.connectRentMap.created = function() {
	var self = this;

	GoogleMaps.ready('connectRentMap', function(map) {
		var meetupLocation = self.data.meetupLocation || { lat: 0, lng: 0 };
		var takerLocation = self.data.takerLocation || { lat: 0, lng: 0 };

		var meetupMarker = new google.maps.Marker({
			position: meetupLocation,
			icon: base64imgs('icon-marker-destination'),
			map: map.instance
		});

		var takerMarker = new google.maps.Marker({
			position: self.data.takerLocation,
			icon: base64imgs('icon-current-location'),
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

Template.connectRentMap.helpers({
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
