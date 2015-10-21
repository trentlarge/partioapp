(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var Facebook = Package.facebook.Facebook;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var _ = Package.underscore._;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/mrt_accounts-facebook-cordova/packages/mrt_accounts-facebook-cordova.js                          //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
(function () {                                                                                               // 1
                                                                                                             // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////    // 3
//                                                                                                     //    // 4
// packages/mrt:accounts-facebook-cordova/facebook_server.js                                           //    // 5
//                                                                                                     //    // 6
/////////////////////////////////////////////////////////////////////////////////////////////////////////    // 7
                                                                                                       //    // 8
Accounts.registerLoginHandler(function(loginRequest) {                                                 // 1  // 9
  if(!loginRequest.cordova) {                                                                          // 2  // 10
    return undefined;                                                                                  // 3  // 11
  }                                                                                                    // 4  // 12
                                                                                                       // 5  // 13
  loginRequest = loginRequest.authResponse;                                                            // 6  // 14
  var identity = getIdentity(loginRequest.accessToken);                                                // 7  // 15
  var profilePicture = getProfilePicture(loginRequest.accessToken);                                    // 8  // 16
                                                                                                       // 9  // 17
  console.log(profilePicture);                                                                         // 10
                                                                                                       // 11
  var serviceData = {                                                                                  // 12
    accessToken: loginRequest.accessToken,                                                             // 13
    expiresAt: (+new Date) + (1000 * loginRequest.expiresIn)                                           // 14
  };                                                                                                   // 15
                                                                                                       // 16
  var whitelisted = ['id', 'email', 'name', 'first_name',                                              // 17
      'last_name', 'link', 'username', 'gender', 'locale', 'age_range'];                               // 18
                                                                                                       // 19
  var fields = _.pick(identity, whitelisted);                                                          // 20
  _.extend(serviceData, fields);                                                                       // 21
                                                                                                       // 22
  var options = {profile: {}};                                                                         // 23
  var profileFields = _.pick(identity, Meteor.settings.public.facebook.profileFields);                 // 24
  _.extend(options.profile, profileFields);                                                            // 25
                                                                                                       // 26
  options.profile.avatar = profilePicture;                                                             // 27
                                                                                                       // 28
  return Accounts.updateOrCreateUserFromExternalService("facebook", serviceData, options);             // 29
                                                                                                       // 30
});                                                                                                    // 31
                                                                                                       // 32
var getIdentity = function (accessToken) {                                                             // 33
  try {                                                                                                // 34
    return HTTP.get("https://graph.facebook.com/me", {                                                 // 35
      params: {access_token: accessToken}}).data;                                                      // 36
  } catch (err) {                                                                                      // 37
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),                // 38
                   {response: err.response});                                                          // 39
  }                                                                                                    // 40
};                                                                                                     // 41
                                                                                                       // 42
var getProfilePicture = function (accessToken) {                                                       // 43
  try {                                                                                                // 44
    return HTTP.get("https://graph.facebook.com/v2.0/me/picture/?redirect=false", {                    // 45
      params: {access_token: accessToken}}).data.data.url;                                             // 46
  } catch (err) {                                                                                      // 47
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),                // 48
                   {response: err.response});                                                          // 49
  }                                                                                                    // 50
};                                                                                                     // 51
/////////////////////////////////////////////////////////////////////////////////////////////////////////    // 60
                                                                                                             // 61
}).call(this);                                                                                               // 62
                                                                                                             // 63
                                                                                                             // 64
                                                                                                             // 65
                                                                                                             // 66
                                                                                                             // 67
                                                                                                             // 68
(function () {                                                                                               // 69
                                                                                                             // 70
/////////////////////////////////////////////////////////////////////////////////////////////////////////    // 71
//                                                                                                     //    // 72
// packages/mrt:accounts-facebook-cordova/facebook.js                                                  //    // 73
//                                                                                                     //    // 74
/////////////////////////////////////////////////////////////////////////////////////////////////////////    // 75
                                                                                                       //    // 76
Accounts.oauth.registerService('facebook');                                                            // 1  // 77
                                                                                                       // 2  // 78
if (Meteor.isClient) {                                                                                 // 3  // 79
                                                                                                       // 4  // 80
  Meteor.loginWithFacebook = function(options, callback) {                                             // 5  // 81
    // support a callback without options                                                              // 6  // 82
    if (! callback && typeof options === "function") {                                                 // 7  // 83
      callback = options;                                                                              // 8  // 84
      options = null;                                                                                  // 9  // 85
    }                                                                                                  // 10
                                                                                                       // 11
    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback); // 12
                                                                                                       // 13
    var fbLoginSuccess = function (data) {                                                             // 14
      data.cordova = true;                                                                             // 15
                                                                                                       // 16
      Accounts.callLoginMethod({                                                                       // 17
        methodArguments: [data],                                                                       // 18
        userCallback: callback                                                                         // 19
      });                                                                                              // 20
    }                                                                                                  // 21
                                                                                                       // 22
    if (typeof facebookConnectPlugin != "undefined" && Meteor.settings) {                              // 23
      facebookConnectPlugin.getLoginStatus(                                                            // 24
        function (response) {                                                                          // 25
          if (response.status != "connected") {                                                        // 26
            facebookConnectPlugin.login(Meteor.settings.public.facebook.permissions,                   // 27
                fbLoginSuccess,                                                                        // 28
                function (error) { console.log("" + error) }                                           // 29
            );                                                                                         // 30
          } else {                                                                                     // 31
            fbLoginSuccess(response);                                                                  // 32
          }                                                                                            // 33
        },                                                                                             // 34
        function (error) { console.log("" + error) }                                                   // 35
      );                                                                                               // 36
    } else {                                                                                           // 37
      Facebook.requestCredential(options, credentialRequestCompleteCallback);                          // 38
    }                                                                                                  // 39
  };                                                                                                   // 40
                                                                                                       // 41
} else {                                                                                               // 42
                                                                                                       // 43
  if (Meteor.settings &&                                                                               // 44
      Meteor.settings.facebook &&                                                                      // 45
      Meteor.settings.facebook.appId &&                                                                // 46
      Meteor.settings.facebook.secret) {                                                               // 47
                                                                                                       // 48
    ServiceConfiguration.configurations.remove({                                                       // 49
      service: "facebook"                                                                              // 50
    });                                                                                                // 51
                                                                                                       // 52
    ServiceConfiguration.configurations.insert({                                                       // 53
      service: "facebook",                                                                             // 54
      appId: Meteor.settings.facebook.appId,                                                           // 55
      secret: Meteor.settings.facebook.secret                                                          // 56
    });                                                                                                // 57
                                                                                                       // 58
    Accounts.addAutopublishFields({                                                                    // 59
      // publish all fields including access token, which can legitimately                             // 60
      // be used from the client (if transmitted over ssl or on                                        // 61
      // localhost). https://developers.facebook.com/docs/concepts/login/access-tokens-and-types/,     // 62
      // "Sharing of Access Tokens"                                                                    // 63
      forLoggedInUser: ['services.facebook'],                                                          // 64
      forOtherUsers: [                                                                                 // 65
        // https://www.facebook.com/help/167709519956542                                               // 66
        'services.facebook.id', 'services.facebook.username', 'services.facebook.gender'               // 67
      ]                                                                                                // 68
    });                                                                                                // 69
                                                                                                       // 70
  } else {                                                                                             // 71
    console.log("Meteor settings for accounts-facebook-cordova not configured correctly.")             // 72
  }                                                                                                    // 73
}                                                                                                      // 74
                                                                                                       // 75
/////////////////////////////////////////////////////////////////////////////////////////////////////////    // 152
                                                                                                             // 153
}).call(this);                                                                                               // 154
                                                                                                             // 155
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mrt:accounts-facebook-cordova'] = {};

})();

//# sourceMappingURL=mrt_accounts-facebook-cordova.js.map
