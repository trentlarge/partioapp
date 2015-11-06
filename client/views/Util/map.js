Template.map.onRendered(function()
{
  connectionId = this.data.connectionId;

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
    meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
    console.log('connectionId: ' + connectionId);

    if (GoogleMaps.loaded())
    {
      var image = 'icons/icon-current-location.png';
      var map = $("#map-search").geocomplete({
        map: "#map-box",
        location: [Session.get('currentLoc').lat, Session.get('currentLoc').lng],
        componentRestrictions: {
          country: 'US'
        },
        mapOptions: {
          zoom: 18,
          styles: [{"featureType": "poi", "stylers": [{ "visibility": "off" }]},{"featureType": "transit","stylers": [{ "visibility": "off" }]}],
        },
        markerOptions: {
          icon: image
        }
      }).bind("geocode:dragged", function(event, result)
      {
        // console.log('geocode:dragged result: ' + JSON.stringify(result));
        // // console.log('test: ' + result[result.keys(result)[0]]);

        // reverseGeocode.getLocation(result.J, result.M, function(location){
        //   Session.set('newLocation', {
        //     address: reverseGeocode.getAddrStr(),
        //     latLong: result
        //   });

        //   Session.set('initialLoc', {
        //     address: reverseGeocode.getAddrStr(),
        //     latLong: result

        //   });

        //   var Locn = {lat: result.J, lng: result.M};
        //   console.log(Locn);

        //   directionsDisplay.setMap(null);
        //   calcRoute(map, Session.get('currentLoc') , Locn);

        //   Connections.update({_id: connectionId},
        //     {$set: {meetupLocation: Session.get('newLocation').address,
        //     meetupLatLong: Session.get('newLocation').latLong}});

        //     meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
        //     console.log('meetingCoordinates: ' + JSON.stringify(meetingCoordinates));

        //   });
      });

      map = $("#map-search").geocomplete("map");
      if (meetingCoordinates && meetingCoordinates.length > 0)
        map.setCenter(new google.maps.LatLng(meetingCoordinates[0], meetingCoordinates[1]));

      google.maps.event.addListener(map, 'dragend', function() {
        var centerObj = map.getCenter();
        var center = [centerObj.lat(),centerObj.lng()];
        reverseGeocode.getLocation(center[0], center[1], function(location){
          Session.set('newLocation', {
            address: reverseGeocode.getAddrStr(),
            latLong: center
          });
        });

      });
      /*
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);
      var request = {
        origin: new google.maps.LatLng(Session.get('currentLoc').lat, Session.get('currentLoc').lng),
        destination: new google.maps.LatLng(meetingCoordinates[0], meetingCoordinates[1]),
        travelMode: google.maps.DirectionsTravelMode.WALKING
      };

      directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
         directionsDisplay.setDirections(response);
        }
      });
      */
    }

     addAdditionalCurrentLocationMarker(map);
  });



});

var meetingCoordinates;
var marker;
var map;


function addAdditionalCurrentLocationMarker(mapObject)
{
  var image = 'icons/icon-current-location.png';
  var latitude, longitude;
  var addressLoc;
  var meetingLocationExists = false;

  console.log('newLocation');
  console.log(meetingCoordinates);

  if(meetingCoordinates && meetingCoordinates.J)
  {
    latitude = meetingCoordinates.J;
    longitude = meetingCoordinates.M;

    meetingLocationExists = true;
    addressLoc = Session.get('newLocation').address;
  }
  else if(meetingCoordinates && meetingCoordinates.lat)
  {
    latitude = meetingCoordinates.lat;
    longitude = meetingCoordinates.lng;

    meetingLocationExists = true;
    addressLoc = Session.get('newLocation').address;
  }
  else
  {
    latitude = Session.get('initialLoc').lat;
    longitude = Session.get('initialLoc').lng;

    meetingLocationExists = false;
    addressLoc = Session.get('initialLoc').address;
  }



  //

  if(marker)
  {
    marker.setMap(null);
  }
  /*
  marker = new google.maps.Marker({
      position: {lat: latitude, lng: longitude},
      map: mapObject,
      draggable: true
    });
  */


  var Locn = {lat: latitude, lng: longitude};

  console.log(Session.get('currentLoc'));
  console.log(Locn);

  if(meetingLocationExists)
  {
    calcRoute(mapObject, Session.get('currentLoc') , Locn);
  }


  // Connections.update({_id: connectionId},
  // {$set: {meetupLocation: addressLoc,
  // meetupLatLong: Locn}});

  meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
  console.log('meetingCoordinates: ' + JSON.stringify(meetingCoordinates));

  /*
  marker.addListener('dragend', function() {

    console.log('drag end!');


    if(marker.getPosition() && marker.getPosition().J)
    {
      latitude = marker.getPosition().J;
      longitude = marker.getPosition().M;
    }
    else
    {
      latitude = Session.get('initialLoc').lat;
      longitude = Session.get('initialLoc').lng;
    }

    var Locn2 = {lat: latitude, lng: longitude};
    console.log(Locn2);

    reverseGeocode.getLocation(latitude,longitude, function(location){

      Session.set('newLocation', {
        address: reverseGeocode.getAddrStr(),
        latLong: Locn2
      });

      // Session.set('initialLoc', {
      //   address: reverseGeocode.getAddrStr(),
      //   latLong: Locn2
      // });

      if(directionsDisplay)
      {
        directionsDisplay.setMap(null);
      }

    //   var Locn = {lat: marker.getPosition().J, lng: marker.getPosition().M};
    //       console.log(connectionId + ' ' + Session.get('newLocation').address);

          calcRoute(mapObject, Session.get('currentLoc') , Locn2);

          Connections.update({_id: connectionId},
            {$set: {meetupLocation: Session.get('newLocation').address,
            meetupLatLong: Session.get('newLocation').latLong}});

            meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
    //         console.log('meetingCoordinates: ' + JSON.stringify(meetingCoordinates));

    });
  });
  */

  // mapObject.addListener('dragend', function() {
  //         // 3 seconds after the center of the map has changed, pan back to the
  //         // marker.
  //         window.setTimeout(function() {
  //           marker.setPosition(mapObject.getCenter());

  //           reverseGeocode.getLocation(marker.getPosition().J, marker.getPosition().M, function(location){

  //             Session.set('newLocation', {
  //               address: reverseGeocode.getAddrStr(),
  //               latLong: marker.getPosition()
  //             });

  //           //   Session.set('initialLoc', {
  //           //     address: reverseGeocode.getAddrStr(),
  //           //     latLong: marker.getPosition()
  //           //   });

  //           });

  //           if(directionsDisplay)
  //           {
  //             directionsDisplay.setMap(null);
  //           }

  //           var Locn = {lat: marker.getPosition().J, lng: marker.getPosition().M};
  //               console.log(Locn + ' ' + connectionId);

  //               calcRoute(mapObject, Session.get('currentLoc') , Locn);

  //               Connections.update({_id: connectionId},
  //                 {$set: {meetupLocation: Session.get('newLocation').address,
  //                 meetupLatLong: Session.get('newLocation').latLong}});

  //                 meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
  //                 console.log('meetingCoordinates: ' + JSON.stringify(meetingCoordinates));

  //         }, 500);
  //       });

  //calcRoute(mapObject, Session.get('currentLoc') , Session.get('initialLoc'));
}

Template.map.events({
  // 'click button': function() {
  //   $("#map-search").trigger("geocode");
  // },
  'click #update-map-location': function() {
    connectionId = this.connectionId;
    console.log('Done Clicked!');
    console.log(connectionId);
    if (Session.get('newLocation')) {
      Connections.update({_id: connectionId}, {$set: {meetupLocation: Session.get('newLocation').address, meetupLatLong: Session.get('newLocation').latLong}});
    }
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
        reverseGeocode.getLocation(result.L, result.M, function(location){
          Session.set('newLocation', {
            address: reverseGeocode.getAddrStr(),
            latLong: result
          });
        });
      });
    }
  }


});

var connectionId;
Template.mapChat.events({
  'click button': function() {
    $("#mapchat-search").trigger("geocode");
  },
  'click #updateMeetup': function() {
    connectionId = this.connectionId;
    console.log('Done Clicked!');
    console.log(connectionId);
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
      currentTakerLoc = {lat: this.L, lng: this.M};
      console.log('H/L');
      console.log(this.meetupLatLong);

      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(this.L, this.M),
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
  var image = 'icons/icon-current-location.png';
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
    'icons/icon-current-location.png',
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
  //directionsDisplay.setMap(null);
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  directionsDisplay.setMap(map);

  // if(marker)
  // {
  //   marker.setMap(null);
  // }

  // for (i = 0; i < markerArray.length; i++) {
  //   markerArray[i].setMap(null);
  // }

  // getIcons();

  var markerArray = [];
  var myRoute;
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(result, status)
  {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
      myRoute = result.routes[ 0 ].legs[ 0 ];
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
  title: title
 });
}
