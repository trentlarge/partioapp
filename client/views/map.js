Template.map.onRendered(function() 
{
  if (Session.get('initialLoc')) 
  {
    reverseGeocode.getLocation(Session.get('initialLoc').lat, Session.get('initialLoc').lng, function(location){
      Session.set('newLocation', {
        address: reverseGeocode.getAddrStr(),
        latLong: [Session.get('currentLoc').lat, Session.get('currentLoc').lng]
      });
    });
  }

  this.autorun(function () 
  {
    if (GoogleMaps.loaded()) 
    {
      var map = $("#map-search").geocomplete({
        map: "#map-box",
        location: [Session.get('initialLoc').lat, Session.get('initialLoc').lng],
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

      //Add aditional marker
      map = $("#map-search").geocomplete("map");
      addAdditionalCurrentLocationMarker(map);      
    }
  });
});

function addAdditionalCurrentLocationMarker(mapObject)
{
  var image = '/icon-40.png';

  var marker = new google.maps.Marker({
      position: {lat: Session.get('initialLoc').lat, lng: Session.get('initialLoc').lng},
      map: mapObject
    });

  marker.setMap(mapObject);
}

Template.map.events({
  'click button': function() {
    $("#map-search").trigger("geocode");
  }
})

Template.map.helpers({
  newLocation: function() 
  {
    if (Session.get('newLocation')) 
    {
      return Session.get('newLocation').address;
    }
  }  
})



Template.mapChat.onRendered(function() {
  var latLong = this.data.meetupLatLong;
  console.log(latLong);
  console.log('Session Loc: ' + Session.get('initialLoc').lat);

  if (latLong === "-") {
    var geoReady = function() {
      var realPosition = Geolocation.latLng(); 
      console.log(realPosition);


      // this.autorun(function () {
        if (GoogleMaps.loaded()) {
          $("#mapchat-search").geocomplete({
            map: "#mapchat-box",
            location: [Session.get('initialLoc').lat, Session.get('initialLoc').lng],
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
      // if (Geolocation.currentLocation()) {
      //   geoReady();
      //   computation.stop();
      // }

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
