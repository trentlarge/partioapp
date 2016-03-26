Template.itemLocation.rendered = function() {
  getCurrentLocation();
}

Template.itemLocation.events({
  'change .toggle-location input[type=checkbox]': function(e) {
    if(!e.currentTarget.checked) {
      var coords = {
          lat: $('input[name=item_lat]').val(),
          lng: $('input[name=item_lng]').val()
      }

      IonModal.open('itemLocationMap', coords);
      $('.locationSwitch').text('NO')
    } else {
    	getCurrentLocation();
      $('.locationSwitch').text('YES')
    }
  },
});

function getCurrentLocation() {
  checkUserLocation(function(result){
    $('input[name=item_lat]').val(result.lat);
    $('input[name=item_lng]').val(result.long);
  });
}
