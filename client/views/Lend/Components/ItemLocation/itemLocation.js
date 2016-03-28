
Template.itemLocation.rendered = function() {
    getCurrentLocation();
}

Template.itemLocation.destroyed = function() {
    Session.set('view', null);
};

Template.itemLocation.events({
    'change .toggle-location input[type=checkbox]': function(e) {
        if(!e.currentTarget.checked) {
            Session.set('view', false);
            IonModal.open('itemLocationMap');
            $('.locationSwitch').text('NEW LOCATION')
        } else {
            getCurrentLocation();
            $('.locationSwitch').text('DEFAULT LOCATION')
        }
    },

    'click .locationSwitch': function(e, template) {
        if($('.locationSwitch').text() === 'DEFAULT LOCATION') {
            Session.set('view', true);
        }
        IonModal.open('itemLocationMap');
    }
});

var currentLocation;

function getCurrentLocation() {

    if(currentLocation) {
        Session.set('location', currentLocation);
    }
    else {
        checkUserLocation(function(location){
            Session.set('location', location);
            currentLocation = location;
        });
    }
}
