Meteor.methods({

// Account & STRIPE API (cards) -------------------------------------------------------------------
'checkStripeManaged': function() {
  var _userProfile = Meteor.user().profile;

  if (!_userProfile.stripeManaged) {
    var clientIp = this.connection.clientAddress;

    if(!_userProfile.birthDate) {
      throw new Meteor.Error("checkStripeManaged", "birthDate");
    }

    var date = _userProfile.birthDate;
    var dateBirth = date.split('/');

    var month = dateBirth[0];
    var day = dateBirth[1];
    var year = dateBirth[2];

    console.log('########ANIVERSARIO');
    console.log(_userProfile.birthDate);
    console.log(dateBirth[0]);
    console.log(dateBirth[1]);
    console.log(dateBirth[2]);

    var response = Async.runSync(function(done) {

      //Creating Stripe Managed Account
      Stripe.accounts.create({
        managed: true,
        country: 'US',
        email: _userProfile.email,
        "legal_entity[type]": "individual",
        "legal_entity[first_name]": _userProfile.name,
        "legal_entity[last_name]": 'Partio',
        "legal_entity[dob][day]": day,
        "legal_entity[dob][month]": month,
        "legal_entity[dob][year]": year,
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
  //var requestorManagedId = requestor.profile.stripeManaged;

  var owner = Meteor.users.findOne(connect.productData.ownerId);

  var amount = connect.borrowDetails.price.total;
  var formattedAmount = (amount * 100).toFixed(0);

  var response = Async.runSync(function(done) {
    Stripe.customers.retrieve(requestor.profile.stripeCustomer,
      Meteor.bindEnvironment(function (err, customer) {
        if(err) {
          done(err, false);
        }

        var payCardId = customer.default_source;

        Stripe.charges.create({
          amount: formattedAmount,
          currency: "usd",
          customer: requestor.profile.stripeCustomer,
          source: payCardId,
          description: requestor.profile.email+' paid to Partio' },
          Meteor.bindEnvironment(function (err, charge) {
            if(err) {
              done(err, false);
            }
            console.log('>>>>> [stripe] new charge to Partio ', charge);

            Connections.update({_id: connect._id}, {$set: {state: "IN USE", payment: charge}});

            var payerTrans = {
              date: charge.created,
              productName: connect.productData.title,
              paidAmount: charge.amount/100
            }

            var recipientTrans = {
              date: charge.created,
              productName: connect.productData.title,
              receivedAmount: charge.amount/100
            }

            Transactions.update({_id: requestor.profile.transactionsId }, {$push: {spending: payerTrans}});
            Transactions.update({_id: owner.profile.transactionsId }, {$push: {earning: recipientTrans}});

            var message = 'You received a payment of $' + amount + ' from ' + requestor.profile.name
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

'createTransactions': function(){
  console.log(' >>>>> creating new transactionsId')
  //Creating Transactions Id
  var userTransId = Transactions.insert({
    earning: [],
    spending: []
  });

    Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.transactionsId": userTransId}});
  },

});