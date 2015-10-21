(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/emailverification.js                                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
(function () {                                                         // 1
    "use strict";                                                      // 2
                                                                       //
    Accounts.urls.resetPassword = function (token) {                   // 4
        return Meteor.absoluteUrl('reset-password/' + token);          // 5
    };                                                                 //
                                                                       //
    Accounts.urls.verifyEmail = function (token) {                     // 8
        return Meteor.absoluteUrl('verify-email/' + token);            // 9
    };                                                                 //
                                                                       //
    Accounts.urls.enrollAccount = function (token) {                   // 12
        return Meteor.absoluteUrl('enroll-account/' + token);          // 13
    };                                                                 //
})();                                                                  //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=emailverification.js.map
