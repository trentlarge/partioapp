KNOWN ISSUES:

- Facebook de-link account since there's no password concept
- Facebook wait until service configuration loaded
- Facebook login needs additional fields for complete user registration -> location, college, phone number

- Over a period of time, an Amazon call is not always necessary. What if the book is already there in Partio databsae? Why waste a call to Amazon?
- Both 10 and 13 need to be added in Search Collection for users searching for either of them

Sample Debit Card:
5200828282828210  MasterCard (debit)

Sample Books
0470614811 Dynamics
1118131991 Thermo


{
  "apn": {
    "passphrase": "xxxxxxxxx",  
    "key": "apnProdKey.pem",
    "cert": "apnProdCert.pem"
  },
  "apn-dev": {
    "passphrase": "xxxxxxxxx",
    "key": "apnDevKey.pem",
    "cert": "apnDevCert.pem"
  },  
  "gcm": {
    "apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "projectNumber": xxxxxxxxxxxx
  },
  "production": true,
  // "badge": true,
  // "sound": true,
  // "alert": true,
  // "vibrate": true,
  // "sendInterval": 15000,  Configurable interval between sending notifications
  // "sendBatchSize": 1  Configurable number of notifications to send per batch
}


FOR LOCALHOST TESTING ->
*STRIPE_SECRET=sk_test_z3FwqB2S5uJxnQGRGKBA1Hzh meteor run --settings settings.json*

BUILD TO XCODE -> 
*meteor run ios-device --mobile-server http://stagingpartio-50559.onmodulus.net --production*

http://graph.facebook.com/418093848371137/picture?
"https://www.facebook.com/app_scoped_user_id/418093848371137/"



<Committing in Branch: books>

*color codes*
LIGHT ORANGE: #f0970d 
DARK ORANGE: #df5707

*plugins*
cordova:phonegap-plugin-barcodescanner@https://github.com/phonegap/phonegap-plugin-barcodescanner/tarball/70ca00be45a675b1b1d6963ad6f72430e579788e
nl.x-services.plugins.launchmyapp
iron:router fourseven:scss meteoric:ionic-sass meteoric:ionicons-sass meteoric:ionic
cordova:cordova-plugin-camera@https://github.com/apache/cordova-plugin-camera/tarball/1e607ddcc856fd69208d1fb7e6202ab241adfa80






*Issues*
Squished images

