Template.map.onRendered(function() {
  var currentLocation = Geolocation.latLng();
  if (currentLocation) {
    reverseGeocode.getLocation(currentLocation.lat, currentLocation.lng, function(location){
      Session.set('newLocation', {
        address: reverseGeocode.getAddrStr(),
        latLong: currentLocation
      });
    });
  }

  console.log(Geolocation.latLng());
  this.autorun(function () {
    if (GoogleMaps.loaded()) {
      $("#map-search").geocomplete({
        map: "#map-box",
        location: [currentLocation.lat, currentLocation.lng],
        componentRestrictions: {
          country: 'US'
        },
        markerOptions: {
          draggable: true
        },
      }).bind("geocode:dragged", function(event, result){
        reverseGeocode.getLocation(result.G, result.K, function(location){
          Session.set('newLocation', {
            address: reverseGeocode.getAddrStr(),
            latLong: result
          });
        });
      });
    }
  });
});

Template.map.events({
  'click button': function() {
    $("#map-search").trigger("geocode");
  }
})

Template.map.helpers({
  newLocation: function() {
    if (Session.get('newLocation')) {
      return Session.get('newLocation').address;
    }
  }
})
