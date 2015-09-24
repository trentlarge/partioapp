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
      var image = '/icon-40.png';
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

          var Locn = {lat: result.H, lng: result.L};
          console.log(Locn);

          directionsDisplay.setMap(null);
          calcRoute(map, Session.get('currentLoc') , Locn);    

          Connections.update({_id: connectionId}, 
            {$set: {meetupLocation: Session.get('newLocation').address, 
            meetupLatLong: Session.get('newLocation').latLong}});
          
            meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
            console.log('meetingCoordinates: ' + JSON.stringify(meetingCoordinates));

          });
      });

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

  console.log(Session.get('currentLoc'));

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

    if (this.lat) 
    {
    
      currentTakerLoc = {lat: this.lat, lng: this.lng};
      console.log('Lat/Lng');
      console.log(this.meetupLatLong);

      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(this.lat, this.lng),
          zoom: 16
        };
      }
    } 
    else 
    {
      currentTakerLoc = {lat: this.H, lng: this.L};
      console.log('H/L');
      console.log(this.meetupLatLong);

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

    // marker1 = new google.maps.Marker({
    //   position: map.options.center,
    //   map: map.instance
    // });

    addAdditionalTakerCurrentLocationMarker(map.instance);
    
    var end = new google.maps.LatLng(Session.get('takerCurrentPosition').lat, 
    Session.get('takerCurrentPosition').lng);
    var start = new google.maps.LatLng(currentTakerLoc.lat, currentTakerLoc.lng)

    // var end = marker1.position;
    // var start = marker2.position;

    calcRoute(map.instance, end, start);
  });
});

var marker1, marker2;
var takerMap;
function addAdditionalTakerCurrentLocationMarker(mapObject)
{
  var image = '/icon-current-location.png';
  var latitude, longitude;


  latitude = Session.get('takerCurrentPosition').lat;
  longitude = Session.get('takerCurrentPosition').lng;

  
    marker2 = new google.maps.Marker({
      position: {lat: latitude, lng: longitude},
      map: mapObject,
      icon: image
    });
}

var icons;
function getIcons()
{
  icons = {
  start: new google.maps.MarkerImage(
   // URL
     '/icon-small.png',
     // (width,height)
     new google.maps.Size( 44, 32 ),
     // The origin point (x,y)
     new google.maps.Point( 0, 0 ),
     // The anchor point (x,y)
     new google.maps.Point( 22, 32 )
    ),
    end: new google.maps.MarkerImage(
    '/icon-current-location.png',
     new google.maps.Size( 44, 32 ),
     // The origin point (x,y)
     new google.maps.Point( 0, 0 ),
     // The anchor point (x,y)
     new google.maps.Point( 22, 32 )
    )
   };
}

var directionsDisplay, directionsService;
function calcRoute(map, start, end) 
{
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  directionsDisplay.setMap(map);

  getIcons();
  
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(result, status) 
  {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
      var leg = result.routes[ 0 ].legs[ 0 ];
      // makeMarker( leg.start_location, icons.start, "title", map );
      // makeMarker( leg.end_location, icons.end, 'title', map );
    }
  });
}

function makeMarker( position, icon, title, map ) {
 new google.maps.Marker({
  position: position,
  map: map,
  icon: '/icon-small.png',
  title: title,
  draggable: true
 });
}


