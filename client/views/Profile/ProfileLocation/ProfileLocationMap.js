Template.profileLocationMap.created = function() {
    GoogleMaps.ready('itemMap', function(map) {
        map.instance.geocoder = new google.maps.Geocoder;
    });

    Session.set('inputlocked', false);
    Session.set('inputMapsearch', '');
};

Template.profileLocationMap.rendered = function() {
    if(!Session.get('view')) {
        $('.modal .content').removeClass('has-header');
    }
};

Template.profileLocationMap.events({
    'click #item-location-update': function(e,t) {
        var map = GoogleMaps.maps.itemMap,
            mapCenter = map.instance.getCenter(),
            location = {
                lat: mapCenter.lat(),
                lng: mapCenter.lng(),
                point: [mapCenter.lat(), mapCenter.lng()]
            };

        Session.set('profileLocation', location);
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




        // Session.set('inputlocked', 1);
        // Session.set('inputMapsearch', editBox);

        // if(Session.get('inputlocked')) {

        // } else {

        // }
    },
});

Template.profileLocationMap.helpers({

    view: function() {
        return Session.get('view');
    },

    "itemLocationMapOptions": function() {
        var coords = Session.get('profileLocation');

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
