
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

function getCurrentLocation() {

    var user = Meteor.user();

    if(user && user.profile.location) {
        Session.set('location', user.profile.location);
    }
    else {
        checkUserLocation(function(location){
            location.point = [location.lat, location.lng];
            Session.set('location', location);

            var updatedProfile = {
                location: location
            }
            
            Meteor.call("updateUserProfile", updatedProfile, function(err, res) {

                if(err) {
                    var errorMessage = err.reason || err.message;
                    if(err.details) {
                        errorMessage = errorMessage + "\nDetails:\n" + err.details;
                    }
                    sAlert.error(errorMessage);
                    return;
                }
            });

        });
    }
}
