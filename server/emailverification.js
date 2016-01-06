(function () {
    "use strict";

    Accounts.urls.resetPassword = function (token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    };

    Accounts.urls.verifyEmail = function (token) {
        if(Meteor.settings.env.partioSite) {
            return Meteor.settings.env.partioSite+'verify-email/'+ token; 
        } else {
            return Meteor.absoluteUrl('verify-email/' + token); 
        }   
    };

    Accounts.urls.enrollAccount = function (token) {
        return Meteor.absoluteUrl('enroll-account/' + token);
    };

})();
