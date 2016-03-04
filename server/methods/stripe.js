Meteor.methods({
  // Account & STRIPE API (cards) -------------------------------------------------------------------
  'checkStripeManaged': function() {
    var _user = Meteor.user();

    if (!_user.secret.stripeManaged) {
      var clientIp = this.connection.clientAddress;

      if(!_user.profile.birthDate) {
        throw new Meteor.Error("checkStripeManaged", "Please update your birth date before to add a debit card.");
      }

      var date = _user.profile.birthDate;
      var dateBirth = date.split('/');

      var month = dateBirth[0];
      var day = dateBirth[1];
      var year = dateBirth[2];

      // var _name = _user.profile.name.trim();
      //     _name = _name.split(" ");

      // var _last_name = _name[_name.length-1];

      // _name.splice(_name.length-1, 1)
      // _name = _name.join(" ");

      var _name = _user.profile.name;
      var _last_name = 'PartioApp';

      var response = Async.runSync(function(done) {

        //Creating Stripe Managed Account
        Stripe.accounts.create({
          managed: true,
          country: 'US',
          email: _user.emails[0].address,
          "legal_entity[type]": "individual",
          "legal_entity[first_name]": _name,
          "legal_entity[last_name]": _last_name,
          "legal_entity[dob][day]": day,
          "legal_entity[dob][month]": month,
          "legal_entity[dob][year]": year,
          "tos_acceptance[date]": Math.floor(Date.now() / 1000),
          "tos_acceptance[ip]": clientIp,
          "metadata": {
            userId: _user._id,
            phone: _user.profile.mobile,
          }

        }, Meteor.bindEnvironment(function (error, result) {
          if(error) {
            done(error.message, false);
          }

          if(result) {
            Meteor.users.update({"_id":_user._id },
              {$set: { "secret.stripeManaged": result.id,
                       "secret.stripeAccountKeys": result.keys }},
              function(){
                done(false, true);
              }
            );
          }
        }));
      })

      if(response.error) {
        throw new Meteor.Error("checkStripeManaged", response.error);

      } else {
        return response.result;
      }

    } else {
      console.log(">>>> [stripe] stripeManaged already exists");
      return true;
    }
  },

  'checkStripeCustomer': function(){
    var _user = Meteor.user();

    if (!_user.secret.stripeCustomer) {
      var response = Async.runSync(function(done) {

        //Creating Stripe Customer Account
        Stripe.customers.create({ email: _user.emails[0].address,
                                  description: 'created by PartioApp',
                                  metadata: {
                                    userId: _user._id,
                                    name: _user.profile.name,
                                    phone: _user.profile.mobile,
                                  }
                                },
         Meteor.bindEnvironment(function (error, result) {
           if(error) {
             done(error.message, false);
           }

           if(result) {
             console.log('>>>> new stripeCustomer id: '+result.id)

             Meteor.users.update({"_id": _user._id }, {$set: {
               "secret.stripeCustomer": result.id,
             }}, function(){
                done(false, true);
             })
           }
         })
        );
      });

      if(response.error) {
        throw new Meteor.Error("checkStripeCustomer", response.error);

      } else {
        return response.result;
      }

    } else {
      console.log(">>>> [stripe] stripeCustomer already exists");
      return true;
    }
  },

  'addCustomerCard': function(token) {
    console.log('>>>>> [stripe] adding Customer card');

    var _user = Meteor.user();

    if(!_user.secret.stripeCustomer){
      throw new Meteor.Error("addCustomerCard", "missing stripeCustomer account");
    }

    var response = Async.runSync(function(done) {

      // generating own card Id to filter on stripeAPI
      var ownIdCard = Math.random().toString(36).substring(7);

      //Creating source to Customer Account
      Stripe.customers.createSource(
        _user.secret.stripeCustomer,
        { source: token,
          metadata: { idPartioCard: ownIdCard }},
        Meteor.bindEnvironment(function (error, customerCard) {
          if(error) {
            done(error.message, false);
          }

          if(customerCard) {
            console.log('>>>>> [stripe] new customer card ', customerCard.id);

            Meteor.users.update({"_id": _user._id }, {$set: {"secret.canBorrow": true }} , function() {
              done(false, true);
            });
          }
        })
      );
    })

    if(response.error) {
      throw new Meteor.Error("addCustomerCard", response.error);
    } else {
      return response.result;
    }
  },

  'addManagedCard': function(firstToken, secondToken) {
    console.log('>>>>> [stripe] adding Managed & Customer card');

    var _user = Meteor.user();

    if(!_user.secret.stripeCustomer){
      throw new Meteor.Error("addManagedCard", "missing stripeCustomer account");
    }

    if(!_user.secret.stripeManaged){
      throw new Meteor.Error("addManagedCard", "missing stripeManaged account");
    }

    var stripeManagedId = _user.secret.stripeManaged;
    var stripeCustomerId = _user.secret.stripeCustomer;

    var response = Async.runSync(function(done) {

      // generating own card Id to filter on stripeAPI
      var ownIdCard = Math.random().toString(36).substring(7);

      // Creating external_account to Managed Account
      Stripe.accounts.createExternalAccount(
        stripeManagedId, {  external_account: firstToken,
                            metadata: { idPartioCard: ownIdCard }},
        Meteor.bindEnvironment(function (error, managedCard) {
          if(error) {
            done(error.message, false);
          }

          if(managedCard) {
            console.log('>>>>> [stripe] new card to Managed account ', managedCard.id);

            //Creating source to Customer Account
            Stripe.customers.createSource(
              stripeCustomerId, { source: secondToken, metadata: { idPartioCard: ownIdCard }},
              Meteor.bindEnvironment(function (error, customerCard) {
                if(error) {
                  done(error.message, false);
                }

                if(customerCard) {
                  console.log('>>>>> [stripe] new customer card ', customerCard.id);
                  Meteor.users.update({"_id": _user._id }, {$set: {"secret.canBorrow": true, "secret.canShare": true}} , function() {
                    done(false, true);
                  });
                }
              })
            );
          }
        })
      );
    })

    if(response.error) {
      throw new Meteor.Error("addManagedCard", response.error);
    } else {
      return response.result;
    }
  },

  'getStripeCustomer': function(){
    var _user = Meteor.user();

    console.log('>>>>> [stripe] getting stripe CUSTOMER info from ', _user.emails[0].address);

    if(!_user.secret.stripeCustomer) {
      throw new Meteor.Error("getStripeCustomer", "missing stripeCustomer account");
    }

    var response = Async.runSync(function(done) {
      Stripe.customers.retrieve(_user.secret.stripeCustomer,
        Meteor.bindEnvironment(function (err, customer) {
          if(err) {
            done(err.message, false);
          }

          if(customer) {
            done(false, customer);
          }
        })
      );
    });

    if(response.error) {
      throw new Meteor.Error("getStripeCustomer", response.error);
    } else {
      return response.result;
    }
  },

  'getStripeManaged': function() {
    var _user = Meteor.user();
    console.log('>>>>> [stripe] getting stripe MANAGED info from ', _user.emails[0].address);

    if(!_user.secret.stripeManaged) {
      throw new Meteor.Error("getStripeCustomer", "missing stripeManaged account");
    }

    var response = Async.runSync(function(done) {
      Stripe.accounts.retrieve(_user.secret.stripeManaged,
        Meteor.bindEnvironment(function (err, account) {
           if(err) {
            done(err.message, false);
          }

          if(account) {
            done(false, account);
          }
        })
      );
    });

    if(response.error) {
      throw new Meteor.Error("getStripeManaged", response.error);
    } else {
      return response.result;
    }
  },

  'setDefaultCard': function(action, cardData){
    console.log('>>>>> [stripe] setDefaultCard');

    if(!cardData || !action) {
      throw new Meteor.Error("setDefaultCard", "missing params");
    }

    var _user = Meteor.user();

    // to 'pay', must be Stripe Customer account
    var response = Async.runSync(function(done) {
      if(action == 'pay') {

        //cardData.customerCardId;
        Stripe.customers.update(_user.secret.stripeCustomer,
          { default_source: cardData.customerCardId },
          Meteor.bindEnvironment(function (error, result) {
            if(error){
              done(error.message, false);
            } 

            if(result) {
              done(false, true);
            }
          })
        );

      // to 'receive', must be Stripe Managed account
      } else if(action == 'receive') {
        Stripe.accounts.updateExternalAccount(_user.secret.stripeManaged, cardData.managedCardId,
          { default_for_currency: true },
          Meteor.bindEnvironment(function (error, result) {
            if(error){
              done(error.message, false);
            } 

            if(result){
              done(false, true);
            }
          })
        );
      }
    });

    if(response.error) {
      throw new Meteor.Error("setDefaultCard", response.error);
    } else {
      return response.result;
    }

  },

  'removeCard': function(cardData){
    console.log('>>>>> [stripe] removing card');

    if(!cardData) {
      throw new Meteor.Error("removeCard", "missing params");
    }

    var _user = Meteor.user();

    var response = Async.runSync(function(done) {
      var _return = false;

      if(cardData.customerCardId && cardData.managedCardId) {
        Stripe.customers.deleteCard(_user.secret.stripeCustomer, cardData.customerCardId,
          Meteor.bindEnvironment(function (err, result) {
            if(err) {
              done(err.message, false);
            }

            if(result) {
              Stripe.accounts.deleteExternalAccount(_user.secret.stripeManaged, cardData.managedCardId,
                Meteor.bindEnvironment(function (err, result) {
                  if(err){
                    done(err.message, false);
                  } 

                  if(result){
                    done(false, result);
                  }
                })
              );
            }
          })
        );
      } else {
        if(cardData.customerCardId) {
          Stripe.customers.deleteCard(_user.secret.stripeCustomer, cardData.customerCardId,
            Meteor.bindEnvironment(function (err, result) {
              if(err){
                done(err.message, false);
              } 

              if(result){
                done(false, result);
              }
            })
          );
        }

        if(cardData.managedCardId) {
          Stripe.accounts.deleteExternalAccount(_user.secret.stripeManaged, cardData.managedCardId,
            Meteor.bindEnvironment(function (err, result) {
              if(err){
                done(err.message, false);
              } 

              if(result){
                done(false, result);
              }
            })
          );
        }
      }
    });

    if(response.error) {
      throw new Meteor.Error("removeCard", response.error);
    } else {
      return response.result;
    }
  },

  'chargeCard': function(connectionId, type) {
    console.log('>>>>> [stripe] charging card');

    if(!connectionId) {
      throw new Meteor.Error("chargeCard", "missing params");
    }

    var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true } });

    if(!connect) {
      throw new Meteor.Error("chargeCard", "connect not finished or not found");
    }

    var requestor = Meteor.users.findOne(connect.requestor);
    var owner = Meteor.users.findOne(connect.productData.ownerId);

    var amount = connect.borrowDetails.price.total;
    var formattedAmount = (amount * 100).toFixed(0);

    var response = Async.runSync(function(done) {
      Stripe.customers.retrieve(requestor.secret.stripeCustomer,
        Meteor.bindEnvironment(function (err, customer) {
          if(err) {
            done(err.message, false);
          }

          if(customer) {

            var payCardId = customer.default_source;

            // Creating a charge
            Stripe.charges.create({
              amount: formattedAmount,
              currency: "usd",
              customer: requestor.secret.stripeCustomer,
              source: payCardId,
              destination: owner.secret.stripeManaged,
              metadata: {
                connectId: connect._id,
                productId: connect.productData._id,
                productName: connect.productData.title,
                ownerId: connect.owner,
                requestorId: connect.requestor
              },
              description: requestor.emails[0].address+' renting from '+owner.emails[0].address },

              Meteor.bindEnvironment(function (err, charge) {
                if(err) {
                  done(err.message, false);
                }

                console.log('>>>>> [stripe] new charge ', charge);

                if(charge) {
                  if(type === 'PURCHASING') {
                      Connections.update({_id: connect._id}, {$set: {state: "SOLD", payment: charge}});
                  }
                  else {
                      Connections.update({_id: connect._id}, {$set: {state: "IN USE", payment: charge}});
                  }

                  var payerTrans = {
                    date: charge.created * 1000,
                    productName: connect.productData.title,
                    paidAmount: charge.amount/100
                  }

                  var recipientTrans = {
                    date: charge.created * 1000,
                    productName: connect.productData.title,
                    receivedAmount: charge.amount/100
                  }

                  Transactions.update({'userId': connect.requestor }, {$push: {spending: payerTrans}});
                  Transactions.update({'userId': connect.owner }, {$push: {earning: recipientTrans}});

                  var message = 'You received a payment of $' + amount + ' from ' + requestor.profile.name
                  sendPush(owner._id, message);
                  sendNotification(owner._id, requestor._id, message, "info");

                  done(false, charge);
                }
              })
            ) // charges.create
          } //if customer
        })
      ); // customer.retrieve
    }); //async

    if(response.error) {
      throw new Meteor.Error("chargeCard", response.error);
    } else {
      return response.result;
    }
  },

  'chargeCardPromotion': function(connectionId, partioAmount, type) {
    console.log('>>>>> [stripe] charging card');

    if(!connectionId || !partioAmount) {
      throw new Meteor.Error("chargeCard", "missing params");
    }

    var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true } });

    if(!connect) {
      throw new Meteor.Error("chargeCard", "connect finished or not found");
    }

    var requestor = Meteor.users.findOne(connect.requestor);
    var owner = Meteor.users.findOne(connect.productData.ownerId);
    
    //total price
    var amount = connect.borrowDetails.price.total;
    
    //pay by user
    var userAmount = Number(amount) - Number(partioAmount);

    var partial = false;
    
    if(amount > partioAmount){
        partial = true;
    }

    var formattedUserAmount = (userAmount * 100).toFixed(0);
    var formattedPartioAmount = (partioAmount * 100).toFixed(0);

    console.log(formattedUserAmount, formattedPartioAmount);



    var response = Async.runSync(function(done) {

      //Partio to owner (promotional)
      Stripe.transfers.create({
        amount: formattedPartioAmount,
        currency: "usd",
        destination: owner.secret.stripeManaged,
        description: "Promotional payment"
      }, Meteor.bindEnvironment(function(err, transfer) {
        if(err){
          done(err.message, false);  
        }
        
        if(transfer){
          Meteor.call('addSpendingPromotionValue', requestor._id, { value: partioAmount, from: 'Renting from '+owner.profile.name, connectionId: connectionId });
          console.log(transfer);  
        }
        
        
      }));

      return false;

      // if(partial) {
      //   Stripe.customers.retrieve(requestor.secret.stripeCustomer,
      //     Meteor.bindEnvironment(function (err, customer) {
      //       if(err) {
      //         done(err.message, false);
      //       }

      //       if(customer) {
      //         var payCardId = customer.default_source;

      //         // Creating a charge
      //         Stripe.charges.create({
      //           amount: formattedUserAmount,
      //           currency: "usd",
      //           customer: requestor.secret.stripeCustomer,
      //           source: payCardId,
      //           destination: owner.secret.stripeManaged,
      //           metadata: {
      //             connectId: connect._id,
      //             productId: connect.productData._id,
      //             productName: connect.productData.title,
      //             ownerId: connect.owner,
      //             requestorId: connect.requestor
      //           },
      //           description: requestor.emails[0].address+' renting from '+owner.emails[0].address },

      //           Meteor.bindEnvironment(function (err, charge) {
      //             if(err) {
      //               done(err.message, false);
      //             }

      //             console.log('>>>>> [stripe] new charge ', charge);

      //             if(charge) {
      //               if(type === 'PURCHASING') {
      //                   Connections.update({_id: connect._id}, {$set: {state: "SOLD", payment: charge}});
      //               }
      //               else {
      //                   Connections.update({_id: connect._id}, {$set: {state: "IN USE", payment: charge}});
      //               }

      //               var payerTrans = {
      //                 date: charge.created * 1000,
      //                 productName: connect.productData.title,
      //                 paidAmount: charge.amount/100
      //               }

      //               var recipientTrans = {
      //                 date: charge.created * 1000,
      //                 productName: connect.productData.title,
      //                 receivedAmount: charge.amount/100
      //               }

      //               Transactions.update({'userId': connect.requestor }, {$push: {spending: payerTrans}});
      //               Transactions.update({'userId': connect.owner }, {$push: {earning: recipientTrans}});

      //               var message = 'You received a payment of $' + amount + ' from ' + requestor.profile.name
      //               sendPush(owner._id, message);
      //               sendNotification(owner._id, requestor._id, message, "info");

      //               done(false, charge);
      //             }
      //           })
      //         ) // charges.create
      //       } //if customer
      //     })
      //   ); // customer.retrieve

      // }


    }); //async

    if(response.error) {
      throw new Meteor.Error("chargeCard", response.error);
    } else {
      return response.result;
    }
  }
});
