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
