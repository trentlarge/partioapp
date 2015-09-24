  //SERVER FRESH START SEQUENCE
  Meteor.users.remove({});
  Products.remove({});
  Search.remove({});
  Connections.remove({});
  Transactions.remove({}); 
  Notifications.remove({});


  Connections.allow({
    insert: function () { return true; },
    update: function () { return true; },
    remove: function () { return true; }
  });
  // SERVER FRESH START SEQUENCE

// ServiceConfiguration.loginServiceConfiguration.remove({
//     service: "facebook"
// });

  Meteor.startup(function() {
    process.env.MAIL_URL="smtp://partio.missioncontrol%40gmail.com:partio2021@smtp.gmail.com:465/";

    Accounts.emailTemplates.from = 'partio.missioncontrol@gmail.com';

    Accounts.emailTemplates.siteName = 'partiO';

    Accounts.emailTemplates.verifyEmail.subject = function(user) {
      return 'Welcome to partiO!';
    };
    Accounts.emailTemplates.verifyEmail.text = function(user, url) {
      return "Hello there! \n\n" +
      "Welcome aboard partiO! \n" +
      "The things you own end up making money for you! Sounds familiar? Er..nevermind! To make this happen, it all starts with one link. \n" +
      "The one below. Click to verify and get sharing! \n\n" +
      url + "\n\n" +
      "For any queries or support, feel free to contact partio.missioncontrol@gmail.com \n" +
      "Best\n" +
      "partiO team"
    };
  });

SearchSource.defineSource('packages', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [{title: regExp},{authors: regExp},{ean: searchText}]};
    return Search.find(selector, options).fetch();
  } else {
    return Search.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {

  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

var sendNotification = function(toId, fromId, message, type) {
  Notifications.insert({
    toId: toId,
    fromId: fromId,
    message: message,
    read: false,
    timestamp: new Date(),
    type: type
  })
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

  'updateOfficialEmail': function(userId, college, email) {
    Meteor.users.update({"_id": userId}, {$set: {"emails": [{"address": email, "verified": false}], "profile.college": college}}, function(error) {
      if (!error) {
        Accounts.sendVerificationEmail(userId);
      }
    });
  },

  'submitRating': function(rating, personId, ratedBy) {
    Meteor.users.update({_id: personId}, {$push: {"profile.rating": rating}});
    var ratedByName = Meteor.users.findOne(ratedBy).profile.name;
    var message = 'You got a rating of ' + rating + ' from ' + ratedByName;

    sendPush(personId, message)
    sendNotification(personId, ratedBy, message, "info")

  },

  returnBook: function(connectionId) {
    var connect = Connections.findOne(connectionId);
    var borrowerName = Meteor.users.findOne(connect.requestor).profile.name;
     
    Connections.update({_id: connectionId}, {$set: {"state": "RETURN"}});

    var message = borrowerName + " wants to return the book " + connect.bookData.title;
    sendPush(connect.bookData.ownerId, message);
    sendNotification(connect.bookData.ownerId, connect.requestor, message, "info");
  },

  confirmReturn: function(searchId, connectionId) {
    var connect = Connections.findOne(connectionId);
    var ownerName = Meteor.users.findOne(connect.bookData.ownerId).profile.name;
    
    Search.update({_id: searchId}, {$inc: {qty: 1}});

    var message = ownerName + " confirmed your return of " + connect.bookData.title;
    sendPush(connect.requestor, message);
    sendNotification(connect.requestor, connect.bookData.ownerId, message, "info");
  },

  requestOwner: function(requestorId, productId, ownerId) {
    console.log(requestorId, productId, ownerId);

    var requestorName = Meteor.users.findOne(requestorId).profile.name;
    var book = Products.findOne(productId); 

    var connection = {
      requestor: requestorId,
      state: 'WAITING',
      requestDate: new Date(),
      borrowedDate: null,
      bookData: book,
      chat: [  ],
      meetupLocation: "Location not set",
      meetupLatLong: "Location not set"
    };

    Connections.insert(connection);
    
    var message = "<strong>" + requestorName + "</strong> sent you a request for " + book.title  
    sendPush(ownerId, message);
    sendNotification(ownerId, requestorId, message, "request");

    return true;

  },
  'ownerAccept': function(connectionId) {
    Meteor._sleepForMs(1000);
    console.log("changing status from Waiting to Payment");

    var connect = Connections.findOne(connectionId);
    var ownerName = Meteor.users.findOne(connect.bookData.ownerId).profile.name;
 
    Connections.remove({"bookData._id": connect.bookData._id, "requestor": {$ne: connect.requestor}});
    Connections.update({_id: connectionId}, {$set: {state: "PAYMENT"}});

    var message = ownerName + " <strong>accepted</strong> your request for " + connect.bookData.title; 
    sendPush(connect.requestor, message);
    sendNotification(connect.requestor, connect.bookData.ownerId, message, "approved");

    return true;
  },
  'payNow': function(payer) {
    console.log(payer);
    Meteor._sleepForMs(1000);
    Connections.update({_id: payer}, {$set: {state: "IN USE"}});
    return "yes, payment done"
  },
  'chargeCard': function(payerCustomerId, payerCardId, recipientAccountId, amount, connectionId, transactionsId, transactionsRecipientId) {
    this.unblock();
    console.log(payerCustomerId, payerCardId, recipientAccountId, amount, connectionId, transactionsId, transactionsRecipientId);
    var formattedAmount = (amount * 100).toFixed(0);

    try{
      var result = Stripe.charges.create({
        amount: formattedAmount,
        currency: "usd",
        customer: payerCustomerId,
        source: payerCardId,
        destination: recipientAccountId
      });

      console.log(result);
      if (result.status === 'succeeded') {
        var payerTrans = {
          date: result.created,
          productName: Connections.findOne(connectionId).bookData.title,
          paidAmount: result.amount/100
        }

        var recipientTrans = {
          date: result.created,
          productName: Connections.findOne(connectionId).bookData.title,
          receivedAmount: result.amount/100
        }

        Connections.update({_id: connectionId}, {$set: {state: "IN USE", payment: result}});
        Search.update({"ean": Connections.findOne(connectionId).bookData.ean}, {$inc: {qty: -1}})
        Transactions.update({_id: transactionsId}, {$push: {spending: payerTrans}});
        Transactions.update({_id: transactionsRecipientId}, {$push: {earning: recipientTrans}});

        var thisConnectionData = Connections.findOne(connectionId)
        var moneyGiver = Meteor.users.findOne(thisConnectionData.requestor).profile.name
        var message = 'You received a payment of <strong>$' + amount + '</strong> from ' + moneyGiver
        sendPush(thisConnectionData.bookData.ownerId, message);
        sendNotification(thisConnectionData.bookData.ownerId, thisConnectionData.requestor, message, "info")

      }

    } catch(e) {
      console.log(e);
    }
  },
  'createCustomer': function(MeteorUserId) {
    console.log("creating customer for stripe on server using this ID ---> "+MeteorUserId);
    this.unblock();
    try {
      var result = Stripe.customers.create({
        "description": MeteorUserId
      });
      console.log(result);
      if (result.id) {
        Meteor.users.update({"_id": MeteorUserId}, {$set: {"profile.customer": result}})
      }
    } catch(e) {
      // console.log(e);
      throw new Meteor.Error('Error while adding user as a customer to payment profile');
    }
  },
  'listCards': function() {
    this.unblock();
    try {
      var result = Stripe.customers.listCards('cus_6omXOz0ZAXVwrm');
      console.log(result);
    } catch(e){
      console.log(e)
    }
  },
  'addCard': function(tokenId, customerId, MeteorUserId) {
    console.log(tokenId, customerId, MeteorUserId);
    this.unblock();
    try {
      var result = Stripe.customers.createSource( customerId , tokenId);
      console.log(result);

      if (result.id) {
        var allCards = Stripe.customers.listCards(customerId);
        console.log(allCards);
        Meteor.users.update({"_id": MeteorUserId}, {$set: {"profile.cards": allCards}})
      }
    } catch(e) {
      console.log(e);
      throw new Meteor.Error('Error while adding card to account');
    }
  },
  'createStripeAccount': function(firstname, lastname, ssn, routingnumber, bankaccount, MeteorUserId) {
    this.unblock();

    try {
      var result = Stripe.accounts.create({
        "managed": true,
        "country": "US",
        "legal_entity[type]": "individual",
        "legal_entity[first_name]": firstname,
        "legal_entity[last_name]": lastname,
        "legal_entity[ssn_last_4]": ssn,
        // "legal_entity[address][line1]": "Some lane",
        // "legal_entity[address][city]": "San Francisco",
        // "legal_entity[address][state]": "TX",
        // "legal_entity[address][postal_code]": "12345",
        "tos_acceptance[date]": Math.floor(Date.now() / 1000),
        "tos_acceptance[ip]": "8.8.8.8",
        "bank_account[country]": "US",
        "bank_account[routing_number]": routingnumber,
        "bank_account[account_number]": bankaccount
      })

      console.log(result);
      if (result.id) {
        Meteor.users.update({"_id": MeteorUserId}, {$set: {"profile.stripeAccount": result}})
      }
      return true;
    }
    catch(error) {
      console.log(error)
      throw new Meteor.Error('Error while creating account');
    }
  },
  'createNAAAH': function() {
    this.unblock();
    try {
      // var result = Stripe.accounts.create({
      //   managed: true,
      //   country: 'US',
      //   email: 'mail.krishna@aol.com'
      // });

    // var result = Stripe.accounts.create({
    //   managed: true,
    //   country: 'US'
    // })

    // var result = Stripe.charges.create({
    //     amount: 5000,
    //     currency: 'usd',
    //     customer: 'cus_6oRs14YG2c4pYy',
    //     description: "new payment",
    //     destination: "acct_16akhXKN2gXXNyID",
    //     application_fee: 800,
    //     receipt_email: "nishanth.saka@gmail.com"
    //   });

    // var result = Stripe.customers.create({
    //   description: "this is tankampa's account",
    //   source: "tok_16al3yG9HDjn1DNAkYW0RRZZ"
    // })



    // var result = Stripe.accounts.retrieve({
    //   id: "acct_16akhXKN2gXXNyID"
    // });

    // var result = Stripe.accounts.update("acct_16akhXKN2gXXNyID", {
    //   // "legal_entity[dob[day]]": "02",
    //   // "legal_entity[dob[month]]": "11",
    //   // "legal_entity[dob[year]]": "1980",
    //   // "legal_entity[first_name]": "Tankampa",
    //   // "legal_entity[last_name]": "haha",
    //   // "tos_acceptance[date]": Math.floor(Date.now() / 1000),
    //   // "tos_acceptance[ip]": '123.123.9.1',
      // "bank_account[country]": 'US',
      // "bank_account[routing_number]": '110000000',
      // "bank_account[account_number]": '000123456789'
      // "legal_entity[ssn_last_4]": 1234,
      // "legal_entity[address][line1]": "Some lane",
      // "legal_entity[address][city]": "San Francisco",
      // "legal_entity[address][state]": "TX",
      // "legal_entity[address][postal_code]": "12345"
    //   }
    //   // "support_phone": "555-867-5309"
    // )

   var result = Stripe.accounts.create({
    "managed": true,
    "country": "US",
    "legal_entity[type]": "individual",
    "legal_entity[first_name]": "Test",
    "legal_entity[last_name]": "Man",
    "legal_entity[ssn_last_4]": 1234,
    "legal_entity[address][line1]": "Some lane",
    "legal_entity[address][city]": "San Francisco",
    "legal_entity[address][state]": "TX",
    "legal_entity[address][postal_code]": "12345",
    "tos_acceptance[date]": Math.floor(Date.now() / 1000),
    "tos_acceptance[ip]": "8.8.8.8",
    "bank_account[country]": "US",
    "bank_account[routing_number]": "110000000",
    "bank_account[account_number]": "000123456789"
   })

      console.log(result)
      return true;
    }
    catch(error) {
      console.log(error)
      throw new Meteor.Error('payment-failed', 'The payment failed');
    }
  }
})

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

amazonPriceSearch = function(barcode, callback) {
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





//   { 
//   statusCode: 200,
//   content: '{"access_token": "b82cad2ac582b2fe4bbc313aa7c9a9a528794bde7df025a7b8e0fd51e6773799", "expires_in": 5184000, "token_type": "bearer", "user": {"username": "gabriel-simoes", "first_name": "Gabriel", "last_name": "Simoes", "display_name": "Gabriel Simoes", "is_friend": false, "friends_count": 154, "is_active": true, "about": " ", "email": "gsimoes@rollins.edu", "phone": "14079511926", "profile_picture_url": "https://s3.amazonaws.com/venmo/no-image.gif", "friend_request": null, "is_blocked": false, "trust_request": null, "id": "1494475771740160877", "identity": null, "date_joined": "2014-08-24T23:36:35"}, "balance": "0.00", "refresh_token": "85e487232f4c28b4097eb4951912eb0439d75aefbe4d285ee2ab3f715811aeb9"}',
//   headers: 
//    { server: 'nginx',
//      date: 'Thu, 30 Jul 2015 14:25:50 GMT',
//      'content-type': 'application/json; charset=UTF-8',
//      'content-length': '711',
//      connection: 'close',
//      vary: 'Accept-Encoding',
//      'set-cookie': [ 'csrftoken2=d9a26966efc94d45a2856fe40f4928ad; Domain=.venmo.com; Path=/' ],
//      expires: 'Thu, 30 Jul 2015 14:25:49 GMT',
//      'cache-control': 'no-cache',
//      'strict-transport-security': 'max-age=31536000' },
//   data: 
//    { access_token: 'b82cad2ac582b2fe4bbc313aa7c9a9a528794bde7df025a7b8e0fd51e6773799',
//      expires_in: 5184000,
//      token_type: 'bearer',
//      user: 
//       { username: 'gabriel-simoes',
//         first_name: 'Gabriel',
//         last_name: 'Simoes',
//         display_name: 'Gabriel Simoes',
//         is_friend: false,
//         friends_count: 154,
//         is_active: true,
//         about: ' ',
//         email: 'gsimoes@rollins.edu',
//         phone: '14079511926',
//         profile_picture_url: 'https://s3.amazonaws.com/venmo/no-image.gif',
//         friend_request: null,
//         is_blocked: false,
//         trust_request: null,
//         id: '1494475771740160877',
//         identity: null,
//         date_joined: '2014-08-24T23:36:35' },
//      balance: '0.00',
//      refresh_token: '85e487232f4c28b4097eb4951912eb0439d75aefbe4d285ee2ab3f715811aeb9' } 
// }


















// amazonInitialTestData = function(callback) {
//   OperationHelper = apac.OperationHelper;

//   var opHelper = new OperationHelper({
//     awsId:     'AKIAJ5R6HKU33B4DAF3A',
//     awsSecret: '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',
//     assocId:   'codefynecom06-20'
//   });

//   opHelper.execute('ItemSearch', {
//     'SearchIndex': 'Blended',
//     'Operation': 'ItemSearch',
//     'Keywords': 'tesla',
//     'ResponseGroup': ['ItemAttributes', 'Images', 'OfferListings']
//   }, callback )
// }

// var productGroup = [];
// Products.find().map(function(eachProduct) {
//   productGroup.push(eachProduct.category);
// })

// photograph
// university
// college
// football

// Meteor.startup(function() {
//   Meteor.setTimeout(function() {
//     console.log('data dump attempt...');
//     var getInitialData =  Meteor.wrapAsync(amazonInitialTestData);
//     var result = getInitialData();
//     console.log(JSON.stringify(result));

//     var dump1 = result.ItemSearchResponse.Items[0].Item;
//     // console.log(dump1);

//     dump1.forEach(function(itemSet) {
//       console.log(itemSet);
//       if (itemSet.ItemAttributes && itemSet.MediumImage && itemSet.Offers) {
//           if (itemSet.ItemAttributes[0].ISBN !== undefined) {
//             var necessaryFields = {
//               price : (function() {return itemSet.Offers[0].Offer ? itemSet.Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
//               title : itemSet.ItemAttributes[0].Title[0],
//               category : itemSet.ItemAttributes[0].ProductGroup[0],
//               publisher : itemSet.ItemAttributes[0].Publisher[0],
//               image: itemSet.MediumImage[0].URL[0],
//               pageUrl: itemSet.DetailPageURL[0],
//               publicationDate: itemSet.ItemAttributes[0].PublicationDate[0],
//               pages: (function() {return itemSet.ItemAttributes[0].NumberOfPages ? itemSet.ItemAttributes[0].NumberOfPages[0] : "--"})(),
//               ean: itemSet.ItemAttributes[0].EAN[0],
//               binding: itemSet.ItemAttributes[0].Binding[0],
//               authors: (function() {return itemSet.ItemAttributes[0].Authors ? itemSet.ItemAttributes[0].Authors[0] : "--"})()
//             }
//             console.log(necessaryFields);
//             var customPrice = necessaryFields.price.split("$")[1];
//             var insertData = _.extend(necessaryFields, {
//               "ownerId": "DbRr7gwsFk5gPcPvq",
//               "customPrice": (Number(customPrice)/5).toFixed(2)
//             });
//             Products.insert(insertData);

//           } else {
//             var necessaryFields = {
//               price : (function() {return itemSet.Offers[0].Offer ? itemSet.Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
//               title : itemSet.ItemAttributes[0].Title[0],
//               category : itemSet.ItemAttributes[0].ProductGroup[0],
//               manufacturer : (function() {return itemSet.ItemAttributes[0].Manufacturer ? itemSet.ItemAttributes[0].Manufacturer[0] : "--"})(),
//               brand : (function() {return itemSet.ItemAttributes[0].Brand ? itemSet.ItemAttributes[0].Brand[0] : "--"})(),
//               image: itemSet.MediumImage[0].URL[0],
//               asin: itemSet.ASIN[0],
//               pageUrl: itemSet.DetailPageURL[0],
//               model: (function() {return itemSet.ItemAttributes[0].Model ? itemSet.ItemAttributes[0].Model[0] : "--"})()
//             }
//             console.log(necessaryFields);
//             var customPrice = necessaryFields.price.split("$")[1];
//             var insertData = _.extend(necessaryFields, {
//               "ownerId": "DbRr7gwsFk5gPcPvq",
//               "customPrice": (Number(customPrice)/5).toFixed(2)
//             });
//             Products.insert(insertData);
//           }
//       } else {
//         return;
//       }
//     })


//   }, 5000)
// })

