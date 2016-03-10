Meteor.methods({
	updateMeetupLocation: function(connectionId, address, latLng) {
		Connections.update({
			_id: connectionId
		}, {
			$set: {
				meetupLocation: address,
				meetupLatLong: latLng
			}
		});
	},

    removeConnection: function(idConnection) {
        Connections.remove(idConnection);
    },
    
	updateConnection: function(idConnection, productId) {
        Connections.update({ _id: idConnection }, { $set: { finished: true }})
        if(productId) {
            Products.update({_id: productId}, {$set: {"borrow": false, "purchasing": false}});
        }
	},
    
    declineConnection: function(idConnection, productId) {
        Connections.update({ _id: idConnection }, { $set: { finished: true }})
        if(productId) {
            Products.update({_id: productId}, {$set: {"borrow": false, "purchasing": false}});
        }
    },

	'submitRating': function(rating, personId, ratedBy) {
		Meteor.users.update({_id: personId}, {$push: {"profile.rating": rating}});
		var ratedByName = Meteor.users.findOne(ratedBy).profile.name,
		    message = 'You got a rating of ' + rating + ' from ' + ratedByName;

		sendPush(personId, message)
		sendNotification(personId, ratedBy, message, "info")
	},

	returnItem: function(connectionId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		    borrowerName = Meteor.users.findOne(connect.requestor).profile.name,
            message = borrowerName + " wants to return the " + connect.productData.title;

		Connections.update({_id: connectionId}, {$set: {"state": "RETURNED"}});

        //ignore self check
        if(connect.selfCheck && connect.selfCheck.status) {
            Meteor.call('ignoreSelfCheck', connect._id);
        }
        
        if(connect.report && connect.report.status) {
            Meteor.call('returnItemReported', connect._id);
        }
        
		sendPush(connect.productData.ownerId, message);
		sendNotification(connect.productData.ownerId, connect.requestor, message, "info", connectionId);
	},
    
   confirmSold: function(connectionId, productId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		    borrowerName = Meteor.users.findOne(connect.requestor).profile.name,
            message = borrowerName + " confirmed the delivery of " + connect.productData.title;

		Connections.update({_id: connectionId}, {$set: {"state": "SOLD CONFIRMED"}});
        Products.update({_id: productId}, {$set: {"sold": true}});

		sendPush(connect.productData.ownerId, message);
		sendNotification(connect.productData.ownerId, connect.requestor, message, "info", connectionId);
	},

    giveFeedback: function(searchId, connectionId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		    ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name,
            message = ownerName + " give the feedback about " + connect.productData.title;
        
		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "info", connectionId);
	},
    
	confirmReturn: function(connectionId, productId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		    ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name,
            message = ownerName + " confirmed your return of " + connect.productData.title;
        
        Products.update({_id: productId}, {$set: {"borrow": false}});
        
        if(connect.report && connect.report.status) {
            Meteor.call('confirmItemReported', connect._id);
        }
        
		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "info", connectionId);
	},
    
    requestOwnerPurchasing: function(requestorId, productId, ownerId, borrowDetails) {

		var requestor = Meteor.users.findOne({ _id: requestorId }),
		    requestorName = requestor.profile.name,

		    owner = Meteor.users.findOne({ _id: ownerId }),
		    ownerEmail = owner && owner.emails && owner.emails.length ? owner.emails[0].address : "",

		    product = Products.findOne(productId),

		    connection = {
                owner: ownerId,
                requestor: requestorId,
                state: 'WAITING PURCHASING',
                requestDate: new Date(),
                borrowDetails: borrowDetails,
                productData: product,
                chat: [  ],
                meetupLocation: "Location not set",
                meetupLatLong: "Location not set"
            },

		    httpHeaders = this.connection.httpHeaders;

		Connections.insert(connection, function(e, r) {
			if(e) {
				throw new Meteor.Error("requestOwner", e.message);
			} else {
				var message = requestorName + " sent you a request for \"" + product.title + "\".";
				sendPush(ownerId, message);
				sendNotification(ownerId, requestorId, message, "request", r);
				if(ownerEmail) {
					var emailBody = message;
					sendEmail("", ownerEmail, "PartiO request", emailBody);
				}
			}
		});

        Products.update({_id: productId}, {$set: {"purchasing": true}});
        
		Meteor.call('checkTransaction', requestorId);
		Meteor.call('checkTransaction', ownerId);

		return true;

	},

	requestOwner: function(requestorId, productId, ownerId, borrowDetails) {

		var requestor = Meteor.users.findOne({ _id: requestorId }),
		    requestorName = requestor.profile.name,
            
            owner = Meteor.users.findOne({ _id: ownerId }),
		    ownerEmail = owner && owner.emails && owner.emails.length ? owner.emails[0].address : "",

		    product = Products.findOne(productId),

		    connection = {
                owner: ownerId,
                requestor: requestorId,
                state: 'WAITING',
                requestDate: new Date(),
                borrowDetails: borrowDetails,
                productData: product,
                chat: [  ],
                meetupLocation: "Location not set",
                meetupLatLong: "Location not set"
            },

            httpHeaders = this.connection.httpHeaders;

		Connections.insert(connection, function(e, r) {
			if(e) {
				throw new Meteor.Error("requestOwner", e.message);
			} else {
				var message = requestorName + " sent you a request for \"" + product.title + "\".";
				sendPush(ownerId, message);
				sendNotification(ownerId, requestorId, message, "request", r);
				if(ownerEmail) {
					var emailBody = message;
					sendEmail("", ownerEmail, "PartiO request", emailBody);
				}
			}
		});
        
        Products.update({_id: productId}, {$set: {"borrow": true}});

		Meteor.call('checkTransaction', requestorId);
		Meteor.call('checkTransaction', ownerId);

		return true;

	},
    
    'ownerPurchasingAccept': function(connectionId) {
		Meteor._sleepForMs(1000);
		//console.log("changing status from Waiting to Payment");

		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		    ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name,
            message = ownerName + " accepted your request for " + connect.productData.title;

		Connections.remove({"productData._id": connect.productData._id, "requestor": {$ne: connect.requestor}});
		Connections.update({_id: connectionId}, {$set: {state: "PAYMENT PURCHASING"}});

		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "approved", connectionId);

		return true;
	},
    
	'ownerAccept': function(connectionId) {
		Meteor._sleepForMs(1000);
		console.log("changing status from Waiting to Payment");

		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		    ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name,
            message = ownerName + " accepted your request for " + connect.productData.title;

		Connections.remove({"productData._id": connect.productData._id, "requestor": {$ne: connect.requestor}});
		Connections.update({_id: connectionId}, {$set: {state: "PAYMENT"}});

		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "approved", connectionId);

		return true;
	},

//	'ownerDecline': function(connectionId) {
//		Meteor._sleepForMs(1000);
//        
//		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
//		    ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name,
//		    message =  "Your request for " + connect.productData.title + " has been declined.";
//        
//		sendPush(connect.requestor, message);
//		sendNotification(connect.requestor, connect.productData.ownerId, message, "declined", connectionId);
//        
//        Connections.remove(connectionId);
//
//		return true;
//	},
    
    'ignoreSelfCheck': function(connectionId) {
      
        var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }});
        
        Connections.update({
            _id: connectionId
        }, {
            $set: {
                selfCheck: {
                    status: false,
                    timestamp: connect.selfCheck.timestamp,
                },
                report: {
                    status: false,
                    timestamp: Date.now()
                }
            }
        });
        
    },
    
    
    'ignoreReport': function(connectionId) {
      
        var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
            report = connect.report;
        
        report.status = false;
            
        Connections.update({
            _id: connectionId
        }, {
            $set: {
                report: report
            }
        });
        
    },
    
    'returnItemReported': function(connectionId) {
      
        var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
            report = connect.report;
        
        report.returned = {
            status: true,
            timestamp: Date.now()
        }
            
        Connections.update({
            _id: connectionId
        }, {
            $set: {
                report: report
            }
        });
        
    },
    
    'confirmItemReported': function(connectionId) {
      
        var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
            report = connect.report;
        
        report.confirmed = {
            status: true,
            timestamp: Date.now()
        }
            
        Connections.update({
            _id: connectionId
        }, {
            $set: {
                report: report
            }
        });
        
    },
    
    'reportItem': function(connectionId, problems) {
      
        var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
            ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name,
		    message =  "Your request for " + connect.productData.title + " has been reported.";
        
        Connections.update({
            _id: connectionId
        }, {
            $set: {
                selfCheck: {
                    status: false,
                    timestamp: connect.selfCheck.timestamp, 
                },
                report: {
                    status: true,
                    timestamp: Date.now(),
                    problems: problems
                }
            }
        });
        
		sendPush(connect.requestor, message);
		sendNotification(connect.productData.ownerId, connect.requestor, message, "reported", connectionId);
        
    },
    
    
    /* ================================
        PAYMENT -> Look 'stripe.js'
    ================================== */
    
    
//    'payPurchasingNow': function(payer) {
//		console.log(payer);
//		Meteor._sleepForMs(1000);
//		Connections.update(
//            {
//                _id: payer
//            }, 
//            {
//                $set: {
//                    state: "SOLD",
//                    selfCheck: {
//                        status: true,
//                        timestamp: new Date().now()
//                    }
//                }
//            });
//		return "yes, payment done"
//	},
//    
//	'payNow': function(payer) {
//		console.log(payer);
//		Meteor._sleepForMs(1000);
//		Connections.update(
//            {
//                _id: payer
//            }, 
//            {
//                $set: {
//                    state: "IN USE", 
//                    selfCheck: {
//                        status: true,
//                        timestamp: Date.now()
//                    }
//                }
//            });
//		return "yes, payment done"
//	},
//	 'updateTerms': function() {
//	
//	
//	 	console.log('updateTerms');
//	
//	 	Meteor.users.update({"_id": Meteor.userId() }, {$set: {
//	 		"profile.stripeTerms": true,
//	 		//"profile.stripeCustomer": customerResult.id,
//	 		//"profile.transactionsId": userTransId
//	 	}})
//	
//	 },
});
