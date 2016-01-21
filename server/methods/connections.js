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
    
	updateConnection: function(idConnection) {
        Connections.update({ _id: idConnection }, { $set: { finished: true }})
	},

	'submitRating': function(rating, personId, ratedBy) {
		Meteor.users.update({_id: personId}, {$push: {"profile.rating": rating}});
		var ratedByName = Meteor.users.findOne(ratedBy).profile.name;
		var message = 'You got a rating of ' + rating + ' from ' + ratedByName;

		sendPush(personId, message)
		sendNotification(personId, ratedBy, message, "info")
	},

	returnItem: function(connectionId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }});
		var borrowerName = Meteor.users.findOne(connect.requestor).profile.name;

		Connections.update({_id: connectionId}, {$set: {"state": "RETURNED"}});

		var message = borrowerName + " wants to return the " + connect.productData.title;
		sendPush(connect.productData.ownerId, message);
		sendNotification(connect.productData.ownerId, connect.requestor, message, "info", connectionId);
	},
    
   confirmSold: function(connectionId, productId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }});
		var borrowerName = Meteor.users.findOne(connect.requestor).profile.name;

		Connections.update({_id: connectionId}, {$set: {"state": "SOLD CONFIRMED"}});
        Products.update({_id: productId}, {$set: {"sold": true}});

		var message = borrowerName + " confirmed the delivery of " + connect.productData.title;
		sendPush(connect.productData.ownerId, message);
		sendNotification(connect.productData.ownerId, connect.requestor, message, "info", connectionId);
	},

    giveFeedback: function(searchId, connectionId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }});
		var ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name;

		var message = ownerName + " give the feedback about " + connect.productData.title;
		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "info", connectionId);
	},
    
	confirmReturn: function(searchId, connectionId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }});
		var ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name;

		var message = ownerName + " confirmed your return of " + connect.productData.title;
		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "info", connectionId);
	},
    
    requestOwnerPurchasing: function(requestorId, productId, ownerId, borrowDetails) {
		console.log(requestorId, productId, ownerId);

		var requestor = Meteor.users.findOne({ _id: requestorId });
		var requestorName = requestor.profile.name;

		var owner = Meteor.users.findOne({ _id: ownerId });
		var ownerEmail = owner && owner.emails && owner.emails.length ? owner.emails[0].address : "";

		var product = Products.findOne(productId);

		var connection = {
			owner: ownerId,
			requestor: requestorId,
			state: 'WAITING PURCHASING',
			requestDate: new Date(),
			borrowDetails: borrowDetails,
			productData: product,
			chat: [  ],
			meetupLocation: "Location not set",
			meetupLatLong: "Location not set"
		};

		var httpHeaders = this.connection.httpHeaders;

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

		return true;

	},

	requestOwner: function(requestorId, productId, ownerId, borrowDetails) {
		console.log(requestorId, productId, ownerId);

		var requestor = Meteor.users.findOne({ _id: requestorId });
		var requestorName = requestor.profile.name;

		var owner = Meteor.users.findOne({ _id: ownerId });
		var ownerEmail = owner && owner.emails && owner.emails.length ? owner.emails[0].address : "";

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

		var httpHeaders = this.connection.httpHeaders;

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

		return true;

	},
    
    'ownerPurchasingAccept': function(connectionId) {
		Meteor._sleepForMs(1000);
		console.log("changing status from Waiting to Payment");

		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }});
		var ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name;

		Connections.remove({"productData._id": connect.productData._id, "requestor": {$ne: connect.requestor}});
		Connections.update({_id: connectionId}, {$set: {state: "PAYMENT PURCHASING"}});

		var message = ownerName + " accepted your request for " + connect.productData.title;
		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "approved", connectionId);

		return true;
	},
    
	'ownerAccept': function(connectionId) {
		Meteor._sleepForMs(1000);
		console.log("changing status from Waiting to Payment");

		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }});
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
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }});
		var ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name;
		var message =  "Your request for " + connect.productData.title + " has been declined.";
		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "declined", connectionId);
		Connections.remove(connectionId);

		return true;
	},
    
    'payPurchasingNow': function(payer) {
		console.log(payer);
		Meteor._sleepForMs(1000);
		Connections.update({_id: payer}, {$set: {state: "SOLD"}});
		return "yes, payment done"
	},
    
	'payNow': function(payer) {
		console.log(payer);
		Meteor._sleepForMs(1000);
		Connections.update({_id: payer}, {$set: {state: "IN USE"}});
		return "yes, payment done"
	},
	// 'updateTerms': function() {
	//
	//
	// 	console.log('updateTerms');
	//
	// 	Meteor.users.update({"_id": Meteor.userId() }, {$set: {
	// 		"profile.stripeTerms": true,
	// 		//"profile.stripeCustomer": customerResult.id,
	// 		//"profile.transactionsId": userTransId
	// 	}})
	//
	// },
});
