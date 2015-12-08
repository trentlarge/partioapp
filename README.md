Branch Archive Location: https://drive.google.com/file/d/0ByiMOaGVDKkUVGFuUUEtWURhRUE/view?usp=sharing

KNOWN ISSUES:
- Facebook de-link account since there's no password concept
- Facebook wait until service configuration loaded
- Facebook login needs additional fields for complete user registration -> location, college, phone number (DONE)
- Over a period of time, an Amazon call is not always necessary. What if the book is already there in Partio databsae? Why waste a call to Amazon?
- Both 10 and 13 need to be added in Search Collection for users searching for either of them (DONE)
- ProductUniqueId in Search is referencing the first item in Products.findOne. Possible Error when products in database increase
- Need to remove Search collection - doesn't make sense for products of ANY kind (not just books)


Sample Debit Card:
5200 8282 8282 8210  MasterCard (debit)

Sample Books ISBN
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



