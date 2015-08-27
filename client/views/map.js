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




Template.mapChat.onRendered(function() {
  var latLong = this.data.meetupLatLong;
  console.log(latLong);

  if (latLong === "-") {
    var geoReady = function() {
      var realPosition = Geolocation.latLng();
      console.log(realPosition);

      // this.autorun(function () {
        if (GoogleMaps.loaded()) {
          $("#mapchat-search").geocomplete({
            map: "#mapchat-box",
            location: [realPosition.lat, realPosition.lng],
            componentRestrictions: {
              country: 'US'
            },
            markerOptions: {
              draggable: true
            },
          }).bind("geocode:dragged", function(event, result){
            console.log(result);
            reverseGeocode.getLocation(result.G, result.K, function(location){
              Session.set('newLocation', {
                address: reverseGeocode.getAddrStr(),
                latLong: result
              });
            });
          });
        }
      // });

    }

    this.autorun(function (computation) {
      if (Geolocation.currentLocation()) {
        geoReady();
        computation.stop();
      }
    });
  } else {
    
    if (GoogleMaps.loaded()) {
      $("#mapchat-search").geocomplete({
        map: "#mapchat-box",
        location: [latLong.G, latLong.K],
        componentRestrictions: {
          country: 'US'
        },
        markerOptions: {
          draggable: true
        },
      }).bind("geocode:dragged", function(event, result){
        console.log(result);
        reverseGeocode.getLocation(result.G, result.K, function(location){
          Session.set('newLocation', {
            address: reverseGeocode.getAddrStr(),
            latLong: result
          });
        });
      });
    }
  }

  
});

Template.mapChat.events({
  'click button': function() {
    $("#mapchat-search").trigger("geocode");
  },
  'click #updateMeetup': function() {
    var connectionId = this.connectionId;
    if (Session.get('newLocation')) {
      Connections.update({_id: connectionId}, {$set: {meetupLocation: Session.get('newLocation').address, meetupLatLong: Session.get('newLocation').latLong}});
    }
  }
})

Template.mapChat.helpers({
  newLocation: function() {
    if (Session.get('newLocation')) {
      return Session.get('newLocation').address;
    }
  }
})







Template.onlyMap.helpers({
  exampleMapOptions: function() {
    console.log(this);

    if (this.lat) {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(this.lat, this.lng),
          zoom: 16
        };
      }
    } else {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(this.G, this.K),
          zoom: 16
        };
      }
    }
    
  }
});

Template.onlyMap.onCreated(function() {

  GoogleMaps.ready('exampleMap', function(map) {

    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});
