// ServiceConfiguration.loginServiceConfiguration.remove({
//     service: "facebook"
// });

//Kadira.connect('qhAvzzmgKeHaZ9rd9', '338e5eb7-842c-47f5-bfe7-7a4d3b9c0607');

Meteor.startup(function() {
  // process.env.MAIL_URL="smtp://partio@cloudservice.io:partio1234@smtp.zoho.com:465";
  // Accounts.emailTemplates.from = 'partio@cloudservice.io';
  //Stripe = StripeSync(Meteor.settings.env.STRIPE_SECRET);
  //Stripe.secretKey = Meteor.settings.env.STRIPE_SECRET+':null';

  Stripe = StripeAPI(Meteor.settings.env.STRIPE_SECRET);

  process.env.MAIL_URL="smtp://support%40partio.xyz:partio123!@smtp.zoho.com:465/";
  Accounts.emailTemplates.from = 'support@partio.xyz';
  Accounts.emailTemplates.siteName = 'partiO';

  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Welcome to partiO!';
  };

  Accounts.emailTemplates.verifyEmail.html = function(user, url) {
    console.log('new user activation url '+url);
    var body =
    '<!DOCTYPE html>\
            <html>\
                <head>\
                    <title>Partio</title>\
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
                    <style>\
                    a {\
                        color:#95cbab;\
                    }\
                    </style>\
                </head>\
                <body>\
                    <table width="750" bgcolor="#f6f6f6">\
                        <tr height="373">\
                            <td><img src="http://partio.cloudservice.io/img/template_cabecalho.jpg" /></td>\
                        </tr>\
                        <tr>\
                            <td>\
                                <div style="width:640px;font-family:arial; tex-align:left; margin-left:50px;color:#999">\
                                    <h1 style="color:#263238;font-size:40px">Hello there!</h1>\
                                    <p style="font-size:20px;line-height:38px;">Welcome aboard partiO!<br />\
                                    The things you own end up making money for you! Sounds familiar? Er..nevermind! To make this happen, it all starts with one link.<br />\
                                    The one below. Click to verify and get sharing<br />\
                                     '+url+'\
                                     <br />For any queries or support, feel free to contact partio.missioncontrol@gmail.com\
                                    Best<br />\
                                    partiO team\
                                    </p>\
                                </div>\
                            </td>\
                        </tr>\
                        <tr height="262">\
                            <td><img src="http://partio.cloudservice.io/img/template_rodape.jpg" /></td>\
                        </tr>\
                    </table>\
                </body>\
            </html>';
    return body;
  };

  Accounts.emailTemplates.resetPassword.html = function(user, url) {
    var body =
    '<!DOCTYPE html>\
            <html>\
                <head>\
                    <title>Partio</title>\
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
                    <style>\
                    a {\
                        color:#95cbab;\
                    }\
                    </style>\
                </head>\
                <body>\
                    <table width="750" bgcolor="#f6f6f6">\
                        <tr height="373">\
                            <td><img src="http://partio.cloudservice.io/img/template_cabecalho.jpg" /></td>\
                        </tr>\
                        <tr>\
                            <td>\
                                <div style="width:640px;font-family:arial; tex-align:left; margin-left:50px;color:#999">\
                                    <h1 style="color:#263238;font-size:40px">Hello!</h1>\
                                    <p style="font-size:20px;line-height:38px;">\
                                    To reset your password, simply click the link below.\
                                     '+url+'\
                                     <br />Thanks.<br />\
                                    partiO team\
                                    </p>\
                                </div>\
                            </td>\
                        </tr>\
                        <tr height="262">\
                            <td><img src="http://partio.cloudservice.io/img/template_rodape.jpg" /></td>\
                        </tr>\
                    </table>\
                </body>\
            </html>';
    return body;
  };
});

// LISTING SEARCH ------------------------------
SearchSource.defineSource('packages', function(searchText, options) {



  var userProducts = Products.find({ownerId: Meteor.userId() }).fetch();

  var searchIds = []

  userProducts.map(function(prod){
   searchIds.push(prod.searchId)
  });


  var user_id = Meteor.userId();

  console.log('######### NOT IN');
  //var result_products = Products.find({ownerId: user_id}, { searchId : 1, _id : 0}).fetch();
  //console.log(result_products);
  //console.log(user_id);
  console.log(searchIds);

  //db.search.find({ _id: { $nin: [ 'bwCTtntQjSkXGMFkx' ] } })



  var options = {sort: {isoScore: -1}, limit: 20};
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {_id: { $nin: searchIds}, $or: [{title: regExp},{category: regExp},{uniqueId: searchText}]};
    console.log('searchText');
    return Search.find(selector, options).fetch();
  } else {
    var selector = {_id: { $nin: searchIds}};
    console.log(Search.find(selector, options).fetch());
    return Search.find(selector, options).fetch();
  }
});

function buildRegExp(searchText) {
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

// END LISTING SEARCH ------------------------------


sendNotification = function(toId, fromId, message, type, connectionId) {
  connectionId = connectionId || null;

  // do we already have the same, unread notification?
  var oldNotification = Notifications.findOne({
    fromId: fromId,
    toId: toId,
    connectionId: connectionId,
    type: type
  });

  if(oldNotification) {
    // the same notification already exist, update it
    Notifications.update({ _id: oldNotification._id }, {
      $set: {
        message: message,
        timestamp: new Date(),
        read: false
      }
    });
  } else {
    // this is new notification
    Notifications.insert({
      toId: toId,
      fromId: fromId,
      connectionId: connectionId,
      message: message,
      read: false,
      timestamp: new Date(),
      type: type
    });
  }
}

var sendPush = function(toId, message) {
  Push.send({
    from: 'partiO',
    title: 'New activity on partiO',
    text: message,
    badge: 1,
    sound: 'check',
    query: {
      userId: toId
    }
  });
}

Meteor.methods({

  // TWILIO  -------------------------------------------------------------------
  twilioVerification: function(numberFrom) {
    console.log('Twilio >>>>> twilioVerification called -x-x-x-x-x-x-x-x-x-');

    var twilioAccount = (Meteor.settings.env.twilioAccount) ? Meteor.settings.env.twilioAccount : false;
    var twilioKey = (Meteor.settings.env.twilioKey) ? Meteor.settings.env.twilioKey : false;

    if(!twilioAccount || !twilioKey) {
      throw new Meteor.Error("twilio not configured. Check settings.json");
      console.log('twilio not configured. Check settings.json');
      return false;
    }

    var twilioAuth = twilioAccount+":"+twilioKey;
    var twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/"+twilioAccount+'/';

    var response = Async.runSync(function(done) {
      var result = HTTP.call("POST", twilioUrl+'OutgoingCallerIds.json', {
        "params": {
          "PhoneNumber" : numberFrom
        },
        "auth" : twilioAuth
      },function(error, result){
        console.log(error);
        console.log(result);
        done(error, result);
      });
    });

    return response.result;
  },


  callTwilio: function(numbers) {
    console.log('Twilio >>>>> callTwilio called -x-x-x-x-x-x-x-x-x-');
    console.log('###################################');
    console.log(numbers);
    console.log('###################################');

    var twilioAccount = (Meteor.settings.env.twilioAccount) ? Meteor.settings.env.twilioAccount : false;
    var twilioKey = (Meteor.settings.env.twilioKey) ? Meteor.settings.env.twilioKey : false;
    var twilioXml = (Meteor.settings.env.twilioXml) ? Meteor.settings.env.twilioXml : process.env.ROOT_URL+'twilio/';

    if(!twilioAccount || !twilioKey) {
      throw new Meteor.Error("twilio not configured. Check settings.json");
      console.log('twilio not configured. Check settings.json');
      return false;
    }

    var twilioAuth = twilioAccount+":"+twilioKey;
    var twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/"+twilioAccount+'/';

    var to = numbers.to.replace('+', '');

    var response = Async.runSync(function(done) {
      var result = HTTP.post(twilioUrl+'Calls.json', {
        "params": {
          "Url" : twilioXml+to,
          "To" : numbers.from,
          "From" : '+19192630795'
        },
        "auth" : twilioAuth
      },function(error, result){
        console.log(error);
        console.log(result);
        done(error, result);
      });
    });

    return response.result;
  },



  // CAMFIND -------------------------------------------------------------------
  // camfindGetToken: function(imageUrl){
  //   return HTTP.post('https://camfind.p.mashape.com/image_requests', {
  //     "headers": {
  //       "X-Mashape-Key" : "7W5OJWzlcsmshYSMTJW8yE4L2mJQp1cuOVKjsneO6N0wPTpaS1"
  //     },
  //     "params": {
  //       "image_request[remote_image_url]" : imageUrl,
  //       "image_request[locale]" : "en_US"
  //     }
  //   });
  // },

  camfindGetTokenBase64: function(dataURI) {
    var cloudSightApiURL = "http://api.cloudsightapi.com/";
    var cloudSightApiKey = (Meteor.settings.env.cloudSightKey) ? Meteor.settings.env.cloudSightKey : false;

    if(!cloudSightApiKey) {
      throw new Meteor.Error("cloudSightKey not configured. Check settings.json");
      console.log('cloudSightKey not configured. Check settings.json');
      return false;
    }

    // var mashapeURL = "https://camfind.p.mashape.com/image_requests";
    // var mashapeKey = "7W5OJWzlcsmshYSMTJW8yE4L2mJQp1cuOVKjsneO6N0wPTpaS1";

    // base64 encoded data to Buffer conversion
    var atob = Meteor.npmRequire('atob');
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var tmp = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        tmp[i] = byteString.charCodeAt(i);
    }
    var buffer = new Buffer(arrayBuffer.byteLength);
    var view = new Uint8Array(arrayBuffer);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }

    // HTTP request payload
    var formData = {
      // Pass a simple key-value pair
      "image_request[locale]": "en_US",
      "image_request[image]": {
        value: buffer,
        options: {
          filename: "image-" + Math.random().toString().substr(2) + ".jpg",
          contentType: mimeString
        }
      }
    };

    // HTTP request
    var request = Meteor.npmRequire("request");
    var response = Async.runSync(function(done) {
      request.post({
        url: cloudSightApiURL+'image_requests',
        //headers: { "X-Mashape-Key": cloudSightApiKey },
        headers: { "Authorization": "CloudSight "+cloudSightApiKey },
        formData: formData
      }, function(err, httpResponse, body) {
        var result = {
          data: JSON.parse(body),
          statusCode: httpResponse.statusCode
        };

        done(err, result);
      });
    });
    return response.result;
  },

  camfindGetResponse: function(token) {
    var cloudSightApiURL = "http://api.cloudsightapi.com/";
    var cloudSightApiKey = (Meteor.settings.env.cloudSightKey) ? Meteor.settings.env.cloudSightKey : false;

    if(!cloudSightApiKey) {
      throw new Meteor.Error("cloudSightKey not configured. Check settings.json");
      console.log('cloudSightKey not configured. Check settings.json');
      return false;
    }

    console.log('CamFind: request token >>> '+token);
    console.log('CamFind: waiting API status...');

    var response = Async.runSync(function(done) {
      var interval = Meteor.setInterval(function(){
        HTTP.get(cloudSightApiURL+'image_responses/'+token, {
          "headers": {
            "Authorization" : "CloudSight "+cloudSightApiKey
          }
        }, function(error, result){
          console.log('CamFind: ping Camfind >>> result.data.status = '+result.data.status);

          if(error){
            Meteor.clearInterval(interval);
            done(error, null);
          }

          if(result.data.status == 'completed' || result.data.status == 'skipped'){
            console.log('CamFind: status '+result.data.status+' *-*-*-*-*-*-*-*');
            Meteor.clearInterval(interval);
            done(null, result);
          }
        })
      }, 1000);
    });

    return response.result;
  },


  // AMAZONs3UPLOAD-------------------------------------------------------------------
  'amazons3upload' : function(photo){
      console.log('AmazonS3: uploading >>>');

      var response = Async.runSync(function(done) {
        AWS.config.update({
          accessKeyId: Meteor.settings.AWSAccessKeyId,
          secretAccessKey: Meteor.settings.AWSSecretAccessKey
        });

        buf = new Buffer(photo.replace(/^data:image\/\w+;base64,/, ""),'base64')
        str = +new Date + Math.floor((Math.random() * 100) + 1)+ ".jpg";

        var params = {
          Bucket: 'testepartio',
          Key: str,
          Body: buf,
          ACL:'public-read',
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg'
        };

        var s3 = new AWS.S3();

        var request = s3.putObject(params, function(err, data) {
          if (err) console.log(err)
          else {
            console.log(data);
            console.log("AmazonS3: >>>> Successfully uploaded");
            var urlParams = {Bucket: 'testepartio', Key: str};

            s3.getSignedUrl('getObject', urlParams, function(err, url){
                console.log('AmazonS3: imgURL > ' +  url);
                done(null, url);
            });
          }
        });

        request.on('httpUploadProgress', function (progress) {
          console.log("progress: " + progress);
          console.log(progress.loaded + " of " + progress.total + " bytes");
          console.log(Math.round(progress.loaded/progress.total*100)+ '% done');
        });

        request.send();

      });

      return response.result;
    },

  'updateOfficialEmail': function(userId, college, email) {
    Meteor.users.update({"_id": userId}, {$set: {"emails": [{"address": email, "verified": false}], "profile.college": college}}, function(error) {
      if (!error) {
        Accounts.sendVerificationEmail(userId);
      }
    });
  },
  'updatePassword': function(userId, password) {

      Accounts.setPassword(userId, password, { logout: false }, function(error) {

        console.log(error);

      });


  },

  'submitRating': function(rating, personId, ratedBy) {
    Meteor.users.update({_id: personId}, {$push: {"profile.rating": rating}});
    var ratedByName = Meteor.users.findOne(ratedBy).profile.name;
    var message = 'You got a rating of ' + rating + ' from ' + ratedByName;

    sendPush(personId, message)
    sendNotification(personId, ratedBy, message, "info")
  },

  returnItem: function(connectionId) {
    var connect = Connections.findOne(connectionId);
    var borrowerName = Meteor.users.findOne(connect.requestor).profile.name;

    Connections.update({_id: connectionId}, {$set: {"state": "RETURNED"}});

    var message = borrowerName + " wants to return the book " + connect.productData.title;
    sendPush(connect.productData.ownerId, message);
    sendNotification(connect.productData.ownerId, connect.requestor, message, "info", connectionId);
  },

  confirmReturn: function(searchId, connectionId) {
    var connect = Connections.findOne(connectionId);
    var ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name;

    Search.update({_id: searchId}, {$inc: {qty: 1}});

    var message = ownerName + " confirmed your return of " + connect.productData.title;
    sendPush(connect.requestor, message);
    sendNotification(connect.requestor, connect.productData.ownerId, message, "info", connectionId);
  },

  requestOwner: function(requestorId, productId, ownerId, borrowDetails) {
    console.log(requestorId, productId, ownerId);

    var requestorName = Meteor.users.findOne(requestorId).profile.name;
    var product = Products.findOne(productId);

    var connection = {
      owner: ownerId,
      requestor: requestorId,
      state: 'WAITING',
      requestDate: new Date(),
      borrowDetails: borrowDetails,
      productData: product,
      chat: [  ],
      meetupLocation: "Location not set",
      meetupLatLong: "Location not set"
    };

    Connections.insert(connection, function(e, r) {
      if(e) {
        throw new Meteor.Error("requestOwner", e.message);
      } else {
        var message = requestorName + " sent you a request for " + product.title
        sendPush(ownerId, message);
        sendNotification(ownerId, requestorId, message, "request", r);
      }
    });

    return true;

  },
  'ownerAccept': function(connectionId) {
    Meteor._sleepForMs(1000);
    console.log("changing status from Waiting to Payment");

    var connect = Connections.findOne(connectionId);
    var ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name;

    Connections.remove({"productData._id": connect.productData._id, "requestor": {$ne: connect.requestor}});
    Connections.update({_id: connectionId}, {$set: {state: "PAYMENT"}});

    var message = ownerName + " accepted your request for " + connect.productData.title;
    sendPush(connect.requestor, message);
    sendNotification(connect.requestor, connect.productData.ownerId, message, "approved", connectionId);

    return true;
  },

  'ownerDecline': function(connectionId) {
    Meteor._sleepForMs(1000);
    var connect = Connections.findOne(connectionId);
    var ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name;
    var message =  "Your request for " + connect.productData.title + " has been declined.";
    sendPush(connect.requestor, message);
    sendNotification(connect.requestor, connect.productData.ownerId, message, "declined", connectionId);
    Connections.remove(connectionId);

    return true;
  },

  'payNow': function(payer) {
    console.log(payer);
    Meteor._sleepForMs(1000);
    Connections.update({_id: payer}, {$set: {state: "IN USE"}});
    return "yes, payment done"
  },


  // Account & STRIPE API (cards) -------------------------------------------------------------------
  'checkStripeManaged': function() {
    var _userProfile = Meteor.user().profile;

    if (!_userProfile.stripeManaged) {
      var clientIp = this.connection.clientAddress;

      var response = Async.runSync(function(done) {

        //Creating Stripe Managed Account
        Stripe.accounts.create({
          managed: true,
          country: 'US',
          email: _userProfile.email,
          "legal_entity[type]": "individual",
          "legal_entity[first_name]": _userProfile.name,
          "legal_entity[last_name]": 'Partio',
          "legal_entity[dob][day]": '11',
          "legal_entity[dob][month]": '06',
          "legal_entity[dob][year]": '1985',
          "tos_acceptance[date]": Math.floor(Date.now() / 1000),
          "tos_acceptance[ip]": clientIp,

        }, Meteor.bindEnvironment(function (error, result) {
          if(error) {
            done(error, false);
          }

          console.log('>>>> new stripeAccount id: '+result.id)

           Meteor.users.update({"_id": Meteor.userId() }, {$set: {
             "profile.stripeManaged": result.id,
           }}, function(){
              done(false, true);
           })
        }));
      })

      return response.result;

    } else {
      console.log(">>>> [stripe] stripeManaged already exists");
      return true;
    }
  },

  'checkStripeCustomer': function(){
    var _userProfile = Meteor.user().profile;

    if (!_userProfile.stripeCustomer) {
      var response = Async.runSync(function(done) {

        //Creating Stripe Customer Account
        Stripe.customers.create({ description: Meteor.userId() },
         Meteor.bindEnvironment(function (error, result) {
           if(error) {
             done(error, false);
           }

           console.log('>>>> new stripeCustomer id: '+result.id)

           Meteor.users.update({"_id": Meteor.userId() }, {$set: {
             "profile.stripeCustomer": result.id,
           }}, function(){
              done(false, true);
           })
         })
        );
      });

      return response.result;

    } else {
      console.log(">>>> [stripe] stripeCustomer already exists");
      return true;
    }
  },

  'addCustomerCard': function(token) {
    console.log('>>>>> [stripe] adding Customer card');

    var _userProfile = Meteor.user().profile;
    var stripeCustomerId = _userProfile.stripeCustomer;

    if(!_userProfile.stripeCustomer){
      throw new Meteor.Error("addCustomerCard", "missing stripeCustomer account");
    }

    var response = Async.runSync(function(done) {

      // generating own card Id to filter on stripeAPI
      var ownIdCard = Math.random().toString(36).substring(7);

      //Creating source to Customer Account
      Stripe.customers.createSource(
        stripeCustomerId,
        { source: token,
          metadata: { idPartioCard: ownIdCard }},
        Meteor.bindEnvironment(function (error, customerCard) {
          if(error) {
            done(error, false);
          }

          console.log('>>>>> [stripe] new customer card ', customerCard.id);

          Meteor.users.update({"_id": Meteor.userId() }, {$set: {"profile.canBorrow": true }} , function() {
            done(false, true);
          });
        })
      );
    })

    return response.result;
  },

  'addManagedCard': function(firstToken, secondToken) {
    console.log('>>>>> [stripe] adding Managed & Customer card');

    var _userProfile = Meteor.user().profile;

    if(!_userProfile.stripeCustomer){
      throw new Meteor.Error("addManagedCard", "missing stripeCustomer account");
    }

    if(!_userProfile.stripeManaged){
      throw new Meteor.Error("addManagedCard", "missing stripeManaged account");
    }

    var stripeManagedId = _userProfile.stripeManaged;
    var stripeCustomerId = _userProfile.stripeCustomer;

    var response = Async.runSync(function(done) {

      // generating own card Id to filter on stripeAPI
      var ownIdCard = Math.random().toString(36).substring(7);

      // Creating external_account to Managed Account
      Stripe.accounts.createExternalAccount( stripeManagedId,
      { external_account: firstToken,
        metadata: { idPartioCard: ownIdCard }},
        Meteor.bindEnvironment(function (error, managedCard) {
          console.log('>>>>> [stripe] new card to Managed account ', managedCard.id);
          if(error) {
            done(error.message, false);
          }

          //Creating source to Customer Account
          Stripe.customers.createSource(
            stripeCustomerId, { source: secondToken, metadata: { idPartioCard: ownIdCard }},
            Meteor.bindEnvironment(function (error, customerCard) {
              console.log('>>>>> [stripe] new customer card ', customerCard.id);
              if(error) {
                done(error, false);
              }

              Meteor.users.update({"_id": Meteor.userId() }, {$set: {"profile.canBorrow": true, "profile.canShare": true}} , function() {
                done(false, true);
              });
            })
          );
        })
      );
    })

    return response.result;
  },

  'getStripeCustomer': function(){
    var _userProfile = Meteor.user().profile;
    console.log('>>>>> [stripe] getting stripe CUSTOMER info from ', _userProfile.email);

    if(!_userProfile.stripeCustomer) {
      throw new Meteor.Error("getStripeCustomer", "missing stripeCustomer account");
    }

    var response = Async.runSync(function(done) {
      Stripe.customers.retrieve(_userProfile.stripeCustomer,
        Meteor.bindEnvironment(function (err, customer) {
          done(err, customer);
        })
      );
    });

    return response.result;
  },

  'getStripeManaged': function() {
    var _userProfile = Meteor.user().profile;
    console.log('>>>>> [stripe] getting stripe MANAGED info from ', _userProfile.email);

    if(!_userProfile.stripeManaged) {
      throw new Meteor.Error("getStripeCustomer", "missing stripeManaged account");
    }

    var response = Async.runSync(function(done) {
      Stripe.accounts.retrieve(_userProfile.stripeManaged,
        Meteor.bindEnvironment(function (err, account) {
          done(err, account);
        })
      );
    });

    return response.result;
  },

  'setDefaultCard': function(action, cardData){
    console.log('>>>>> [stripe] setDefaultCard');

    if(!cardData || !action) {
      throw new Meteor.Error("setDefaultCard", "missing params");
    }

    var _userProfile = Meteor.user().profile;

    // to 'pay', must be Stripe Customer account
    var response = Async.runSync(function(done) {
      if(action == 'pay') {

        //cardData.customerCardId;
        Stripe.customers.update(_userProfile.stripeCustomer,
          { default_source: cardData.customerCardId },
          Meteor.bindEnvironment(function (error, result) {
            if(error){
              done(error, false);
            } else {
              done(false, true);
            }
          })
        );

      // to 'receive', must be Stripe Managed account
      } else if(action == 'receive') {
        Stripe.accounts.updateExternalAccount(_userProfile.stripeManaged, cardData.managedCardId,
          { default_for_currency: true },
          Meteor.bindEnvironment(function (error, result) {
            if(error){
              done(error, false);
            } else {
              done(false, true);
            }
          })
        );
      }
    });

    return response.result;
  },

  'removeCard': function(cardData){
    console.log('>>>>> [stripe] removing card');

    if(!cardData) {
      throw new Meteor.Error("removeCard", "missing params");
    }

    var _userProfile = Meteor.user().profile;

    var response = Async.runSync(function(done) {
      var _return = false;

      if(cardData.customerCardId && cardData.managedCardId) {
        Stripe.customers.deleteCard(_userProfile.stripeCustomer, cardData.customerCardId,
          Meteor.bindEnvironment(function (err, result) {
            if(err) {
              done(err, false);
            }

            Stripe.accounts.deleteExternalAccount(_userProfile.stripeManaged, cardData.managedCardId,
              Meteor.bindEnvironment(function (err, result) {
                done(err, result);
              })
            );
          })
        );
      } else {
        if(cardData.customerCardId) {
          Stripe.customers.deleteCard(_userProfile.stripeCustomer, cardData.customerCardId,
            Meteor.bindEnvironment(function (err, result) {
              done(err, result);
            })
          );
        }

        if(cardData.managedCardId) {
          Stripe.accounts.deleteExternalAccount(_userProfile.stripeManaged, cardData.managedCardId,
            Meteor.bindEnvironment(function (err, result) {
              done(err, result);
            })
          );
        }
      }
    });

    return response.result;
  },

  'chargeCard': function(connectionId) {
    console.log('>>>>> [stripe] charging card');

    if(!connectionId) {
      throw new Meteor.Error("chargeCard", "missing params");
    }

    var connect = Connections.findOne(connectionId);

    if(!connect) {
      throw new Meteor.Error("chargeCard", "connect not found");
    }

    var requestor = Meteor.users.findOne(connect.requestor);
    var requestorManagedId = requestor.profile.stripeManaged;
    var requestorCustomerId = requestor.profile.stripeCustomer;
    var owner = Meteor.users.findOne(connect.productData.ownerId);
    var amount = connect.borrowDetails.price.total;
    var formattedAmount = (amount * 100).toFixed(0);

    var response = Async.runSync(function(done) {
      Stripe.customers.retrieve(requestorCustomerId,
        Meteor.bindEnvironment(function (err, customer) {
          if(err) {
            done(err, false);
          }

          var payCardId = customer.default_source;

          Stripe.charges.create({
            amount: formattedAmount,
            currency: "usd",
            customer: requestorCustomerId,
            source: payCardId,
            description: requestor.profile.email+' paid to Partio' },
            Meteor.bindEnvironment(function (err, charge) {
              if(err) {
                done(err, false);
              }
              console.log('>>>>> [stripe] new charge to Partio ', charge);
              Connections.update({_id: connect._id}, {$set: {state: "IN USE", payment: charge}});
              var message = 'You received a payment of $' + amount + ' from ' + requestor.profile.name;
              sendPush(owner._id, message);
              sendNotification(owner._id, requestor._id, message, "info");
              done(false, charge);
            })
          );
        })
      );
    });

    return response.result;
  },

  //not using yet
  'transferMoney': function(connectionId) {
      // Stripe.transfers.create({
      //   amount: formattedAmount,
      //   currency: "usd",
      //   source: requestorCardId,
      //   destination: ownerStripeId,
      //   destination_payment: ownerStripeId,
      //   description: "Send Money to "+owner.profile.name
      // }, function(err, transfer) {
      //   console.log(err, 'xxxxxxxxx', transfer);
      //   // asynchronously called
      // });
  },


  // SEARCH ITEMS FROM AMAZON --------------------------------------------------------
  AllItemsFromAmazon: function(keys) {
    var getAmazonItemSearchSynchronously = Meteor.wrapAsync(amazonItemSearch);
    var result = [];

    for(var i = 0; i < 1; i++) {
      result.push(getAmazonItemSearchSynchronously(keys, i+1));
      console.log(result[i]);
    }

    if (result.html && (result.html.body[0].b[0] === "Http/1.1 Service Unavailable")) {
      console.log(result.html.body[0].b[0]);
      throw new Meteor.Error("Error from Amazon - Service Unavailable");
    } else {
      if (result[0].ItemSearchResponse.Items[0].Item && (result[0].ItemSearchResponse.Items[0].Request[0].IsValid[0] === "True")) {
        console.log('AllItemsFromAmazon: OK');
        return amazonAllResultsItemSearchProcessing(result);
      } else {
        console.log('AllItemsFromAmazon: error');
        console.log(result[0].ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
        switch (result[0].ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]) {
          case 'AWS.ECommerceService.NoExactMatches':
            var text = 'You search does not match. Please try again with different words or take another photo.';
            break;
          default:
            var text = result[0].ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Code[0];
        }
        throw new Meteor.Error(text);
      }
    }

  },
  priceFromAmazon: function(barcode) {
    // var originalFormat = format;
    var originalBarcode = barcode;
    console.log("originalBarcode: "+ originalBarcode);
    var getAmazonPriceSearchSynchronously =  Meteor.wrapAsync(amazonPriceSearch);
    var result = getAmazonPriceSearchSynchronously(barcode);

    if (result.html && (result.html.body[0].b[0] === "Http/1.1 Service Unavailable")) {
      console.log(result.html.body[0].b[0]);
      throw new Meteor.Error("Error from Amazon - Service Unavailable");
    } else {
        if (result.ItemLookupResponse.Items[0].Item && (result.ItemLookupResponse.Items[0].Request[0].IsValid[0] === "True")) {
          return amazonResultProcessing(result);
        } else {
          console.log(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
          throw new Meteor.Error(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
      }
    }
  },

})

var amazonAllResultsItemSearchProcessing = function(result) {

//  console.log(JSON.stringify(result[0].ItemSearchResponse.Items[0]));

  var necessaryFields = [];
  for(var itemPage = 0; itemPage < result.length; itemPage++) {
    var Items = result[itemPage].ItemSearchResponse.Items[0];
      if (Items.Item){
        if (Items.Item[0].ItemAttributes[0]) {
          try {
            for(var i = 0; i < Items.Item.length; i++) {
              necessaryFields.push({
                price: (function() {
                    if(Items.Item[i].ItemAttributes[0].ListPrice) {
                        return Items.Item[i].ItemAttributes[0].ListPrice[0].FormattedPrice[0];
                    }
                    else if(Items.Item[i].OfferSummary) {
                        if(Items.Item[i].OfferSummary[0].LowestNewPrice) {
                            return Items.Item[i].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];
                        }
                        else if(Items.Item[i].OfferSummary[0].LowestRefurbishedPrice) {
                            return Items.Item[i].OfferSummary[0].LowestRefurbishedPrice[0].FormattedPrice[0];
                        }
                        else if(Items.Item[i].OfferSummary[0].LowestUsedPrice) {
                            return Items.Item[i].OfferSummary[0].LowestUsedPrice[0].FormattedPrice[0];
                        }
                    }
                    return "--";
                })(),
                rank: (function() {
                    return Items.Item[i].SalesRank ? Items.Item[i].SalesRank[0] : "0";
                })(),
                //price : (function() {return Items.Item[i].Offers[0].Offer ? Items.Item[i].Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
                title : Items.Item[i].ItemAttributes[0].Title[0],
                category : CategoriesServer.getCategory(Items.Item[i].ItemAttributes[0].ProductGroup[0]),
                amazonCategory : CategoriesServer.getAmazonCategory(Items.Item[i].ItemAttributes[0].ProductGroup[0]),
                image: (function() {
                  if(Items.Item[i].MediumImage){
                    if(Items.Item[i].MediumImage[0].URL) {
                        return Items.Item[i].MediumImage[0].URL[0];
                    }
                  } else if(Items.Item[i].LargeImage) {
                    if(Items.Item[i].LargeImage[0].URL) {
                        return Items.Item[i].LargeImage[0].URL[0];
                    }
                  } else if(Items.Item[i].SmallImage) {
                    if(Items.Item[i].SmallImage[0].URL) {
                        return Items.Item[i].SmallImage[0].URL[0];
                    }
                  } else if(Items.Item[i].ThumbnailImage) {
                    if(Items.Item[i].ThumbnailImage[0].URL) {
                        return Items.Item[i].ThumbnailImage[0].URL[0];
                    }
                  } else if(Items.Item[i].SwatchImage) {
                    if(Items.Item[i].SwatchImage[0].URL) {
                        return Items.Item[i].SwatchImage[0].URL[0];
                    }
                  } else if(Items.Item[i].TinyImage) {
                    if(Items.Item[i].TinyImage[0].URL) {
                        return Items.Item[i].TinyImage[0].URL[0];
                    }
                  } else {
                      return '/image-not-available.png';
                  }
                })(),
                asin: Items.Item[i].ASIN[0],
                attributes: (function() {
                  var attributes = [];
                  for(var property in Items.Item[i].ItemAttributes[0]) {
                    var possibleProperties = [
                      'Actor',
                      'Artist',
                      'Author',
                      'Binding',
                      'Brand',
                      'Color',
                      'Creator',
                      'Director',
                      'Edition',
                      //'Feature',
                      'Publisher'
                    ];

                    if(possibleProperties.indexOf(property) >= 0) {
                      var attrs = Items.Item[i].ItemAttributes[0][property];
                      if(attrs) {
                        if(attrs.toString().indexOf('[object Object]') < 0){
                          attributes.push({
                            key: property,
                            value: attrs.toString().replace(/,/g, ', ')
                          });
                        }
                      }
                    }
                  }
                  return attributes;
                })(),
              });
            }
        } catch(e) {console.log(e)}
      } else {
//      throw new Meteor.Error("No match for this item")
      }
    } else {
//     console.log(result.ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
//     throw new Meteor.Error(result.ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Message[0]);
    }
  }

  console.log('amazonAllResultsItemSearchProcessing -x-x-x-x-x-x-x-x-x-x-x-x-x');

  necessaryFields = necessaryFields.filter(function(necessaryField) {
     return (necessaryField.price !== '--') && (necessaryField.price !== '$0.00');
  });

  var amazonCategories = {};
  for(var i = 0; i < necessaryFields.length; i++) {

      if(!amazonCategories[necessaryFields[i].amazonCategory]) {
          amazonCategories[necessaryFields[i].amazonCategory] = 0;
      }
      amazonCategories[necessaryFields[i].amazonCategory] += parseInt(necessaryFields[i].rank);
  };

  console.log(JSON.stringify(amazonCategories));

//  necessaryFields.sort(function(a, b) {
//      return (a.rank < b.rank) ? 1 : -1;
//  });

  // sort results by amazon category
//  necessaryFields.sort(function(a, b) {
//      return (a.amazonCategory > b.amazonCategory) ? 1 : -1;
//  });

  necessaryFields.sort(function(a, b) {

      if(amazonCategories[a.amazonCategory] < amazonCategories[b.amazonCategory]) {
          return 1;
      }
      else if(amazonCategories[a.amazonCategory] === amazonCategories[b.amazonCategory] && a.amazonCategory > b.amazonCategory) {
          return 1;
      }
      return -1;
  });

  return necessaryFields;
}

var amazonResultProcessing = function(result) {
  console.log(JSON.stringify(result));

  if (result.ItemLookupResponse.Items[0].Item){
    if (result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].ISBN !== undefined) {
          // try {
            var necessaryFields = {
              price : (function() {return result.ItemLookupResponse.Items[0].Item[0].Offers[0].Offer ? result.ItemLookupResponse.Items[0].Item[0].Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
              title : result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Title[0],
              category : result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].ProductGroup[0],
              publisher : result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Publisher[0],
              image: result.ItemLookupResponse.Items[0].Item[0].MediumImage[0].URL[0],
              pageUrl: result.ItemLookupResponse.Items[0].Item[0].DetailPageURL[0],
              publicationDate: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].PublicationDate[0],
              pages: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].NumberOfPages[0],
              ean: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].EAN[0],
              binding: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Binding[0],
              // authors: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author[0]
              authors: (function() {
                if (result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author) {
                  return result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author[0]
                } else {
                  return result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Creator[0]._
                }
              })()
            }
          // } catch(e) {console.log(e)}
          return necessaryFields;
        } else {
          throw new Meteor.Error("No match for this item. Are you sure you're scanning a Book?")
        }
  } else {
    console.log(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
    throw new Meteor.Error(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Message[0]);
  }
}

var amazonPriceSearch = function(barcode, callback) {
  OperationHelper = apac.OperationHelper;

  var opHelper = new OperationHelper({
    awsId:     'AKIAJ5R6HKU33B4DAF3A',
    awsSecret: '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',
    assocId:   'codefynecom06-20'
  });

  opHelper.execute('ItemLookup', {
    'SearchIndex': 'All',
    'Operation': 'ItemLookup',
    'ItemId': barcode,
    'IdType': 'ISBN',
    'ResponseGroup': ['ItemAttributes', 'Images', 'OfferListings'],
    'IncludeReviewsSummary': false,
    'VariationPage': 1
  }, callback )
}

var amazonItemSearch = function(keys, itemPage, callback) {
  OperationHelper = apac.OperationHelper;

  var opHelper = new OperationHelper({
    awsId:     'AKIAJ5R6HKU33B4DAF3A',
    awsSecret: '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',
    assocId:   'codefynecom06-20'
  });

  opHelper.execute('ItemSearch', {
      'SearchIndex': 'All',
      'Condition': 'New',
      'Keywords': keys,
      //'ResponseGroup': ['ItemAttributes', 'Medium', 'Offers'],
      'ResponseGroup': ['ItemAttributes', 'Medium'],
      'ItemPage': itemPage,
      'MinimumPrice': 100,
  }, callback);
}
