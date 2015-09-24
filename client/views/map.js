Template.map.onRendered(function() 
{
  var connectionId = this.data.connectionId;

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
    console.log('connectionId: ' + connectionId);

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
      }).bind("geocode:dragged", function(event, result)
      {
        console.log('geocode:dragged result: ' + JSON.stringify(result));
        reverseGeocode.getLocation(result.H, result.L, function(location){
          Session.set('newLocation', {
            address: reverseGeocode.getAddrStr(),
            latLong: result
          });

          Session.set('initialLoc', {
            address: reverseGeocode.getAddrStr(),
            latLong: result
          });

          Connections.update({_id: connectionId}, 
            {$set: {meetupLocation: Session.get('newLocation').address, 
            meetupLatLong: Session.get('newLocation').latLong}});
          
          meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
          console.log('meetingCoordinates: ' + JSON.stringify(meetingCoordinates));

        });
      });

      //Add aditional marker
      map = $("#map-search").geocomplete("map");
      addAdditionalCurrentLocationMarker(map);   
    }
  });
});

var meetingCoordinates;

function addAdditionalCurrentLocationMarker(mapObject)
{
  var image = '/icon-current-location.png';
  var latitude, longitude;

  latitude = Session.get('currentLoc').lat;
  longitude = Session.get('currentLoc').lng;

  
  var marker = new google.maps.Marker({
      position: {lat: latitude, lng: longitude},
      map: mapObject,
      icon: image
    });

  marker.setMap(mapObject);

  calcRoute(mapObject, Session.get('currentLoc') , Session.get('initialLoc'));   
}

Template.map.events({
  // 'click button': function() {
  //   $("#map-search").trigger("geocode");
  // },
  'click #update-map-location': function() {
    console.log(this);
    console.log(this.essentialData);
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
              draggable: true,
              animation: google.maps.Animation.DROP,
              title:"Meet Up Location"
            },
          }).bind("geocode:dragged", function(event, result){
            console.log(result);
            reverseGeocode.getLocation(result.H, result.L, function(location){
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
        location: [latLong.H, latLong.L],
        componentRestrictions: {
          country: 'US'
        },
        markerOptions: {
          draggable: true,
          animation: google.maps.Animation.DROP,
          title:"Meet Up Location"
        },
      }).bind("geocode:dragged", function(event, result){
        console.log(result);
        reverseGeocode.getLocation(result.H, result.L, function(location){
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






var currentTakerLoc;
Template.onlyMap.helpers({
  exampleMapOptions: function() {
    console.log('H: ' + this.H);
    currentTakerLoc = {lat: this.H, lng: this.L};

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
          center: new google.maps.LatLng(this.H, this.L),
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

    addAdditionalTakerCurrentLocationMarker(map.instance);
    var end = new google.maps.LatLng(Session.get('takerCurrentPosition').lat, 
    Session.get('takerCurrentPosition').lng);

  var start = new google.maps.LatLng(currentTakerLoc.lat, currentTakerLoc.lng)

    calcRoute(map.instance, end, start);
  });
});

var takerMap;
function addAdditionalTakerCurrentLocationMarker(mapObject)
{
  var image = '/icon-current-location.png';
  var latitude, longitude;


  latitude = Session.get('takerCurrentPosition').lat;
  longitude = Session.get('takerCurrentPosition').lng;

  
  var marker = new google.maps.Marker({
      position: {lat: latitude, lng: longitude},
      map: mapObject,
      icon: image
    });
}


function calcRoute(map, end, start) 
{
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  directionsDisplay.setMap(map);

  console.log(end + start)
;  
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(result, status) 
  {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
}
