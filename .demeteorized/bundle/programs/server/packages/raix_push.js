(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var EventState = Package['raix:eventstate'].EventState;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var Push, _matchToken, checkClientSecurity, _replaceToken, _removeToken;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/raix_push/packages/raix_push.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
(function () {                                                                                                        // 1
                                                                                                                      // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                                             //     // 4
// packages/raix:push/lib/common/main.js                                                                       //     // 5
//                                                                                                             //     // 6
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                                               //     // 8
// The push object is an event emitter                                                                         // 1   // 9
Push = new EventState();                                                                                       // 2   // 10
                                                                                                               // 3   // 11
// This is the match pattern for tokens                                                                        // 4   // 12
_matchToken = Match.OneOf({ apn: String }, { gcm: String });                                                   // 5   // 13
                                                                                                               // 6   // 14
                                                                                                               // 7   // 15
// Client-side security warnings, used to check options                                                        // 8   // 16
checkClientSecurity = function(options) {                                                                      // 9   // 17
                                                                                                               // 10  // 18
  // Warn if certificates or keys are added here on client. We dont allow the                                  // 11  // 19
  // user to do this for security reasons.                                                                     // 12  // 20
  if (options.apn && options.apn.certData)                                                                     // 13  // 21
    throw new Error('Push.init: Dont add your APN certificate in client code!');                               // 14  // 22
                                                                                                               // 15  // 23
  if (options.apn && options.apn.keyData)                                                                      // 16  // 24
    throw new Error('Push.init: Dont add your APN key in client code!');                                       // 17  // 25
                                                                                                               // 18  // 26
  if (options.apn && options.apn.passphrase)                                                                   // 19  // 27
    throw new Error('Push.init: Dont add your APN passphrase in client code!');                                // 20  // 28
                                                                                                               // 21  // 29
  if (options.gcm && options.gcm.apiKey)                                                                       // 22  // 30
    throw new Error('Push.init: Dont add your GCM api key in client code!');                                   // 23  // 31
};                                                                                                             // 24  // 32
                                                                                                               // 25  // 33
// DEPRECATED                                                                                                  // 26  // 34
Push.init = function() {                                                                                       // 27  // 35
  console.warn('Push.init have been deprecated in favor of "config.push.json" please migrate');                // 28  // 36
};                                                                                                             // 29  // 37
                                                                                                               // 30  // 38
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 39
                                                                                                                      // 40
}).call(this);                                                                                                        // 41
                                                                                                                      // 42
                                                                                                                      // 43
                                                                                                                      // 44
                                                                                                                      // 45
                                                                                                                      // 46
                                                                                                                      // 47
(function () {                                                                                                        // 48
                                                                                                                      // 49
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 50
//                                                                                                             //     // 51
// packages/raix:push/lib/common/notifications.js                                                              //     // 52
//                                                                                                             //     // 53
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 54
                                                                                                               //     // 55
// Notifications collection                                                                                    // 1   // 56
Push.notifications = new Mongo.Collection('_raix_push_notifications');                                         // 2   // 57
                                                                                                               // 3   // 58
if (Meteor.isServer) {                                                                                         // 4   // 59
  Push.notifications._ensureIndex({createdAt: 1});                                                             // 5   // 60
}                                                                                                              // 6   // 61
                                                                                                               // 7   // 62
// This is a general function to validate that the data added to notifications                                 // 8   // 63
// is in the correct format. If not this function will throw errors                                            // 9   // 64
var _validateDocument = function(notification) {                                                               // 10  // 65
                                                                                                               // 11  // 66
  // Check the general notification                                                                            // 12  // 67
  check(notification, {                                                                                        // 13  // 68
    from: String,                                                                                              // 14  // 69
    title: String,                                                                                             // 15  // 70
    text: String,                                                                                              // 16  // 71
    badge: Match.Optional(Number),                                                                             // 17  // 72
    sound: Match.Optional(String),                                                                             // 18  // 73
    notId: Match.Optional(Match.Integer),                                                                      // 19  // 74
    query: Match.Optional(String),                                                                             // 20  // 75
    token: Match.Optional(_matchToken),                                                                        // 21  // 76
    tokens: Match.Optional([_matchToken]),                                                                     // 22  // 77
    payload: Match.Optional(Object),                                                                           // 23  // 78
    delayUntil: Match.Optional(Date),                                                                          // 24  // 79
    createdAt: Date,                                                                                           // 25  // 80
    createdBy: Match.OneOf(String, null)                                                                       // 26  // 81
  });                                                                                                          // 27  // 82
                                                                                                               // 28  // 83
  // Make sure a token selector or query have been set                                                         // 29  // 84
  if (!notification.token && !notification.tokens && !notification.query)                                      // 30  // 85
    throw new Error('No token selector or query found');                                                       // 31  // 86
                                                                                                               // 32  // 87
  // If tokens array is set it should not be empty                                                             // 33  // 88
  if (notification.tokens && !notification.tokens.length)                                                      // 34  // 89
    throw new Error('No tokens in array');                                                                     // 35  // 90
};                                                                                                             // 36  // 91
                                                                                                               // 37  // 92
Push.send = function(options) {                                                                                // 38  // 93
  // If on the client we set the user id - on the server we need an option                                     // 39  // 94
  // set or we default to "<SERVER>" as the creator of the notification                                        // 40  // 95
  // If current user not set see if we can set it to the logged in user                                        // 41  // 96
  // this will only run on the client if Meteor.userId is available                                            // 42  // 97
  var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() ||                                     // 43  // 98
          Meteor.isServer && (options.createdBy || '<SERVER>') || null;                                        // 44  // 99
                                                                                                               // 45  // 100
  // Rig the notification object                                                                               // 46  // 101
  var notification = {                                                                                         // 47  // 102
    from: options.from,                                                                                        // 48  // 103
    title: options.title,                                                                                      // 49  // 104
    text: options.text,                                                                                        // 50  // 105
    createdAt: new Date(),                                                                                     // 51  // 106
    createdBy: currentUser                                                                                     // 52  // 107
  };                                                                                                           // 53  // 108
                                                                                                               // 54  // 109
  // Add extra                                                                                                 // 55  // 110
  if (typeof options.payload !== 'undefined') notification.payload = options.payload;                          // 56  // 111
  if (typeof options.badge !== 'undefined') notification.badge = options.badge;                                // 57  // 112
  if (typeof options.sound !== 'undefined') notification.sound = options.sound;                                // 58  // 113
  if (typeof options.notId !== 'undefined') notification.notId = options.notId;                                // 59  // 114
  if (typeof options.delayUntil !== 'undefined') notification.delayUntil = options.delayUntil;                 // 60  // 115
                                                                                                               // 61  // 116
  // Set one token selector, this can be token, array of tokens or query                                       // 62  // 117
  if (options.query) {                                                                                         // 63  // 118
    // Set query to the json string version fixing #43 and #39                                                 // 64  // 119
    notification.query = JSON.stringify(options.query);                                                        // 65  // 120
  } else if (options.token) {                                                                                  // 66  // 121
    // Set token                                                                                               // 67  // 122
    notification.token = options.token;                                                                        // 68  // 123
  } else if (options.tokens) {                                                                                 // 69  // 124
    // Set tokens                                                                                              // 70  // 125
    notification.tokens = options.tokens;                                                                      // 71  // 126
  }                                                                                                            // 72  // 127
                                                                                                               // 73  // 128
  // Validate the notification                                                                                 // 74  // 129
  _validateDocument(notification);                                                                             // 75  // 130
                                                                                                               // 76  // 131
  // Try to add the notification to send, we return an id to keep track                                        // 77  // 132
  return Push.notifications.insert(notification);                                                              // 78  // 133
};                                                                                                             // 79  // 134
                                                                                                               // 80  // 135
Push.allow = function(rules) {                                                                                 // 81  // 136
  if (rules.send) {                                                                                            // 82  // 137
    Push.notifications.allow({                                                                                 // 83  // 138
      'insert': function(userId, notification) {                                                               // 84  // 139
        // Validate the notification                                                                           // 85  // 140
        _validateDocument(notification);                                                                       // 86  // 141
        // Set the user defined "send" rules                                                                   // 87  // 142
        return rules.send.apply(this, [userId, notification]);                                                 // 88  // 143
      }                                                                                                        // 89  // 144
    });                                                                                                        // 90  // 145
  }                                                                                                            // 91  // 146
};                                                                                                             // 92  // 147
                                                                                                               // 93  // 148
Push.deny = function(rules) {                                                                                  // 94  // 149
  if (rules.send) {                                                                                            // 95  // 150
    Push.notifications.deny({                                                                                  // 96  // 151
      'insert': function(userId, notification) {                                                               // 97  // 152
        // Validate the notification                                                                           // 98  // 153
        _validateDocument(notification);                                                                       // 99  // 154
        // Set the user defined "send" rules                                                                   // 100
        return rules.send.apply(this, [userId, notification]);                                                 // 101
      }                                                                                                        // 102
    });                                                                                                        // 103
  }                                                                                                            // 104
};                                                                                                             // 105
                                                                                                               // 106
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 162
                                                                                                                      // 163
}).call(this);                                                                                                        // 164
                                                                                                                      // 165
                                                                                                                      // 166
                                                                                                                      // 167
                                                                                                                      // 168
                                                                                                                      // 169
                                                                                                                      // 170
(function () {                                                                                                        // 171
                                                                                                                      // 172
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 173
//                                                                                                             //     // 174
// packages/raix:push/lib/server/push.api.js                                                                   //     // 175
//                                                                                                             //     // 176
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 177
                                                                                                               //     // 178
/*                                                                                                             // 1   // 179
  A general purpose user CordovaPush                                                                           // 2   // 180
  ios, android, mail, twitter?, facebook?, sms?, snailMail? :)                                                 // 3   // 181
                                                                                                               // 4   // 182
  Phonegap generic :                                                                                           // 5   // 183
  https://github.com/phonegap-build/PushPlugin                                                                 // 6   // 184
 */                                                                                                            // 7   // 185
                                                                                                               // 8   // 186
// getText / getBinary                                                                                         // 9   // 187
                                                                                                               // 10  // 188
Push.setBadge = function(id, count) {                                                                          // 11  // 189
    // throw new Error('Push.setBadge not implemented on the server');                                         // 12  // 190
};                                                                                                             // 13  // 191
                                                                                                               // 14  // 192
var isConfigured = false;                                                                                      // 15  // 193
                                                                                                               // 16  // 194
Push.Configure = function(options) {                                                                           // 17  // 195
    var self = this;                                                                                           // 18  // 196
    // https://npmjs.org/package/apn                                                                           // 19  // 197
                                                                                                               // 20  // 198
    // After requesting the certificate from Apple, export your private key as a .p12 file and download the .cer file from the iOS Provisioning Portal.
                                                                                                               // 22  // 200
    // gateway.push.apple.com, port 2195                                                                       // 23  // 201
    // gateway.sandbox.push.apple.com, port 2195                                                               // 24  // 202
                                                                                                               // 25  // 203
    // Now, in the directory containing cert.cer and key.p12 execute the following commands to generate your .pem files:
    // $ openssl x509 -in cert.cer -inform DER -outform PEM -out cert.pem                                      // 27  // 205
    // $ openssl pkcs12 -in key.p12 -out key.pem -nodes                                                        // 28  // 206
                                                                                                               // 29  // 207
    // Block multiple calls                                                                                    // 30  // 208
    if (isConfigured)                                                                                          // 31  // 209
      throw new Error('Push.Configure should not be called more than once!');                                  // 32  // 210
                                                                                                               // 33  // 211
    isConfigured = true;                                                                                       // 34  // 212
                                                                                                               // 35  // 213
    // Add debug info                                                                                          // 36  // 214
    if (Push.debug) console.log('Push.Configure', options);                                                    // 37  // 215
                                                                                                               // 38  // 216
    // This function is called when a token is replaced on a device - normally                                 // 39  // 217
    // this should not happen, but if it does we should take action on it                                      // 40  // 218
    _replaceToken = function(currentToken, newToken) {                                                         // 41  // 219
        // console.log('Replace token: ' + currentToken + ' -- ' + newToken);                                  // 42  // 220
        // If the server gets a token event its passing in the current token and                               // 43  // 221
        // the new value - if new value is undefined this empty the token                                      // 44  // 222
        self.emitState('token', currentToken, newToken);                                                       // 45  // 223
    };                                                                                                         // 46  // 224
                                                                                                               // 47  // 225
    // Rig the removeToken callback                                                                            // 48  // 226
    _removeToken = function(token) {                                                                           // 49  // 227
        // console.log('Remove token: ' + token);                                                              // 50  // 228
        // Invalidate the token                                                                                // 51  // 229
        self.emitState('token', token, null);                                                                  // 52  // 230
    };                                                                                                         // 53  // 231
                                                                                                               // 54  // 232
                                                                                                               // 55  // 233
    if (options.apn) {                                                                                         // 56  // 234
        if (Push.debug) console.log('Push: APN configured');                                                   // 57  // 235
                                                                                                               // 58  // 236
        // Allow production to be a general option for push notifications                                      // 59  // 237
        if (options.production === !!options.production)                                                       // 60  // 238
          options.apn.production = options.production;                                                         // 61  // 239
                                                                                                               // 62  // 240
        // Give the user warnings about development settings                                                   // 63  // 241
        if (options.apn.development) {                                                                         // 64  // 242
          // This flag is normally set by the configuration file                                               // 65  // 243
          console.warn('WARNING: Push APN is using development key and certificate');                          // 66  // 244
        } else {                                                                                               // 67  // 245
          // We check the apn gateway i the options, we could risk shipping                                    // 68  // 246
          // server into production while using the production configuration.                                  // 69  // 247
          // On the other hand we could be in development but using the production                             // 70  // 248
          // configuration. And finally we could have configured an unknown apn                                // 71  // 249
          // gateway (this could change in the future - but a warning about typos                              // 72  // 250
          // can save hours of debugging)                                                                      // 73  // 251
          //                                                                                                   // 74  // 252
          // Warn about gateway configurations - it's more a guide                                             // 75  // 253
          if (options.apn.gateway) {                                                                           // 76  // 254
                                                                                                               // 77  // 255
              if (options.apn.gateway == 'gateway.sandbox.push.apple.com') {                                   // 78  // 256
                  // Using the development sandbox                                                             // 79  // 257
                  console.warn('WARNING: Push APN is in development mode');                                    // 80  // 258
              } else if (options.apn.gateway == 'gateway.push.apple.com') {                                    // 81  // 259
                  // In production - but warn if we are running on localhost                                   // 82  // 260
                  if (/http:\/\/localhost/.test(Meteor.absoluteUrl())) {                                       // 83  // 261
                      console.warn('WARNING: Push APN is configured to production mode - but server is running from localhost');
                  }                                                                                            // 85  // 263
              } else {                                                                                         // 86  // 264
                  // Warn about gateways we dont know about                                                    // 87  // 265
                  console.warn('WARNING: Push APN unkown gateway "' + options.apn.gateway + '"');              // 88  // 266
              }                                                                                                // 89  // 267
                                                                                                               // 90  // 268
          } else {                                                                                             // 91  // 269
              if (options.apn.production) {                                                                    // 92  // 270
                  if (/http:\/\/localhost/.test(Meteor.absoluteUrl())) {                                       // 93  // 271
                      console.warn('WARNING: Push APN is configured to production mode - but server is running from localhost');
                  }                                                                                            // 95  // 273
              } else {                                                                                         // 96  // 274
                  console.warn('WARNING: Push APN is in development mode');                                    // 97  // 275
              }                                                                                                // 98  // 276
          }                                                                                                    // 99  // 277
                                                                                                               // 100
        }                                                                                                      // 101
                                                                                                               // 102
        // Check certificate data                                                                              // 103
        if (!options.apn['certData'] || !options.apn['certData'].length)                                       // 104
            console.error('ERROR: Push server could not find certData');                                       // 105
                                                                                                               // 106
        // Check key data                                                                                      // 107
        if (!options.apn['keyData'] || !options.apn['keyData'].length)                                         // 108
            console.error('ERROR: Push server could not find keyData');                                        // 109
                                                                                                               // 110
        // Rig apn connection                                                                                  // 111
        var apn = Npm.require('apn');                                                                          // 112
        var apnConnection = new apn.Connection( options.apn );                                                 // 113
                                                                                                               // 114
                                                                                                               // 115
        // XXX: should we do a test of the connection? It would be nice to know                                // 116
        // That the server/certificates/network are correct configured                                         // 117
                                                                                                               // 118
        // apnConnection.connect().then(function() {                                                           // 119
        //     console.info('CHECK: Push APN connection OK');                                                  // 120
        // }, function(err) {                                                                                  // 121
        //     console.warn('CHECK: Push APN connection FAILURE');                                             // 122
        // });                                                                                                 // 123
        // Note: the above code spoils the connection - investigate how to                                     // 124
        // shutdown/close it.                                                                                  // 125
                                                                                                               // 126
        self.sendAPN = function(userToken, notification) {                                                     // 127
            // console.log('sendAPN', notification.from, userToken, notification.title, notification.text, notification.badge, notification.priority);
            var priority = (notification.priority || notification.priority === 0)? notification.priority : 10; // 129
                                                                                                               // 130
            var myDevice = new apn.Device(userToken);                                                          // 131
                                                                                                               // 132
            var note = new apn.Notification();                                                                 // 133
                                                                                                               // 134
            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.                    // 135
            if (typeof notification.badge !== 'undefined') note.badge = notification.badge;                    // 136
            if (typeof notification.sound !== 'undefined') note.sound = notification.sound;                    // 137
                                                                                                               // 138
            // adds category support for iOS8 custom actions as described here:                                // 139
            // https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/IPhoneOSClientImp.html#//apple_ref/doc/uid/TP40008194-CH103-SW36
            if (typeof notification.category !== 'undefined') note.category = notification.category;           // 141
                                                                                                               // 142
            note.alert = notification.text;                                                                    // 143
            // Allow the user to set payload data                                                              // 144
            note.payload = (notification.payload) ? { ejson: EJSON.stringify(notification.payload) } : {};     // 145
                                                                                                               // 146
            note.payload.messageFrom = notification.from;                                                      // 147
            note.priority = priority;                                                                          // 148
                                                                                                               // 149
            // console.log('I:Send message to: ' + userToken + ' count=' + count);                             // 150
                                                                                                               // 151
            apnConnection.pushNotification(note, myDevice);                                                    // 152
                                                                                                               // 153
        };                                                                                                     // 154
                                                                                                               // 155
                                                                                                               // 156
        var initFeedback = function() {                                                                        // 157
            var apn = Npm.require('apn');                                                                      // 158
            // console.log('Init feedback');                                                                   // 159
            var feedbackOptions = {                                                                            // 160
                "batchFeedback": true,                                                                         // 161
                "interval": 1000,                                                                              // 162
                'address': 'feedback.push.apple.com'                                                           // 163
            };                                                                                                 // 164
                                                                                                               // 165
            var feedback = new apn.Feedback(feedbackOptions);                                                  // 166
            feedback.on("feedback", function(devices) {                                                        // 167
                devices.forEach(function(item) {                                                               // 168
                    // Do something with item.device and item.time;                                            // 169
                    // console.log('A:PUSH FEEDBACK ' + item.device + ' - ' + item.time);                      // 170
                    // The app is most likely removed from the device, we should                               // 171
                    // remove the token                                                                        // 172
                    _removeToken({ apn: item.device});                                                         // 173
                });                                                                                            // 174
            });                                                                                                // 175
        };                                                                                                     // 176
                                                                                                               // 177
        // Init feedback from apn server                                                                       // 178
        // This will help keep the appCollection up-to-date, it will help update                               // 179
        // and remove token from appCollection.                                                                // 180
        initFeedback();                                                                                        // 181
                                                                                                               // 182
    } // EO ios notification                                                                                   // 183
                                                                                                               // 184
    if (options.gcm && options.gcm.apiKey) {                                                                   // 185
        if (Push.debug) console.log('GCM configured');                                                         // 186
        //self.sendGCM = function(options.from, userTokens, options.title, options.text, options.badge, options.priority) {
        self.sendGCM = function(userTokens, notification) {                                                    // 188
            // Make sure userTokens are an array of strings                                                    // 189
            if (userTokens === ''+userTokens) userTokens = [userTokens];                                       // 190
                                                                                                               // 191
            // Check if any tokens in there to send                                                            // 192
            if (!userTokens.length) {                                                                          // 193
                if (Push.debug) console.log('sendGCM no push tokens found');                                   // 194
                return;                                                                                        // 195
            }                                                                                                  // 196
                                                                                                               // 197
            if (Push.debug) console.log('sendGCM', userTokens, notification);                                  // 198
                                                                                                               // 199
            var gcm = Npm.require('node-gcm');                                                                 // 200
            var Fiber = Npm.require('fibers');                                                                 // 201
                                                                                                               // 202
            // Allow user to set payload                                                                       // 203
            var data = (notification.payload) ? { ejson: EJSON.stringify(notification.payload) } : {};         // 204
                                                                                                               // 205
            data.title = notification.title;                                                                   // 206
            data.message = notification.text;                                                                  // 207
                                                                                                               // 208
            // Set extra details                                                                               // 209
            if (typeof notification.badge !== 'undefined') data.msgcnt = notification.badge;                   // 210
            if (typeof notification.sound !== 'undefined') data.soundname = notification.sound;                // 211
            if (typeof notification.notId !== 'undefined') data.notId = notification.notId;                    // 212
                                                                                                               // 213
            //var message = new gcm.Message();                                                                 // 214
            var message = new gcm.Message({                                                                    // 215
                collapseKey: notification.from,                                                                // 216
            //    delayWhileIdle: true,                                                                        // 217
            //    timeToLive: 4,                                                                               // 218
            //    restricted_package_name: 'dk.gi2.app'                                                        // 219
                data: data                                                                                     // 220
            });                                                                                                // 221
                                                                                                               // 222
            if (Push.debug) console.log('Create GCM Sender using "' + options.gcm.apiKey + '"');               // 223
            var sender = new gcm.Sender(options.gcm.apiKey);                                                   // 224
                                                                                                               // 225
            _.each(userTokens, function(value, key) {                                                          // 226
                if (Push.debug) console.log('A:Send message to: ' + value);                                    // 227
            });                                                                                                // 228
                                                                                                               // 229
            /*message.addData('title', title);                                                                 // 230
            message.addData('message', text);                                                                  // 231
            message.addData('msgcnt', '1');                                                                    // 232
            message.collapseKey = 'sitDrift';                                                                  // 233
            message.delayWhileIdle = true;                                                                     // 234
            message.timeToLive = 3;*/                                                                          // 235
                                                                                                               // 236
            // /**                                                                                             // 237
            //  * Parameters: message-literal, userTokens-array, No. of retries, callback-function             // 238
            //  */                                                                                             // 239
                                                                                                               // 240
            var userToken = (userTokens.length === 1)?userTokens[0]:null;                                      // 241
                                                                                                               // 242
            sender.send(message, userTokens, 5, function (err, result) {                                       // 243
                if (err) {                                                                                     // 244
                    if (Push.debug) console.log('ANDROID ERROR: result of sender: ' + result);                 // 245
                } else {                                                                                       // 246
                    if (result == null) {                                                                      // 247
                      if (Push.debug) console.log('ANDROID: Result of sender is null');                        // 248
                      return;                                                                                  // 249
                    }                                                                                          // 250
                    if (Push.debug) console.log('ANDROID: Result of sender: ' + JSON.stringify(result));       // 251
                    if (result.canonical_ids === 1 && userToken) {                                             // 252
                                                                                                               // 253
                        // This is an old device, token is replaced                                            // 254
                        Fiber(function(self) {                                                                 // 255
                            // Run in fiber                                                                    // 256
                            try {                                                                              // 257
                                self.callback(self.oldToken, self.newToken);                                   // 258
                            } catch(err) {                                                                     // 259
                                                                                                               // 260
                            }                                                                                  // 261
                                                                                                               // 262
                        }).run({                                                                               // 263
                            oldToken: { gcm: userToken },                                                      // 264
                            newToken: { gcm: result.results[0].registration_id },                              // 265
                            callback: _replaceToken                                                            // 266
                        });                                                                                    // 267
                        //_replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });       // 268
                                                                                                               // 269
                    }                                                                                          // 270
                    // We cant send to that token - might not be registred                                     // 271
                    // ask the user to remove the token from the list                                          // 272
                    if (result.failure !== 0 && userToken) {                                                   // 273
                                                                                                               // 274
                        // This is an old device, token is replaced                                            // 275
                        Fiber(function(self) {                                                                 // 276
                            // Run in fiber                                                                    // 277
                            try {                                                                              // 278
                                self.callback(self.token);                                                     // 279
                            } catch(err) {                                                                     // 280
                                                                                                               // 281
                            }                                                                                  // 282
                                                                                                               // 283
                        }).run({                                                                               // 284
                            token: { gcm: userToken },                                                         // 285
                            callback: _removeToken                                                             // 286
                        });                                                                                    // 287
                        //_replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });       // 288
                                                                                                               // 289
                    }                                                                                          // 290
                                                                                                               // 291
                }                                                                                              // 292
            });                                                                                                // 293
            // /** Use the following line if you want to send the message without retries                      // 294
            // sender.sendNoRetry(message, userTokens, function (result) {                                     // 295
            //     console.log('ANDROID: ' + JSON.stringify(result));                                          // 296
            // });                                                                                             // 297
            // **/                                                                                             // 298
        }; // EO sendAndroid                                                                                   // 299
                                                                                                               // 300
    } // EO Android                                                                                            // 301
                                                                                                               // 302
    // Universal send function                                                                                 // 303
    var _querySend = function(query, options) {                                                                // 304
                                                                                                               // 305
      var countApn = [];                                                                                       // 306
      var countGcm = [];                                                                                       // 307
                                                                                                               // 308
        Push.appCollection.find(query).forEach(function(app) {                                                 // 309
                                                                                                               // 310
          if (Push.debug) console.log('send to token', app.token);                                             // 311
                                                                                                               // 312
            if (app.token.apn) {                                                                               // 313
              countApn.push(app._id);                                                                          // 314
                // Send to APN                                                                                 // 315
                if (self.sendAPN) self.sendAPN(app.token.apn, options);                                        // 316
                                                                                                               // 317
            } else if (app.token.gcm) {                                                                        // 318
              countGcm.push(app._id);                                                                          // 319
                                                                                                               // 320
                // Send to GCM                                                                                 // 321
                // We do support multiple here - so we should construct an array                               // 322
                // and send it bulk - Investigate limit count of id's                                          // 323
                if (self.sendGCM) self.sendGCM(app.token.gcm, options);                                        // 324
                                                                                                               // 325
            } else {                                                                                           // 326
                throw new Error('Push.send got a faulty query');                                               // 327
            }                                                                                                  // 328
                                                                                                               // 329
        });                                                                                                    // 330
                                                                                                               // 331
        if (Push.debug) {                                                                                      // 332
                                                                                                               // 333
          console.log('Push: Sent message "' + options.title + '" to ' + countApn.length + ' ios apps ' + countGcm.length + ' android apps');
                                                                                                               // 335
          // Add some verbosity about the send result, making sure the developer                               // 336
          // understands what just happened.                                                                   // 337
          if (!countApn.length && !countGcm.length) {                                                          // 338
            if (Push.appCollection.find().count() == 0) {                                                      // 339
              console.log('Push, GUIDE: The "Push.appCollection" is empty - No clients have registred on the server yet...');
            }                                                                                                  // 341
          } else if (!countApn.length) {                                                                       // 342
            if (Push.appCollection.find({ 'token.apn': { $exists: true } }).count() == 0) {                    // 343
              console.log('Push, GUIDE: The "Push.appCollection" - No APN clients have registred on the server yet...');
            }                                                                                                  // 345
          } else if (!countGcm.length) {                                                                       // 346
            if (Push.appCollection.find({ 'token.gcm': { $exists: true } }).count() == 0) {                    // 347
              console.log('Push, GUIDE: The "Push.appCollection" - No GCM clients have registred on the server yet...');
            }                                                                                                  // 349
          }                                                                                                    // 350
                                                                                                               // 351
        }                                                                                                      // 352
                                                                                                               // 353
        return {                                                                                               // 354
          apn: countApn,                                                                                       // 355
          gcm: countGcm                                                                                        // 356
        };                                                                                                     // 357
    };                                                                                                         // 358
                                                                                                               // 359
    self.serverSend = function(options) {                                                                      // 360
      options = options || { badge: 0 };                                                                       // 361
      var query;                                                                                               // 362
                                                                                                               // 363
      // Check basic options                                                                                   // 364
      if (options.from !== ''+options.from)                                                                    // 365
        throw new Error('Push.send: option "from" not a string');                                              // 366
                                                                                                               // 367
      if (options.title !== ''+options.title)                                                                  // 368
        throw new Error('Push.send: option "title" not a string');                                             // 369
                                                                                                               // 370
      if (options.text !== ''+options.text)                                                                    // 371
        throw new Error('Push.send: option "text" not a string');                                              // 372
                                                                                                               // 373
      if (options.token || options.tokens) {                                                                   // 374
                                                                                                               // 375
        // The user set one token or array of tokens                                                           // 376
        var tokenList = (options.token)? [options.token] : options.tokens;                                     // 377
                                                                                                               // 378
        if (Push.debug) console.log('Push: Send message "' + options.title + '" via token(s)', tokenList);     // 379
                                                                                                               // 380
        query = {                                                                                              // 381
          $or: [                                                                                               // 382
              // XXX: Test this query: can we hand in a list of push tokens?                                   // 383
              { token: { $in: tokenList } },                                                                   // 384
              // XXX: Test this query: does this work on app id?                                               // 385
              { $and: [                                                                                        // 386
                  { _in: { $in: tokenList } }, // one of the app ids                                           // 387
                  { $or: [                                                                                     // 388
                      { 'token.apn': { $exists: true }  }, // got apn token                                    // 389
                      { 'token.gcm': { $exists: true }  }  // got gcm token                                    // 390
                  ]}                                                                                           // 391
              ]}                                                                                               // 392
          ]                                                                                                    // 393
        };                                                                                                     // 394
                                                                                                               // 395
      } else if (options.query) {                                                                              // 396
                                                                                                               // 397
        if (Push.debug) console.log('Push: Send message "' + options.title + '" via query', options.query);    // 398
                                                                                                               // 399
        query = {                                                                                              // 400
          $and: [                                                                                              // 401
              options.query, // query object                                                                   // 402
              { $or: [                                                                                         // 403
                  { 'token.apn': { $exists: true }  }, // got apn token                                        // 404
                  { 'token.gcm': { $exists: true }  }  // got gcm token                                        // 405
              ]}                                                                                               // 406
          ]                                                                                                    // 407
        };                                                                                                     // 408
      }                                                                                                        // 409
                                                                                                               // 410
                                                                                                               // 411
      if (query) {                                                                                             // 412
                                                                                                               // 413
        // Convert to querySend and return status                                                              // 414
        return _querySend(query, options)                                                                      // 415
                                                                                                               // 416
      } else {                                                                                                 // 417
        throw new Error('Push.send: please set option "token"/"tokens" or "query"');                           // 418
      }                                                                                                        // 419
                                                                                                               // 420
    };                                                                                                         // 421
                                                                                                               // 422
                                                                                                               // 423
    // This interval will allow only one notification to be sent at a time, it                                 // 424
    // will check for new notifications at every `options.sendInterval`                                        // 425
    // (default interval is 15000 ms)                                                                          // 426
    //                                                                                                         // 427
    // It looks in notifications collection to see if theres any pending                                       // 428
    // notifications, if so it will try to reserve the pending notification.                                   // 429
    // If successfully reserved the send is started.                                                           // 430
    //                                                                                                         // 431
    // If notification.query is type string, it's assumed to be a json string                                  // 432
    // version of the query selector. Making it able to carry `$` properties in                                // 433
    // the mongo collection.                                                                                   // 434
    //                                                                                                         // 435
    // Pr. default notifications are removed from the collection after send have                               // 436
    // completed. Setting `options.keepNotifications` will update and keep the                                 // 437
    // notification eg. if needed for historical reasons.                                                      // 438
    //                                                                                                         // 439
    // After the send have completed a "send" event will be emitted with a                                     // 440
    // status object containing notification id and the send result object.                                    // 441
    //                                                                                                         // 442
    var isSendingNotification = false;                                                                         // 443
                                                                                                               // 444
    Meteor.setInterval(function() {                                                                            // 445
                                                                                                               // 446
        if (isSendingNotification) {                                                                           // 447
            return;                                                                                            // 448
        }                                                                                                      // 449
        // Set send fence                                                                                      // 450
        isSendingNotification = true;                                                                          // 451
                                                                                                               // 452
        var countSent = 0;                                                                                     // 453
        var batchSize = options.sendBatchSize || 1;                                                            // 454
                                                                                                               // 455
        // Find notifications that are not being or already sent                                               // 456
        var pendingNotifications = Push.notifications.find({ $and: [                                           // 457
              // Message is not sent                                                                           // 458
              { sent : { $ne: true } },                                                                        // 459
              // And not being sent by other instances                                                         // 460
              { sending: { $ne: true } },                                                                      // 461
              // And not queued for future                                                                     // 462
              { $or: [ { delayUntil: { $exists: false } }, { delayUntil:  { $lte: new Date() } } ] }           // 463
		      ]}, {                                                                                                  // 464
            // Sort by created date                                                                            // 465
            sort: { createdAt: 1 },                                                                            // 466
            limit: batchSize                                                                                   // 467
          });                                                                                                  // 468
                                                                                                               // 469
        pendingNotifications.forEach(function(notification) {                                                  // 470
            // Reserve notification                                                                            // 471
            var reserved = Push.notifications.update({ $and: [                                                 // 472
              // Try to reserve the current notification                                                       // 473
              { _id: notification._id },                                                                       // 474
              // Make sure no other instances have reserved it                                                 // 475
              { sending: { $ne: true } }                                                                       // 476
            ]}, {                                                                                              // 477
              $set: {                                                                                          // 478
                // Try to reserve                                                                              // 479
                sending: true                                                                                  // 480
              }                                                                                                // 481
            });                                                                                                // 482
                                                                                                               // 483
            // Make sure we only handle notifications reserved by this                                         // 484
            // instance                                                                                        // 485
            if (reserved) {                                                                                    // 486
                                                                                                               // 487
              // Check if query is set and is type String                                                      // 488
              if (notification.query && notification.query === ''+notification.query) {                        // 489
                try {                                                                                          // 490
                  // The query is in string json format - we need to parse it                                  // 491
                  notification.query = JSON.parse(notification.query);                                         // 492
                } catch(err) {                                                                                 // 493
                  // Did the user tamper with this??                                                           // 494
                  throw new Error('Push: Error while parsing query string, Error: ' + err.message);            // 495
                }                                                                                              // 496
              }                                                                                                // 497
                                                                                                               // 498
              // Send the notification                                                                         // 499
              var result = Push.serverSend(notification);                                                      // 500
                                                                                                               // 501
              if (!options.keepNotifications) {                                                                // 502
                  // Pr. Default we will remove notifications                                                  // 503
                  Push.notifications.remove({ _id: notification._id });                                        // 504
              } else {                                                                                         // 505
                                                                                                               // 506
                  // Update the notification                                                                   // 507
                  Push.notifications.update({ _id: notification._id }, {                                       // 508
                      $set: {                                                                                  // 509
                        // Mark as sent                                                                        // 510
                        sent: true,                                                                            // 511
                        // Set the sent date                                                                   // 512
                        sentAt: new Date(),                                                                    // 513
                        // Count                                                                               // 514
                        count: result,                                                                         // 515
                        // Not being sent anymore                                                              // 516
                        sending: false                                                                         // 517
                      }                                                                                        // 518
                  });                                                                                          // 519
                                                                                                               // 520
              }                                                                                                // 521
                                                                                                               // 522
              // Emit the send                                                                                 // 523
              self.emit('send', { notification: notification._id, result: result });                           // 524
                                                                                                               // 525
            } // Else could not reserve                                                                        // 526
                                                                                                               // 527
        }); // EO forEach                                                                                      // 528
                                                                                                               // 529
        // Remove the send fence                                                                               // 530
        isSendingNotification = false;                                                                         // 531
    }, options.sendInterval || 15000); // Default every 15th sec                                               // 532
                                                                                                               // 533
};                                                                                                             // 534
                                                                                                               // 535
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 714
                                                                                                                      // 715
}).call(this);                                                                                                        // 716
                                                                                                                      // 717
                                                                                                                      // 718
                                                                                                                      // 719
                                                                                                                      // 720
                                                                                                                      // 721
                                                                                                                      // 722
(function () {                                                                                                        // 723
                                                                                                                      // 724
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 725
//                                                                                                             //     // 726
// packages/raix:push/lib/server/server.js                                                                     //     // 727
//                                                                                                             //     // 728
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 729
                                                                                                               //     // 730
Push.appCollection = new Mongo.Collection('_raix_push_app_tokens');                                            // 1   // 731
                                                                                                               // 2   // 732
Push.addListener('token', function(currentToken, value) {                                                      // 3   // 733
  if (value) {                                                                                                 // 4   // 734
    // Update the token for app                                                                                // 5   // 735
    Push.appCollection.update({ token: currentToken }, { $set: { token: value } }, { multi: true });           // 6   // 736
  } else if (value === null) {                                                                                 // 7   // 737
    // Remove the token for app                                                                                // 8   // 738
    Push.appCollection.update({ token: currentToken }, { $unset: { token: true } }, { multi: true });          // 9   // 739
  }                                                                                                            // 10  // 740
});                                                                                                            // 11  // 741
                                                                                                               // 12  // 742
Meteor.methods({                                                                                               // 13  // 743
  'raix:push-update': function(options) {                                                                      // 14  // 744
    if (Push.debug) console.log('Push: Got push token from app:', options);                                    // 15  // 745
                                                                                                               // 16  // 746
    check(options, {                                                                                           // 17  // 747
      id: Match.Optional(String),                                                                              // 18  // 748
      token: _matchToken,                                                                                      // 19  // 749
      appName: String,                                                                                         // 20  // 750
      userId: Match.OneOf(String, null),                                                                       // 21  // 751
      metadata: Match.Optional(Object)                                                                         // 22  // 752
    });                                                                                                        // 23  // 753
                                                                                                               // 24  // 754
    // The if user id is set then user id should match on client and connection                                // 25  // 755
    if (options.userId && options.userId !== this.userId) {                                                    // 26  // 756
      throw new Meteor.Error(403, 'Forbidden access');                                                         // 27  // 757
    }                                                                                                          // 28  // 758
                                                                                                               // 29  // 759
    var doc;                                                                                                   // 30  // 760
                                                                                                               // 31  // 761
    // lookup app by id if one was included                                                                    // 32  // 762
    if (options.id) {                                                                                          // 33  // 763
      doc = Push.appCollection.findOne({ _id: options.id });                                                   // 34  // 764
    }                                                                                                          // 35  // 765
                                                                                                               // 36  // 766
    // No doc was found - we check the database to see if                                                      // 37  // 767
    // we can find a match for the app via token and appName                                                   // 38  // 768
    if (!doc) doc = Push.appCollection.findOne({                                                               // 39  // 769
      $and: [                                                                                                  // 40  // 770
        { token: options.token },     // Match token                                                           // 41  // 771
        { appName: options.appName }, // Match appName                                                         // 42  // 772
        { token: { $exists: true } }  // Make sure token exists                                                // 43  // 773
      ]                                                                                                        // 44  // 774
    });                                                                                                        // 45  // 775
                                                                                                               // 46  // 776
    // if we could not find the id or token then create it                                                     // 47  // 777
    if (!doc) {                                                                                                // 48  // 778
      // Rig default doc                                                                                       // 49  // 779
      doc = {                                                                                                  // 50  // 780
        token: options.token,                                                                                  // 51  // 781
        appName: options.appName,                                                                              // 52  // 782
        userId: options.userId,                                                                                // 53  // 783
        createdAt: new Date(),                                                                                 // 54  // 784
        updatedAt: new Date()                                                                                  // 55  // 785
      };                                                                                                       // 56  // 786
                                                                                                               // 57  // 787
      if (options.id) {                                                                                        // 58  // 788
        // XXX: We might want to check the id - Why isnt there a match for id                                  // 59  // 789
        // in the Meteor check... Normal length 17 (could be larger), and                                      // 60  // 790
        // numbers+letters are used in Random.id() with exception of 0 and 1                                   // 61  // 791
        doc._id = options.id;                                                                                  // 62  // 792
        // The user wanted us to use a specific id, we didn't find this while                                  // 63  // 793
        // searching. The client could depend on the id eg. as reference so                                    // 64  // 794
        // we respect this and try to create a document with the selected id;                                  // 65  // 795
        Push.appCollection._collection.insert(doc);                                                            // 66  // 796
      } else {                                                                                                 // 67  // 797
        // Get the id from insert                                                                              // 68  // 798
        doc._id = Push.appCollection.insert(doc);                                                              // 69  // 799
      }                                                                                                        // 70  // 800
    } else {                                                                                                   // 71  // 801
      // We found the app so update the updatedAt and set the token                                            // 72  // 802
      Push.appCollection.update({ _id: doc._id }, {                                                            // 73  // 803
        $set: {                                                                                                // 74  // 804
          updatedAt: new Date(),                                                                               // 75  // 805
          token: options.token                                                                                 // 76  // 806
        }                                                                                                      // 77  // 807
      });                                                                                                      // 78  // 808
    }                                                                                                          // 79  // 809
                                                                                                               // 80  // 810
    if (doc && Push.debug) {                                                                                   // 81  // 811
      console.log('Push: updated', doc);                                                                       // 82  // 812
    }                                                                                                          // 83  // 813
                                                                                                               // 84  // 814
    if (!doc) {                                                                                                // 85  // 815
      throw new Meteor.Error(500, 'setPushToken could not create record');                                     // 86  // 816
    }                                                                                                          // 87  // 817
    // Return the id we want to use                                                                            // 88  // 818
    return doc._id;                                                                                            // 89  // 819
  },                                                                                                           // 90  // 820
  'raix:push-setuser': function(id) {                                                                          // 91  // 821
    check(id, String);                                                                                         // 92  // 822
    // We update the appCollection id setting the Meteor.userId                                                // 93  // 823
    var found = Push.appCollection.update({ _id: id }, { $set: { userId: this.userId } });                     // 94  // 824
                                                                                                               // 95  // 825
    // Note that the app id might not exist because no token is set yet.                                       // 96  // 826
    // We do create the new app id for the user since we might store additional                                // 97  // 827
    // metadata for the app / user                                                                             // 98  // 828
                                                                                                               // 99  // 829
    // If id not found then create it?                                                                         // 100
    // We dont, its better to wait until the user wants to                                                     // 101
    // store metadata or token - We could end up with unused data in the                                       // 102
    // collection at every app re-install / update                                                             // 103
    //                                                                                                         // 104
    // The user could store some metadata in appCollectin but only if they                                     // 105
    // have created the app and provided a token.                                                              // 106
    // If not the metadata should be set via ground:db                                                         // 107
                                                                                                               // 108
    return !!found;                                                                                            // 109
  },                                                                                                           // 110
  'raix:push-metadata': function(data) {                                                                       // 111
    check(data, {                                                                                              // 112
      id: String,                                                                                              // 113
      metadata: Object                                                                                         // 114
    });                                                                                                        // 115
                                                                                                               // 116
    // Set the metadata                                                                                        // 117
    var found = Push.appCollection.update({ _id: data.id }, { $set: { metadata: data.metadata } });            // 118
                                                                                                               // 119
    return !!found;                                                                                            // 120
  }                                                                                                            // 121
});                                                                                                            // 122
                                                                                                               // 123
                                                                                                               // 124
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 855
                                                                                                                      // 856
}).call(this);                                                                                                        // 857
                                                                                                                      // 858
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['raix:push'] = {
  Push: Push
};

})();

//# sourceMappingURL=raix_push.js.map
