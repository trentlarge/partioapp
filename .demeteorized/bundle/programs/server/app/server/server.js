(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/server.js                                                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
//SERVER FRESH START SEQUENCE                                          //
// Meteor.users.remove({});                                            //
// Products.remove({});                                                //
// Search.remove({});                                                  //
// Connections.remove({});                                             //
// Transactions.remove({});                                            //
// Notifications.remove({});                                           //
                                                                       //
Connections.allow({                                                    // 10
  insert: function () {                                                // 11
    return true;                                                       // 11
  },                                                                   //
  update: function () {                                                // 12
    return true;                                                       // 12
  },                                                                   //
  remove: function () {                                                // 13
    return true;                                                       // 13
  }                                                                    //
});                                                                    //
Meteor.users.allow({                                                   // 15
  insert: function () {                                                // 16
    return true;                                                       // 16
  },                                                                   //
  update: function () {                                                // 17
    return true;                                                       // 17
  },                                                                   //
  remove: function () {                                                // 18
    return true;                                                       // 18
  }                                                                    //
});                                                                    //
// SERVER FRESH START SEQUENCE                                         //
                                                                       //
// ServiceConfiguration.loginServiceConfiguration.remove({             //
//     service: "facebook"                                             //
// });                                                                 //
                                                                       //
Meteor.startup(function () {                                           // 26
  process.env.MAIL_URL = "smtp://partio.missioncontrol%40gmail.com:partio2021@smtp.gmail.com:465/";
                                                                       //
  Accounts.emailTemplates.from = 'partio.missioncontrol@gmail.com';    // 29
                                                                       //
  Accounts.emailTemplates.siteName = 'partiO';                         // 31
                                                                       //
  Accounts.emailTemplates.verifyEmail.subject = function (user) {      // 33
    return 'Welcome to partiO!';                                       // 34
  };                                                                   //
  Accounts.emailTemplates.verifyEmail.text = function (user, url) {    // 36
    return "Hello there! \n\n" + "Welcome aboard partiO! \n" + "The things you own end up making money for you! Sounds familiar? Er..nevermind! To make this happen, it all starts with one link. \n" + "The one below. Click to verify and get sharing! \n\n" + url + "\n\n" + "For any queries or support, feel free to contact partio.missioncontrol@gmail.com \n" + "Best\n" + "partiO team";
  };                                                                   //
                                                                       //
  // Stripe = StripeSync('sk_test_RBrpczGtVbB1tSaG66gglMTH');          //
});                                                                    //
                                                                       //
SearchSource.defineSource('packages', function (searchText, options) {
  var options = { sort: { isoScore: -1 }, limit: 20 };                 // 52
                                                                       //
  if (searchText) {                                                    // 54
    var regExp = buildRegExp(searchText);                              // 55
    var selector = { $or: [{ title: regExp }, { authors: regExp }, { ean: searchText }] };
    return Search.find(selector, options).fetch();                     // 57
  } else {                                                             //
    return Search.find({}, options).fetch();                           // 59
  }                                                                    //
});                                                                    //
                                                                       //
function buildRegExp(searchText) {                                     // 63
                                                                       //
  var parts = searchText.trim().split(/[ \-\:]+/);                     // 65
  return new RegExp("(" + parts.join('|') + ")", "ig");                // 66
}                                                                      //
                                                                       //
var sendNotification = function (toId, fromId, message, type) {        // 69
  Notifications.insert({                                               // 70
    toId: toId,                                                        // 71
    fromId: fromId,                                                    // 72
    message: message,                                                  // 73
    read: false,                                                       // 74
    timestamp: new Date(),                                             // 75
    type: type                                                         // 76
  });                                                                  //
};                                                                     //
                                                                       //
var sendPush = function (toId, message) {                              // 80
  Push.send({                                                          // 81
    from: 'partiO',                                                    // 82
    title: 'New activity on partiO',                                   // 83
    text: message,                                                     // 84
    badge: 1,                                                          // 85
    sound: 'check',                                                    // 86
    query: {                                                           // 87
      userId: toId                                                     // 88
    }                                                                  //
  });                                                                  //
};                                                                     //
                                                                       //
Meteor.methods({                                                       // 95
  priceFromAmazon: function (barcode) {                                // 96
    // var originalFormat = format;                                    //
    var originalBarcode = barcode;                                     // 98
    console.log("originalBarcode: " + originalBarcode);                // 99
    var getAmazonPriceSearchSynchronously = Meteor.wrapAsync(amazonPriceSearch);
    var result = getAmazonPriceSearchSynchronously(barcode);           // 101
                                                                       //
    if (result.html && result.html.body[0].b[0] === "Http/1.1 Service Unavailable") {
      console.log(result.html.body[0].b[0]);                           // 104
      throw new Meteor.Error("Error from Amazon - Service Unavailable");
    } else {                                                           //
      if (result.ItemLookupResponse.Items[0].Item && result.ItemLookupResponse.Items[0].Request[0].IsValid[0] === "True") {
        return amazonResultProcessing(result);                         // 108
      } else {                                                         //
        console.log(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
        throw new Meteor.Error(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
      }                                                                //
    }                                                                  //
  },                                                                   //
                                                                       //
  'updateOfficialEmail': function (userId, college, email) {           // 116
    Meteor.users.update({ "_id": userId }, { $set: { "emails": [{ "address": email, "verified": false }], "profile.college": college } }, function (error) {
      if (!error) {                                                    // 118
        Accounts.sendVerificationEmail(userId);                        // 119
      }                                                                //
    });                                                                //
  },                                                                   //
                                                                       //
  'submitRating': function (rating, personId, ratedBy) {               // 124
    Meteor.users.update({ _id: personId }, { $push: { "profile.rating": rating } });
    var ratedByName = Meteor.users.findOne(ratedBy).profile.name;      // 126
    var message = 'You got a rating of ' + rating + ' from ' + ratedByName;
                                                                       //
    sendPush(personId, message);                                       // 129
    sendNotification(personId, ratedBy, message, "info");              // 130
  },                                                                   //
                                                                       //
  returnBook: function (connectionId) {                                // 134
    var connect = Connections.findOne(connectionId);                   // 135
    var borrowerName = Meteor.users.findOne(connect.requestor).profile.name;
                                                                       //
    Connections.update({ _id: connectionId }, { $set: { "state": "RETURN" } });
                                                                       //
    var message = borrowerName + " wants to return the book " + connect.bookData.title;
    sendPush(connect.bookData.ownerId, message);                       // 141
    sendNotification(connect.bookData.ownerId, connect.requestor, message, "info");
  },                                                                   //
                                                                       //
  confirmReturn: function (searchId, connectionId) {                   // 145
    var connect = Connections.findOne(connectionId);                   // 146
    var ownerName = Meteor.users.findOne(connect.bookData.ownerId).profile.name;
                                                                       //
    Search.update({ _id: searchId }, { $inc: { qty: 1 } });            // 149
                                                                       //
    var message = ownerName + " confirmed your return of " + connect.bookData.title;
    sendPush(connect.requestor, message);                              // 152
    sendNotification(connect.requestor, connect.bookData.ownerId, message, "info");
  },                                                                   //
                                                                       //
  requestOwner: function (requestorId, productId, ownerId) {           // 156
    console.log(requestorId, productId, ownerId);                      // 157
                                                                       //
    var requestorName = Meteor.users.findOne(requestorId).profile.name;
    var book = Products.findOne(productId);                            // 160
                                                                       //
    var connection = {                                                 // 162
      requestor: requestorId,                                          // 163
      state: 'WAITING',                                                // 164
      requestDate: new Date(),                                         // 165
      borrowedDate: null,                                              // 166
      bookData: book,                                                  // 167
      chat: [],                                                        // 168
      meetupLocation: "Location not set",                              // 169
      meetupLatLong: "Location not set"                                // 170
    };                                                                 //
                                                                       //
    Connections.insert(connection);                                    // 173
                                                                       //
    var message = requestorName + " sent you a request for " + book.title;
    sendPush(ownerId, message);                                        // 176
    sendNotification(ownerId, requestorId, message, "request");        // 177
                                                                       //
    return true;                                                       // 179
  },                                                                   //
  'ownerAccept': function (connectionId) {                             // 182
    Meteor._sleepForMs(1000);                                          // 183
    console.log("changing status from Waiting to Payment");            // 184
                                                                       //
    var connect = Connections.findOne(connectionId);                   // 186
    var ownerName = Meteor.users.findOne(connect.bookData.ownerId).profile.name;
                                                                       //
    Connections.remove({ "bookData._id": connect.bookData._id, "requestor": { $ne: connect.requestor } });
    Connections.update({ _id: connectionId }, { $set: { state: "PAYMENT" } });
                                                                       //
    var message = ownerName + " accepted your request for " + connect.bookData.title;
    sendPush(connect.requestor, message);                              // 193
    sendNotification(connect.requestor, connect.bookData.ownerId, message, "approved");
                                                                       //
    return true;                                                       // 196
  },                                                                   //
  'ownerDecline': function (connectionId) {                            // 198
    Meteor._sleepForMs(1000);                                          // 199
                                                                       //
    var connect = Connections.findOne(connectionId);                   // 201
    var ownerName = Meteor.users.findOne(connect.bookData.ownerId).profile.name;
                                                                       //
    var message = "Your request for " + connect.bookData.title + " has been declined.";
    sendPush(connect.requestor, message);                              // 205
    sendNotification(connect.requestor, connect.bookData.ownerId, message, "declined");
                                                                       //
    Connections.remove(connectionId);                                  // 208
                                                                       //
    return true;                                                       // 210
  },                                                                   //
  'payNow': function (payer) {                                         // 212
    console.log(payer);                                                // 213
    Meteor._sleepForMs(1000);                                          // 214
    Connections.update({ _id: payer }, { $set: { state: "IN USE" } });
    return "yes, payment done";                                        // 216
  },                                                                   //
  'chargeCard': function (payerCustomerId, payerCardId, recipientDebitId, amount, connectionId, transactionsId, transactionsRecipientId) {
    this.unblock();                                                    // 219
    console.log(payerCustomerId, payerCardId, recipientDebitId, amount, connectionId, transactionsId, transactionsRecipientId);
    var formattedAmount = (amount * 100).toFixed(0);                   // 221
                                                                       //
    try {                                                              // 223
      var result = Stripe.charges.create({                             // 224
        amount: formattedAmount,                                       // 225
        currency: "usd",                                               // 226
        customer: payerCustomerId,                                     // 227
        source: payerCardId,                                           // 228
        destination: recipientDebitId                                  // 229
      });                                                              //
                                                                       //
      console.log(result);                                             // 232
      if (result.status === 'succeeded') {                             // 233
        var payerTrans = {                                             // 234
          date: result.created,                                        // 235
          productName: Connections.findOne(connectionId).bookData.title,
          paidAmount: result.amount / 100                              // 237
        };                                                             //
                                                                       //
        var recipientTrans = {                                         // 240
          date: result.created,                                        // 241
          productName: Connections.findOne(connectionId).bookData.title,
          receivedAmount: result.amount / 100                          // 243
        };                                                             //
                                                                       //
        Connections.update({ _id: connectionId }, { $set: { state: "IN USE", payment: result } });
        Search.update({ "ean": Connections.findOne(connectionId).bookData.ean }, { $inc: { qty: -1 } });
        Transactions.update({ _id: transactionsId }, { $push: { spending: payerTrans } });
        Transactions.update({ _id: transactionsRecipientId }, { $push: { earning: recipientTrans } });
                                                                       //
        var thisConnectionData = Connections.findOne(connectionId);    // 251
        var moneyGiver = Meteor.users.findOne(thisConnectionData.requestor).profile.name;
        var message = 'You received a payment of $' + amount + ' from ' + moneyGiver;
        sendPush(thisConnectionData.bookData.ownerId, message);        // 254
        sendNotification(thisConnectionData.bookData.ownerId, thisConnectionData.requestor, message, "info");
      }                                                                //
    } catch (e) {                                                      //
      console.log(e);                                                  // 260
    }                                                                  //
  },                                                                   //
  'createCustomer': function (MeteorUserId) {                          // 263
    console.log("creating customer for stripe on server using this ID ---> " + MeteorUserId);
    this.unblock();                                                    // 265
    try {                                                              // 266
      var result = Stripe.customers.create({                           // 267
        "description": MeteorUserId                                    // 268
      });                                                              //
      console.log(result);                                             // 270
      if (result.id) {                                                 // 271
        Meteor.users.update({ "_id": MeteorUserId }, { $set: { "profile.customer": result } });
      }                                                                //
    } catch (e) {                                                      //
      // console.log(e);                                               //
      throw new Meteor.Error('Error while adding user as a customer to payment profile');
    }                                                                  //
  },                                                                   //
  'listCards': function () {                                           // 279
    this.unblock();                                                    // 280
    try {                                                              // 281
      var result = Stripe.customers.listCards('cus_6omXOz0ZAXVwrm');   // 282
      console.log(result);                                             // 283
    } catch (e) {                                                      //
      console.log(e);                                                  // 285
    }                                                                  //
  },                                                                   //
                                                                       //
  'addPaymentCard': function (tokenId, customerId, MeteorUserId) {     // 289
    console.log(tokenId, customerId, MeteorUserId);                    // 290
    this.unblock();                                                    // 291
    try {                                                              // 292
      var result = Stripe.customers.createSource(customerId, tokenId);
      console.log(result);                                             // 294
                                                                       //
      if (result.id) {                                                 // 296
        var allCards = Stripe.customers.listCards(customerId);         // 297
        console.log(allCards);                                         // 298
        Meteor.users.update({ "_id": MeteorUserId }, { $set: { "profile.cards": allCards } });
      }                                                                //
    } catch (e) {                                                      //
      console.log(e);                                                  // 302
      throw new Meteor.Error('Error while adding card to account');    // 303
    }                                                                  //
  },                                                                   //
                                                                       //
  'addDebitCard': function (tokenId, stripeAccountId, MeteorUserId) {  // 307
    console.log(tokenId, stripeAccountId, MeteorUserId);               // 308
    this.unblock();                                                    // 309
    try {                                                              // 310
                                                                       //
      var cardToken = Stripe.tokens.create({                           // 312
        "card[number]": '4000056655665556',                            // 313
        "card[exp_month]": 12,                                         // 314
        "card[exp_year]": 2016,                                        // 315
        "card[cvc]": '123',                                            // 316
        "card[currency]": 'usd'                                        // 317
      });                                                              //
      console.log(cardToken);                                          // 319
                                                                       //
      var result = Stripe.accounts.update(stripeAccountId, {           // 321
        external_account: cardToken.id                                 // 322
      });                                                              //
                                                                       //
      if (result.id) {                                                 // 325
        Meteor.users.update({ "_id": MeteorUserId }, { $set: { "profile.payoutCard": result } });
      }                                                                //
    } catch (e) {                                                      //
      console.log(e);                                                  // 329
      throw new Meteor.Error('Error while adding card to account');    // 330
    }                                                                  //
  },                                                                   //
                                                                       //
  'createDebitAccount': function (MeteorUserId) {                      // 334
    var email = Meteor.users.findOne(MeteorUserId).profile.email;      // 335
    this.unblock();                                                    // 336
                                                                       //
    if (!Meteor.users.findOne(MeteorUserId).profile.stripeAccount) {   // 338
      try {                                                            // 339
        var result = Stripe.accounts.create({                          // 340
          managed: true,                                               // 341
          country: 'US',                                               // 342
          email: email                                                 // 343
        });                                                            //
        console.log(result);                                           // 345
                                                                       //
        if (result.id) {                                               // 347
          Meteor.users.update({ "_id": MeteorUserId }, { $set: { "profile.stripeAccount": result } });
        }                                                              //
      } catch (error) {                                                //
        console.log(error);                                            // 351
      }                                                                //
    } else {                                                           //
      console.log("Stripe Account already exists");                    // 354
      return true;                                                     // 355
    }                                                                  //
  },                                                                   //
                                                                       //
  'createStripeAccount': function (firstname, lastname, ssn, routingnumber, bankaccount, MeteorUserId) {
    this.unblock();                                                    // 360
                                                                       //
    try {                                                              // 362
      var result = Stripe.accounts.create({                            // 363
        "managed": true,                                               // 364
        "country": "US",                                               // 365
        "legal_entity[type]": "individual",                            // 366
        "legal_entity[first_name]": firstname,                         // 367
        "legal_entity[last_name]": lastname,                           // 368
        "legal_entity[ssn_last_4]": ssn,                               // 369
        // "legal_entity[address][line1]": "Some lane",                //
        // "legal_entity[address][city]": "San Francisco",             //
        // "legal_entity[address][state]": "TX",                       //
        // "legal_entity[address][postal_code]": "12345",              //
        "tos_acceptance[date]": Math.floor(Date.now() / 1000),         // 374
        "tos_acceptance[ip]": "8.8.8.8",                               // 375
        "bank_account[country]": "US",                                 // 376
        "bank_account[routing_number]": routingnumber,                 // 377
        "bank_account[account_number]": bankaccount                    // 378
      });                                                              //
                                                                       //
      console.log(result);                                             // 381
      if (result.id) {                                                 // 382
        Meteor.users.update({ "_id": MeteorUserId }, { $set: { "profile.stripeAccount": result } });
      }                                                                //
      return true;                                                     // 385
    } catch (error) {                                                  //
      console.log(error);                                              // 388
      throw new Meteor.Error('Error while creating account');          // 389
    }                                                                  //
  },                                                                   //
  'camFindCall': function (argImageData) {                             // 392
                                                                       //
    if (!argImageData) {                                               // 394
      console.log('error!');                                           // 396
    }                                                                  //
                                                                       //
    HTTP.post('https://camfind.p.mashape.com/image_requests', {        // 399
      "headers": {                                                     // 401
        "X-Mashape-Key": "7W5OJWzlcsmshYSMTJW8yE4L2mJQp1cuOVKjsneO6N0wPTpaS1"
      },                                                               //
      "params": {                                                      // 405
        "image_request[remote_image_url]": "http://logok.org/wp-content/uploads/2014/03/Air-Jordan-Nike-Jumpman-logo.png",
        // "image_request[image]" : argImageData,                      //
        "image_request[locale]": "en_US"                               // 409
      }                                                                //
    }, function (error, response) {                                    //
      if (!error) {                                                    // 414
        console.log('camFindCall: ' + JSON.stringify(response));       // 416
      } else {                                                         //
        console.log('camFindCall error: ' + error);                    // 420
      }                                                                //
    });                                                                //
  },                                                                   //
  'createNAAAH': function () {                                         // 426
    this.unblock();                                                    // 427
    try {                                                              // 428
      // var result = Stripe.accounts.create({                         //
      //   managed: true,                                              //
      //   country: 'US',                                              //
      //   email: 'mail.krishna@aol.com'                               //
      // });                                                           //
                                                                       //
      // var result = Stripe.accounts.create({                         //
      //   managed: true,                                              //
      //   country: 'US'                                               //
      // })                                                            //
                                                                       //
      // var result = Stripe.charges.create({                          //
      //     amount: 5000,                                             //
      //     currency: 'usd',                                          //
      //     customer: 'cus_6oRs14YG2c4pYy',                           //
      //     description: "new payment",                               //
      //     destination: "acct_16akhXKN2gXXNyID",                     //
      //     application_fee: 800,                                     //
      //     receipt_email: "nishanth.saka@gmail.com"                  //
      //   });                                                         //
                                                                       //
      // var result = Stripe.customers.create({                        //
      //   description: "this is tankampa's account",                  //
      //   source: "tok_16al3yG9HDjn1DNAkYW0RRZZ"                      //
      // })                                                            //
                                                                       //
      // var result = Stripe.accounts.retrieve({                       //
      //   id: "acct_16akhXKN2gXXNyID"                                 //
      // });                                                           //
                                                                       //
      // var result = Stripe.accounts.update("acct_16akhXKN2gXXNyID", {
      //   // "legal_entity[dob[day]]": "02",                          //
      //   // "legal_entity[dob[month]]": "11",                        //
      //   // "legal_entity[dob[year]]": "1980",                       //
      //   // "legal_entity[first_name]": "Tankampa",                  //
      //   // "legal_entity[last_name]": "haha",                       //
      //   // "tos_acceptance[date]": Math.floor(Date.now() / 1000),   //
      //   // "tos_acceptance[ip]": '123.123.9.1',                     //
      // "bank_account[country]": 'US',                                //
      // "bank_account[routing_number]": '110000000',                  //
      // "bank_account[account_number]": '000123456789'                //
      // "legal_entity[ssn_last_4]": 1234,                             //
      // "legal_entity[address][line1]": "Some lane",                  //
      // "legal_entity[address][city]": "San Francisco",               //
      // "legal_entity[address][state]": "TX",                         //
      // "legal_entity[address][postal_code]": "12345"                 //
      //   }                                                           //
      //   // "support_phone": "555-867-5309"                          //
      // )                                                             //
                                                                       //
      var result = Stripe.accounts.create({                            // 481
        "managed": true,                                               // 482
        "country": "US",                                               // 483
        "legal_entity[type]": "individual",                            // 484
        "legal_entity[first_name]": "Test",                            // 485
        "legal_entity[last_name]": "Man",                              // 486
        "legal_entity[ssn_last_4]": 1234,                              // 487
        "legal_entity[address][line1]": "Some lane",                   // 488
        "legal_entity[address][city]": "San Francisco",                // 489
        "legal_entity[address][state]": "TX",                          // 490
        "legal_entity[address][postal_code]": "12345",                 // 491
        "tos_acceptance[date]": Math.floor(Date.now() / 1000),         // 492
        "tos_acceptance[ip]": "8.8.8.8",                               // 493
        "bank_account[country]": "US",                                 // 494
        "bank_account[routing_number]": "110000000",                   // 495
        "bank_account[account_number]": "000123456789"                 // 496
      });                                                              //
                                                                       //
      console.log(result);                                             // 499
      return true;                                                     // 500
    } catch (error) {                                                  //
      console.log(error);                                              // 503
      throw new Meteor.Error('payment-failed', 'The payment failed');  // 504
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
var amazonResultProcessing = function (result) {                       // 511
  console.log(JSON.stringify(result));                                 // 512
                                                                       //
  if (result.ItemLookupResponse.Items[0].Item) {                       // 514
    if (result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].ISBN !== undefined) {
      // try {                                                         //
      var necessaryFields = {                                          // 517
        price: (function () {                                          // 518
          return result.ItemLookupResponse.Items[0].Item[0].Offers[0].Offer ? result.ItemLookupResponse.Items[0].Item[0].Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--";
        })(),                                                          //
        title: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Title[0],
        category: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].ProductGroup[0],
        publisher: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Publisher[0],
        image: result.ItemLookupResponse.Items[0].Item[0].MediumImage[0].URL[0],
        pageUrl: result.ItemLookupResponse.Items[0].Item[0].DetailPageURL[0],
        publicationDate: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].PublicationDate[0],
        pages: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].NumberOfPages[0],
        ean: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].EAN[0],
        binding: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Binding[0],
        // authors: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author[0]
        authors: (function () {                                        // 529
          if (result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author) {
            return result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author[0];
          } else {                                                     //
            return result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Creator[0]._;
          }                                                            //
        })()                                                           //
      };                                                               //
      // } catch(e) {console.log(e)}                                   //
      return necessaryFields;                                          // 538
    } else {                                                           //
      throw new Meteor.Error("No match for this item. Are you sure you're scanning a Book?");
    }                                                                  //
  } else {                                                             //
    console.log(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
    throw new Meteor.Error(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Message[0]);
  }                                                                    //
};                                                                     //
                                                                       //
amazonPriceSearch = function (barcode, callback) {                     // 548
  OperationHelper = apac.OperationHelper;                              // 549
                                                                       //
  var opHelper = new OperationHelper({                                 // 551
    awsId: 'AKIAJ5R6HKU33B4DAF3A',                                     // 552
    awsSecret: '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',             // 553
    assocId: 'codefynecom06-20'                                        // 554
  });                                                                  //
                                                                       //
  opHelper.execute('ItemLookup', {                                     // 557
    'SearchIndex': 'All',                                              // 558
    'Operation': 'ItemLookup',                                         // 559
    'ItemId': barcode,                                                 // 560
    'IdType': 'ISBN',                                                  // 561
    'ResponseGroup': ['ItemAttributes', 'Images', 'OfferListings'],    // 562
    'IncludeReviewsSummary': false,                                    // 563
    'VariationPage': 1                                                 // 564
  }, callback);                                                        //
};                                                                     //
                                                                       //
//   {                                                                 //
//   statusCode: 200,                                                  //
//   content: '{"access_token": "b82cad2ac582b2fe4bbc313aa7c9a9a528794bde7df025a7b8e0fd51e6773799", "expires_in": 5184000, "token_type": "bearer", "user": {"username": "gabriel-simoes", "first_name": "Gabriel", "last_name": "Simoes", "display_name": "Gabriel Simoes", "is_friend": false, "friends_count": 154, "is_active": true, "about": " ", "email": "gsimoes@rollins.edu", "phone": "14079511926", "profile_picture_url": "https://s3.amazonaws.com/venmo/no-image.gif", "friend_request": null, "is_blocked": false, "trust_request": null, "id": "1494475771740160877", "identity": null, "date_joined": "2014-08-24T23:36:35"}, "balance": "0.00", "refresh_token": "85e487232f4c28b4097eb4951912eb0439d75aefbe4d285ee2ab3f715811aeb9"}',
//   headers:                                                          //
//    { server: 'nginx',                                               //
//      date: 'Thu, 30 Jul 2015 14:25:50 GMT',                         //
//      'content-type': 'application/json; charset=UTF-8',             //
//      'content-length': '711',                                       //
//      connection: 'close',                                           //
//      vary: 'Accept-Encoding',                                       //
//      'set-cookie': [ 'csrftoken2=d9a26966efc94d45a2856fe40f4928ad; Domain=.venmo.com; Path=/' ],
//      expires: 'Thu, 30 Jul 2015 14:25:49 GMT',                      //
//      'cache-control': 'no-cache',                                   //
//      'strict-transport-security': 'max-age=31536000' },             //
//   data:                                                             //
//    { access_token: 'b82cad2ac582b2fe4bbc313aa7c9a9a528794bde7df025a7b8e0fd51e6773799',
//      expires_in: 5184000,                                           //
//      token_type: 'bearer',                                          //
//      user:                                                          //
//       { username: 'gabriel-simoes',                                 //
//         first_name: 'Gabriel',                                      //
//         last_name: 'Simoes',                                        //
//         display_name: 'Gabriel Simoes',                             //
//         is_friend: false,                                           //
//         friends_count: 154,                                         //
//         is_active: true,                                            //
//         about: ' ',                                                 //
//         email: 'gsimoes@rollins.edu',                               //
//         phone: '14079511926',                                       //
//         profile_picture_url: 'https://s3.amazonaws.com/venmo/no-image.gif',
//         friend_request: null,                                       //
//         is_blocked: false,                                          //
//         trust_request: null,                                        //
//         id: '1494475771740160877',                                  //
//         identity: null,                                             //
//         date_joined: '2014-08-24T23:36:35' },                       //
//      balance: '0.00',                                               //
//      refresh_token: '85e487232f4c28b4097eb4951912eb0439d75aefbe4d285ee2ab3f715811aeb9' }
// }                                                                   //
                                                                       //
// amazonInitialTestData = function(callback) {                        //
//   OperationHelper = apac.OperationHelper;                           //
                                                                       //
//   var opHelper = new OperationHelper({                              //
//     awsId:     'AKIAJ5R6HKU33B4DAF3A',                              //
//     awsSecret: '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',          //
//     assocId:   'codefynecom06-20'                                   //
//   });                                                               //
                                                                       //
//   opHelper.execute('ItemSearch', {                                  //
//     'SearchIndex': 'Blended',                                       //
//     'Operation': 'ItemSearch',                                      //
//     'Keywords': 'tesla',                                            //
//     'ResponseGroup': ['ItemAttributes', 'Images', 'OfferListings']  //
//   }, callback )                                                     //
// }                                                                   //
                                                                       //
// var productGroup = [];                                              //
// Products.find().map(function(eachProduct) {                         //
//   productGroup.push(eachProduct.category);                          //
// })                                                                  //
                                                                       //
// photograph                                                          //
// university                                                          //
// college                                                             //
// football                                                            //
                                                                       //
// Meteor.startup(function() {                                         //
//   Meteor.setTimeout(function() {                                    //
//     console.log('data dump attempt...');                            //
//     var getInitialData =  Meteor.wrapAsync(amazonInitialTestData);  //
//     var result = getInitialData();                                  //
//     console.log(JSON.stringify(result));                            //
                                                                       //
//     var dump1 = result.ItemSearchResponse.Items[0].Item;            //
//     // console.log(dump1);                                          //
                                                                       //
//     dump1.forEach(function(itemSet) {                               //
//       console.log(itemSet);                                         //
//       if (itemSet.ItemAttributes && itemSet.MediumImage && itemSet.Offers) {
//           if (itemSet.ItemAttributes[0].ISBN !== undefined) {       //
//             var necessaryFields = {                                 //
//               price : (function() {return itemSet.Offers[0].Offer ? itemSet.Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
//               title : itemSet.ItemAttributes[0].Title[0],           //
//               category : itemSet.ItemAttributes[0].ProductGroup[0],
//               publisher : itemSet.ItemAttributes[0].Publisher[0],   //
//               image: itemSet.MediumImage[0].URL[0],                 //
//               pageUrl: itemSet.DetailPageURL[0],                    //
//               publicationDate: itemSet.ItemAttributes[0].PublicationDate[0],
//               pages: (function() {return itemSet.ItemAttributes[0].NumberOfPages ? itemSet.ItemAttributes[0].NumberOfPages[0] : "--"})(),
//               ean: itemSet.ItemAttributes[0].EAN[0],                //
//               binding: itemSet.ItemAttributes[0].Binding[0],        //
//               authors: (function() {return itemSet.ItemAttributes[0].Authors ? itemSet.ItemAttributes[0].Authors[0] : "--"})()
//             }                                                       //
//             console.log(necessaryFields);                           //
//             var customPrice = necessaryFields.price.split("$")[1];  //
//             var insertData = _.extend(necessaryFields, {            //
//               "ownerId": "DbRr7gwsFk5gPcPvq",                       //
//               "customPrice": (Number(customPrice)/5).toFixed(2)     //
//             });                                                     //
//             Products.insert(insertData);                            //
                                                                       //
//           } else {                                                  //
//             var necessaryFields = {                                 //
//               price : (function() {return itemSet.Offers[0].Offer ? itemSet.Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
//               title : itemSet.ItemAttributes[0].Title[0],           //
//               category : itemSet.ItemAttributes[0].ProductGroup[0],
//               manufacturer : (function() {return itemSet.ItemAttributes[0].Manufacturer ? itemSet.ItemAttributes[0].Manufacturer[0] : "--"})(),
//               brand : (function() {return itemSet.ItemAttributes[0].Brand ? itemSet.ItemAttributes[0].Brand[0] : "--"})(),
//               image: itemSet.MediumImage[0].URL[0],                 //
//               asin: itemSet.ASIN[0],                                //
//               pageUrl: itemSet.DetailPageURL[0],                    //
//               model: (function() {return itemSet.ItemAttributes[0].Model ? itemSet.ItemAttributes[0].Model[0] : "--"})()
//             }                                                       //
//             console.log(necessaryFields);                           //
//             var customPrice = necessaryFields.price.split("$")[1];  //
//             var insertData = _.extend(necessaryFields, {            //
//               "ownerId": "DbRr7gwsFk5gPcPvq",                       //
//               "customPrice": (Number(customPrice)/5).toFixed(2)     //
//             });                                                     //
//             Products.insert(insertData);                            //
//           }                                                         //
//       } else {                                                      //
//         return;                                                     //
//       }                                                             //
//     })                                                              //
                                                                       //
//   }, 5000)                                                          //
// })                                                                  //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=server.js.map
