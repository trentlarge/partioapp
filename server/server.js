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
    console.log('chamou updatePassword');
    Meteor.bindEnvironment(function(){
      Accounts.setPassword(userId, password, { logout: true });
      console.log('chamou updatePassword');
    },
    function (err) {
      console.log('failed to bind env: ', err);
    })
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
  'checkAccount': function() {
    if (!Meteor.user().profile.stripeAccount) {
      var clientIp = this.connection.clientAddress;

      var response = Async.runSync(function(done) {
        //Creating Stripe Account
        Stripe.accounts.create({
          managed: true,
          country: 'US',
          email: Meteor.user().profile.email,
          "legal_entity[type]": "individual",
          "legal_entity[first_name]": Meteor.user().profile.name,
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

          //Creating Transactions Id
          var userTransId = Transactions.insert({
            earning: [],
            spending: []
          });

          Meteor.users.update({"_id": Meteor.userId() }, {$set: {
            "profile.stripeAccount": result,
            "profile.transactionsId": userTransId
          }}, function(){
              done(false, true);
          })

        }));
      })

      return response.result;

    } else {
      console.log("('>>>> stripeAccount already exists");
      return true;
    }

  },

  'addCard': function(token) {
    console.log('>>>>> add card');

    if(!Meteor.user().profile.stripeAccount){
      throw new Meteor.Error("checkAccount", "missing stripeAccount");
    }

    var response = Async.runSync(function(done) {
      var stripeAccountId = Meteor.user().profile.stripeAccount.id;

      var result = Stripe.accounts.createExternalAccount( stripeAccountId, {
        external_account: token
      },  Meteor.bindEnvironment(function (error, result) {

        if(error) {
          done(error, false);
        }

        var cards = [];

        console.log('>>>> new card id: '+result.id)

        var userCards = Meteor.user().profile.cards;

        if(userCards) {
          cards = userCards;
        }

        cards.push(result);

        Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.cards": cards}}, function(){
          done(false, true);
        });
      }));
    })

    return response.result;
  },

  'saveDefaultCards': function(receiveCard, payCard){
    if(!receiveCard && !payCard) {
      return false;
    }

    var customerId = Meteor.user().profile.stripeAccount.id;

    var response = Async.runSync(function(done) {
      Stripe.accounts.updateExternalAccount(customerId, payCard.id,
        { default_for_currency: true },
        function(err, card) {
          if(err) {


            done(err, false);
          }

          console.log('()()()()()()()()() saveDefaultCards ()()()()()()()()()');
          console.log(err, card);
          done(false, true);
          // asynchronously called
        }
      );

    });

    return response.result;

    // try {
    //   if(payCard) {
    //
    //     Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.defaultPay": payCard }})
    //     //Stripe.customers.update(customerId, { default_source: payCard.id })
    //     //Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.customer.default_source": payCard.id }})
    //   }
    //
    //   if(receiveCard) {
    //     Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.defaultReceive": receiveCard }})
    //   }
    //
    //   //console.log(payCard,receiveCard);
    //
    //   return true;
    // } catch(e) {
    //   console.log(e);
    //   throw new Meteor.Error('Error while adding card to account');
    // }
  },

  'removeCard': function(cardId){
    console.log('>>>>> remove card '+cardId);

    if(!Meteor.user().profile.stripeAccount){
      throw new Meteor.Error("checkAccount", "missing stripeAccount");
    }

    var stripeAccountId = Meteor.user().profile.stripeAccount.id;

    var response = Async.runSync(function(done) {
      Stripe.accounts.deleteExternalAccount(stripeAccountId, cardId,
        Meteor.bindEnvironment(function (err, result) {
          if(err){
            done(err, false);
          }

          console.log(result);

          if(result) {
            if(Meteor.user().profile.defaultPay.id == cardId){
              Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.defaultPay": false}})
            }

            if(Meteor.user().profile.defaultReceive.id == cardId){
              Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.defaultReceive": false}})
            }

            var userCards = Meteor.user().profile.cards;
            var cards = [];

            userCards.map(function(item){
              if(item.id) {
                if(cardId != item.id) {
                  cards.push(item);
                }
              }
            })

            Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.cards": cards}}, function(){
              done(false, true);
            });

          } else {
            throw new Meteor.Error("some error when removing card");
          }
        })
      )
    });

    return response.result;

  },

  //not using but it works (in case of not saving cards on mongo, we can start from this)
  'listCards': function(){

    if(!Meteor.user().profile.stripeAccount) {
      return false;
    }

    var response = Async.runSync(function(done) {
      Stripe.accounts.listExternalAccounts(Meteor.user().profile.stripeAccount.id, {object: "card"},
      function(err, cards) {
        console.log(err, cards);
        done(err, cards.data);
      });
    });

    return response.result;
  },


  'chargeCard': function(token, connectionId) {
    this.unblock();
    var connect = Connections.findOne(connectionId);

    if(connect) {
        var requestor = Meteor.users.findOne(connect.requestor);
        var requestorCardId = requestor.profile.defaultPay.id;
        var requestorCustomerId = requestor.profile.customer.id;
        var requestorTransactionsId = requestor.profile.transactionsId;

        var owner = Meteor.users.findOne(connect.productData.ownerId);
        var ownerCardId = owner.profile.defaultReceive.id;
        var ownerCustomerId = owner.profile.customer.id;
        var ownerTransactionsId = owner.profile.transactionsId;

        var amount = connect.borrowDetails.price.total;
        var formattedAmount = (amount * 100).toFixed(0);result

        console.log('requestor ---------')
        console.log(requestorCardId, requestorCustomerId, requestorTransactionsId);
        console.log('owner ---------')
        console.log(ownerCardId, ownerCustomerId, ownerTransactionsId);
        console.log('total > '+formattedAmount)

        var charge = Stripe.charges.create({
          amount: formattedAmount,
          currency: "usd",
        //  customer: requestorCustomerId,
          source: requestor.profile.defaultPay.stripeToken.id,
        //  destination: requestorCardId
          description: requestor.profile.name+' paying to '+owner.profile.name
        });

        if (result.status === 'succeeded') {
          var requestorTransaction = {
            date: result.created,
            productName: connect.productData.title,
            paidAmount: result.amount/100
          }

          var ownerTransaction = {
            date: result.created,
            productName: connect.productData.title,
            receivedAmount: result.amount/100
          }

          Connections.update({_id: connect._id}, {$set: {state: "IN USE", payment: result}});
          Transactions.update({_id: requestorTransactionsId}, {$push: {spending: requestorTransaction}});
          Transactions.update({_id: ownerTransactionsId}, {$push: {earning: ownerTransaction}});

          var message = 'You received a payment of $' + amount + ' from ' + requestor.profile.name;

          sendPush(owner._id, message);
          sendNotification(owner._id, requestor._id, message, "info");

        } else {
          throw new Meteor.Error("some error when charging");
        }
    }
  },

  //'createCustomer': function(token) {
    //console.log("stripe_secret ---> "+Meteor.settings.env.STRIPE_SECRET);
    //this.unblock();

    //this.checkStripeAccount();

    // try {
    //   var result = Stripe.customers.create({
    //     "description": Meteor.userId()
    //   });
    //
    //   console.log(result);
    //   if (result.id) {
    //     Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.customer": result}})
    //   }
    // } catch(e) {
    //   console.log(e);
    //   throw new Meteor.Error('Error while adding user as a customer to payment profile');
    // }
  //},



  // 'saveDefaultCards': function(receiveCard, payCard){
  //   if(!receiveCard && !payCard) {
  //     return false;
  //   }
  //
  //   var customerId = Meteor.user().profile.customer.id;
  //
  //   console.log(Stripe.customers.retrieve(customerId));
  // },

  // 'setCard': function(cardId){
  //   if(!cardId) {
  //     return false;
  //   }
  //
  //   try {
  //
  //     var customerId = Meteor.user().profile.customer.id;
  //
  //     stripe.customers.retrieveCard(customerId, cardId, function(err, card) {
  //       console.log(card)
  //     });
  //
  //   } catch(e) {
  //     console.log(e);
  //     throw new Meteor.Error('Error while setting default card');
  //   }
  // },

  // 'addDebitCard': function(tokenId, stripeAccountId, MeteorUserId) {
  //   console.log(tokenId, stripeAccountId, MeteorUserId);
  //   this.unblock();
  //   try {
  //
  //     var cardToken = Stripe.tokens.create({
  //       "card[number]": '4000056655665556',
  //        "card[exp_month]": 12,
  //        "card[exp_year]": 2016,
  //        "card[cvc]": '321',
  //        "card[currency]": 'usd'
  //     });
  //     console.log(tokenId);
  //     console.log('##### TIPO DE CARTAO: ');
  //
  //     var result = Stripe.accounts.update( stripeAccountId, {
  //       external_account: cardToken
  //     });
  //
  //     console.log('####RESULT######');
  //     console.log(result);
  //
  //     if (result.id) {
  //       Meteor.users.update({"_id": MeteorUserId}, {$set: {"profile.payoutCard": result}})
  //
  //     }
  //   } catch(e) {
  //     console.log(e);
  //     throw new Meteor.Error('Error while adding card to account');
  //   }
  // },
  //
  // 'createDebitAccount': function(MeteorUserId) {
  //   var email = Meteor.users.findOne(MeteorUserId).profile.email;
  //   this.unblock();
  //
  //   if (! Meteor.users.findOne(MeteorUserId).profile.stripeAccount) {
  //     try {
  //       var result = Stripe.accounts.create({
  //         managed: true,
  //         country: 'US',
  //         email: email
  //       });
  //       console.log(result);
  //
  //       if (result.id) {
  //         Meteor.users.update({"_id": MeteorUserId}, {$set: {"profile.stripeAccount": result}})
  //       }
  //     } catch(error) {
  //       console.log(error)
  //     }
  //   } else {
  //     console.log("Stripe Account already exists");
  //     return true;
  //   }
  // },

  // 'createStripeAccount': function(firstname, lastname, ssn, routingnumber, bankaccount, MeteorUserId) {
  //   this.unblock();
  //
  //   try {
  //     var result = Stripe.accounts.create({
  //       "managed": true,
  //       "country": "US",
  //       "legal_entity[type]": "individual",
  //       "legal_entity[first_name]": firstname,
  //       "legal_entity[last_name]": lastname,
  //       "legal_entity[ssn_last_4]": ssn,
  //       // "legal_entity[address][line1]": "Some lane",
  //       // "legal_entity[address][city]": "San Francisco",
  //       // "legal_entity[address][state]": "TX",
  //       // "legal_entity[address][postal_code]": "12345",
  //       "tos_acceptance[date]": Math.floor(Date.now() / 1000),
  //       "tos_acceptance[ip]": "8.8.8.8",
  //       "bank_account[country]": "US",
  //       "bank_account[routing_number]": routingnumber,
  //       "bank_account[account_number]": bankaccount
  //     })
  //
  //     console.log(result);
  //     if (result.id) {
  //       Meteor.users.update({"_id": MeteorUserId}, {$set: {"profile.stripeAccount": result}})
  //     }
  //     return true;
  //   }
  //   catch(error) {
  //     console.log(error)
  //     throw new Meteor.Error('Error while creating account');
  //   }
  // },

  // 'createNAAAH': function() {
  //   this.unblock();
  //   try {
  //
  //    var result = Stripe.accounts.create({
  //     "managed": true,
  //     "country": "US",
  //     "legal_entity[type]": "individual",
  //     "legal_entity[first_name]": "Test",
  //     "legal_entity[last_name]": "Man",
  //     "legal_entity[ssn_last_4]": 1234,
  //     "legal_entity[address][line1]": "Some lane",
  //     "legal_entity[address][city]": "San Francisco",
  //     "legal_entity[address][state]": "TX",
  //     "legal_entity[address][postal_code]": "12345",
  //     "tos_acceptance[date]": Math.floor(Date.now() / 1000),
  //     "tos_acceptance[ip]": "8.8.8.8",
  //     "bank_account[country]": "US",
  //     "bank_account[routing_number]": "110000000",
  //     "bank_account[account_number]": "000123456789"
  //    })
  //
  //       console.log(result)
  //       return true;
  //     }
  //     catch(error) {
  //       console.log(error)
  //       throw new Meteor.Error('payment-failed', 'The payment failed');
  //     }
  //   },


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
