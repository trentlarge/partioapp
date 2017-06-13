Meteor.methods({
	// updateMeetupLocation: function(connectionId, address, latLng) {
	// 	Connections.update({
	// 		_id: connectionId
	// 	}, {
	// 		$set: {
	// 			meetupLocation: address,
	// 			meetupLatLong: latLng
	// 		}
	// 	});
	// },

	updateLocation: function(connectionId, location) {
		Connections.update({
			_id: connectionId
		}, {
			$set: {
				location: location
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

	/* =============
	RENTING
	============= */

	requestOwner: function(requestorId, productId, location, ownerId, borrowDetails) {

		var requestor = Meteor.users.findOne({ _id: requestorId }),
		requestorName = requestor.profile.name,

		owner = Meteor.users.findOne({ _id: ownerId }),
		ownerEmail = owner && owner.emails && owner.emails.length ? owner.emails[0].address : "",

		product = Products.findOne(productId),

		connection = {
			owner: ownerId,
			requestor: requestorId,
			state: 'WAITING',
			location: location,
			requestDate: new Date(),
			borrowDetails: borrowDetails,
			productData: product,
			chat: [  ],
			// meetupLocation: "Location not set",
			// meetupLatLong: "Location not set"
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

	'ownerAccept': function(connectionId, insur) {
		Meteor._sleepForMs(1000);
		// console.log("changing status from Waiting to Payment");

		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		owner = Meteor.users.findOne(connect.productData.ownerId),
		ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name,
		message = ownerName + " accepted your request for " + connect.productData.title,
		insurance = {
			status: insur,
			date: new Date(),
		};

		if(insur) {

			// var request = Meteor.npmRequire("request"),
			firstName = owner.profile.name.substring(0, owner.profile.name.indexOf(" ")),
			lastName = owner.profile.name.substring(owner.profile.name.indexOf(" "), owner.profile.name.length);

			if(!owner.private.sharetempusId) {

				var auth = 'Basic ' + new Buffer('sk_live_cn6h8H5jKNN2Q2FTiJMKJMLF:').toString('base64');
				findCustomer();

				function findCustomer() {
					HTTP.post("https://api.sharetempus.com/v1/customers/find", {
						headers: {
							"Authorization": auth,
							"content-type": "application/json",
						},
						data: { email: owner.emails[0].address }
					}, Meteor.bindEnvironment(function (error, response) {
						var customer = JSON.parse(response.content);
						if (!error && customer && !customer.error) {

							if(customer && customer.id) {
								owner.private.sharetempusId = customer.id;
								// console.log(owner);

								Meteor.users.update({_id: owner._id },{
									$set: owner
								});
							}

							generateInsurance(customer.id);
						} else {
							generateCustomer();
						}
					}));
				}

				function generateCustomer() {
					var data = {
						"email": owner.emails[0].address,
						"legalEntity": {
							"type": "individual",
							"firstName": firstName,
							"lastName": lastName,
							"birthdate": (new Date(owner.profile.birthDate)).getTime(),
							"ssnLast4": "1234",
							"address": {
								"city": "New York City",
								"country": "US",
								"line1": "East 169th Street",
								"line2": "Apt. 2A Bronx",
								"postalCode": "10456",
								"state": "New York"
							}
						}
					}

					HTTP.post( "https://api.sharetempus.com/v1/customers/create", {
						headers: {
							"Authorization": auth,
							"content-type": "application/json",
						},
						data: data
					}, Meteor.bindEnvironment(function (error, response) {
						var customer = JSON.parse(response.content);
						if (!error) {
							if(customer && customer.id) {
								owner.private.sharetempusId = customer.id;
								// console.log(owner);

								Meteor.users.update({_id: owner._id },{
									$set: owner
								});
							}

							generateInsurance(customer.id);
						}
						else {
							console.log(error);
						}
					}));
				}
			}
			else {
				generateInsurance(owner.private.sharetempusId);
			}

			function generateInsurance(customerId) {

				var data = {
					"customer": customerId,
					"currency": "usd",
					"startDate": (new Date(connect.borrowDetails.date.start)).getTime(),
					"endDate": (new Date(connect.borrowDetails.date.end)).getTime(),
					"product": {
						"name": connect.productData.title,
						"manufacturer": connect.productData.amazonCategory,
						"category": "Books",
						"subcategory": "Entertainment Books",
						"value": Number((Number(connect.borrowDetails.price.total) * 100).toFixed(0))
					},
					"description": "",
				}

				var auth = 'Basic ' + new Buffer('sk_live_cn6h8H5jKNN2Q2FTiJMKJMLF:').toString('base64');

				HTTP.post("https://api.sharetempus.com/v1/policies/quote", {
					method: "POST",
					json: true,
					headers: {
						"Authorization": auth,
						"content-type": "application/json",
					},
					data: data
				}, Meteor.bindEnvironment(function (error, response) {
					var result = JSON.parse(response.content);
					if (!error) {
						// console.log(result);

						HTTP.post("https://api.sharetempus.com/v1/policies/create", {
							method: "POST",
							json: true,
							headers: {
								"Authorization": auth,
								"content-type": "application/json",
							},
							data: { token: result.token }
						}, Meteor.bindEnvironment(function (error, response) {
							var policy = JSON.parse(response.content);
							if (!error) {
								Connections.update({ _id: connectionId }, { $set: { policy: policy }});
								// console.log(policy);
							}
							else {
								console.log(error);
							}
						}));
					}
					else {
						console.log(error);
					}
				}));
			}

			// sendEmail(undefined, Meteor.user().emails[0].address, 'Insurance Ticket', insuranceMessage);
		}

		Connections.remove({"productData._id": connect.productData._id, "requestor": {$ne: connect.requestor}});
		Connections.update({_id: connectionId}, {$set: { state: "PAYMENT", insurance: insurance }});

		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "approved", connectionId);

		return true;
	},

	returnItem: function(connectionId, insurance) {
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

	confirmReturn: function(connectionId, productId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name,
		message = ownerName + " confirmed your return of " + connect.productData.title;

		Products.update({_id: productId}, {$set: {"borrow": false}});

		if(connect.report && connect.report.status) {
			Meteor.call('confirmItemReported', connect._id);
			Meteor.call('refundCharge', connect._id);
		}

		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "info", connectionId);
	},

	'submitRating': function(rating, personId, ratedBy) {
		Meteor.users.update({_id: personId}, {$push: {"profile.rating": rating}});
		var ratedByName = Meteor.users.findOne(ratedBy).profile.name,
		message = 'You got a rating of ' + rating + ' from ' + ratedByName;

		sendPush(personId, message)
		sendNotification(personId, ratedBy, message, "info")
	},


	/* =============
	PURCHASING
	============= */

	requestOwnerPurchasing: function(requestorId, productId, location, ownerId, borrowDetails) {

		var requestor = Meteor.users.findOne({ _id: requestorId }),
		requestorName = requestor.profile.name,

		owner = Meteor.users.findOne({ _id: ownerId }),
		ownerEmail = owner && owner.emails && owner.emails.length ? owner.emails[0].address : "",

		product = Products.findOne(productId),

		connection = {
			owner: ownerId,
			requestor: requestorId,
			state: 'WAITING PURCHASING',
			location: location,
			requestDate: new Date(),
			borrowDetails: borrowDetails,
			productData: product,
			chat: [  ],
			// meetupLocation: "Location not set",
			// meetupLatLong: "Location not set"
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

	'ownerPurchasingAccept': function(connectionId, insur) {
		Meteor._sleepForMs(1000);
		//console.log("changing status from Waiting to Payment");

		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name,
		message = ownerName + " accepted your request for " + connect.productData.title,
		insurance = {
			status: insur,
			date: new Date(),
			ticket: "ticket_" + ShortId.generate(),
			total: Number(connect.borrowDetails.price.total * 0.1).toFixed(2)
		};

		Connections.remove({"productData._id": connect.productData._id, "requestor": {$ne: connect.requestor}});
		Connections.update({_id: connectionId}, {$set: {state: "PAYMENT PURCHASING", insurance: insurance}});

		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "approved", connectionId);

		return true;
	},

	confirmSold: function(connectionId, productId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		borrowerName = Meteor.users.findOne(connect.requestor).profile.name,
		message = borrowerName + " confirmed the delivery of " + connect.productData.title;

		Connections.update({_id: connectionId}, {$set: {"state": "SOLD CONFIRMED"}});
		Products.update({_id: productId}, {$set: {"sold": true}});

		//ignore self check
		if(connect.selfCheck && connect.selfCheck.status) {
			Meteor.call('ignoreSelfCheck', connect._id);
		}

		if(connect.report && connect.report.status) {
			Meteor.call('returnItemReported', connect._id);
			message = borrowerName + " return the reported item " + connect.productData.title;
		}

		sendPush(connect.productData.ownerId, message);
		sendNotification(connect.productData.ownerId, connect.requestor, message, "info", connectionId);
	},

	giveFeedback: function(searchId, connectionId) {
		var connect = Connections.findOne({ _id: connectionId, finished: { $ne: true }}),
		ownerName = Meteor.users.findOne(connect.productData.ownerId).profile.name,
		message = ownerName + " give the feedback about " + connect.productData.title;

		if(connect.report && connect.report.status) {
			Meteor.call('confirmItemReported', connect._id);
			Meteor.call('refundCharge', connect._id);

			Products.update({_id: connect.productData._id}, {$set: {"purchasing": false, "sold": false}});
		}

		sendPush(connect.requestor, message);
		sendNotification(connect.requestor, connect.productData.ownerId, message, "info", connectionId);
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

	/* =============
	REPORTING
	============= */

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
		report.ignored = true;

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

		// add earning refund if promotion exist
		if(connect.promotion && connect.promotion.status) {

			var earning = {
				userId: connect.requestor,
				value: connect.promotion.value,
				from: 'refund',
			}

			Meteor.call('addEarningPromotionValue', connect.requestor, earning);
		}

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
