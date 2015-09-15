Template.connect.helpers({
	noProfileYet: function() {
		if (this.avatar === "notSet") {
			return true;
		} else {
			return false;
		}
	},
	userInfo: function() {
		if (Meteor.users.findOne(this.requestor)) {
			return Meteor.users.findOne(this.requestor).profile
		}
	},
	alreadyApproved: function() {
		return (Connections.findOne(this._id).state !== "WAITING") ? true : false;
	},
	phoneNumber: function() {
		return Meteor.users.findOne(this.requestor).profile.mobile;
	},
	preferredLocation: function() {
		return Connections.findOne(this._id).meetupLocation ? Connections.findOne(this._id).meetupLocation : "-";
	},
	returnItem: function() {
		return Connections.findOne(this._id).state === "RETURN" ? true : false;
	}
});

Template.connect.events({
	'click #confirmReturn': function() {
		console.log(this);
		var connectionId = this._id;
		var ean = this.bookData.ean;

		var bookId = this.bookData._id;
    	var searchCollectionId = Search.findOne({productUniqueId: bookId})._id;
		
		IonPopup.confirm({
			cancelText: 'No',
			okText: 'Received',
			title: 'Is your book returned?',
			template: '<div class="center"><p> The book will now be available for others to borrow </p></div>',
			onCancel: function() {
				console.log('Cancelled')
			},
			onOk: function() {
				// Connections.update({_id: connectionId}, {$set: {"state": "DONE"}});
				Connections.remove({_id: connectionId});

				var result = Search.update({_id: searchCollectionId}, {$inc: {qty: 1}})
            	console.log('Update result: ' + result);

				// Search.update({"ean": ean}, {$inc: {qty: 1}});
				Meteor.call('returnBook', ean, function(error, result) {
					console.log(error, result);
				})
				IonPopup.close();
				Router.go('/inventory');
			}

		});
	},
	'click #startChatOwner': function() {
		IonModal.open("chat", Connections.findOne(this));
	},
	'click #ownerAccept': function() {
		var requestor = this.requestor;
		console.log(requestor);
		Meteor.call('ownerAccept', this._id, requestor, function(error, result) {
			if (!error) {
				IonPopup.show({
	    			title: 'Great!',
	    			template: '<div class="center">Make sure you setup a meeting location and pass on the item to <strong>'+ Meteor.users.findOne(requestor).profile.name+'</strong> once you receive the payment. </div>',
	    			buttons: 
	    			[{
	    				text: 'OK',
	    				type: 'button-assertive',
	    				onTap: function() {
	    					IonPopup.close();
	    				}
	    			}]
	    		});
			}
		});
	},
	'click #changeMeetupLocation': function() 
	{
		// var essentialData = {};
		// essentialData.meetupLatLong = this.meetupLatLong;
		// essentialData.connectionId = this._id;
		// IonModal.open('mapChat', essentialData);
// 
		if(!currentPosition)
		{
			CheckLocatioOn();	
		}	
		else
		{
			console.log('currentPosition exits!');
			Session.set('initialLoc', {lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude});
			Session.set('currentLoc', {lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude});

			console.log('initial: ' + Session.get('initialLoc'));
			console.log('currentLoc: ' + Session.get('currentLoc'));

			var essentialData = {};
			essentialData.meetupLatLong = Session.get('initialLoc');
			essentialData.connectionId = this._id;
			IonModal.open('map', essentialData);
		}

	}
})

var currentPosition;
var onSuccess = function(position) 
{
	currentPosition = position;
	console.log('onSuccess');

	Session.set('initialLoc', {lat: position.coords.latitude, lng: position.coords.longitude});
	Session.set('currentLoc', {lat: position.coords.latitude, lng: position.coords.longitude});

	console.log('initial: ' + Session.get('initialLoc'));
	console.log('currentLoc: ' + Session.get('currentLoc'));

	var essentialData = {};
	essentialData.meetupLatLong = Session.get('initialLoc');
	essentialData.connectionId = this._id;
	IonModal.open('map', essentialData);
};

function onError(error) {
	
	console.log('onError');

	IonPopup.show({
		title: "Location Services Unavailable.",
		template: '<div class="center">Please enable Location services for this app from Settings > Privacy > Location Services</div>',
		buttons: [{
			text: 'OK',
			type: 'button-calm',
			onTap: function() {
				IonPopup.close();
				IonModal.close();
			}
		}]
	});
}

function CheckLocatioOn()
{
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	console.log('getCurrentPosition');
}



Template.connectRent.helpers({
	noProfileYet: function() {
		if (this.avatar === "notSet") {
			return true;
		} else {
			return false;
		}
	},
	userInfo: function() {
		return Meteor.users.findOne(this.bookData.ownerId).profile;
	},
	approvedStatus: function() {
		return Connections.findOne(this._id).state !== 'WAITING' ? '' : 'disabled';
	},
	phoneNumber: function() {
		return Meteor.users.findOne(this.bookData.ownerId).profile.mobile;
	},
	preferredLocation: function() {
		return Connections.findOne(this._id).meetupLocation;
	},
	paymentDone: function() {
		return Connections.findOne(this._id).payment ? true:false;
	},
	itemReturnDone: function() {
		return (Connections.findOne(this._id).state === "RETURN" || Connections.findOne(this._id).state === "DONE" ) ? true : false;
	}
})

Template.connectRent.events({
	'click #returnItem': function() {
		var connectionId = this._id;
		var requestorName = Meteor.users.findOne(this.requestor).profile.name;
		var ownerId = this.bookData.ownerId;
		
		IonPopup.confirm({
			cancelText: 'Cancel',
			okText: 'Return',
			title: 'Are you sure you want to return this item?',
			template: '<div class="center"><p>Please make sure the item is passed back to the owner</p></div>',
			onCancel: function() {
				console.log('Cancelled')
			},
			onOk: function() {
				Connections.update({_id: connectionId}, {$set: {"state": "RETURN"}});
				IonPopup.close();
				Push.send({
					from: 'parti-O',
					title: 'Returns',
					text: requestorName+ ' wants to return your book',
					badge: 1,
					sound: 'check',
					query: {
						userId: ownerId
					}
				});
				IonModal.open("feedback", Connections.findOne(connectionId));
			}

		});
		
	},
	'click #startChat': function() {
		IonModal.open("chat", Connections.findOne(this));
	},
	'click #payAndRent': function() {
		
		if (Meteor.user().profile.cards) {
			Session.set('payRedirect', false);
			var payerCardId = Meteor.user().profile.cards.data[0].id;
			var connectionId = this._id;
			var payerCustomerId = Meteor.user().profile.cards.data[0].customer;
			var recipientAccountId = Meteor.users.findOne(this.bookData.ownerId).profile.stripeAccount.id;
			var amount = Number(this.bookData.customPrice).toFixed(2);
			var transactionsId = Meteor.user().profile.transactionsId;
			var transactionsRecipientId = Meteor.users.findOne(this.bookData.ownerId).profile.transactionsId;

			IonPopup.confirm({
				cancelText: 'Cancel',
				okText: 'PAY',
				title: 'You are about to make a payment of $' + amount,
				template: '',
				onCancel: function() {
					console.log('Cancelled')
				},
				onOk: function() {
					IonLoading.show();
					Meteor.call('chargeCard', payerCustomerId, payerCardId, recipientAccountId, amount, connectionId, transactionsId, transactionsRecipientId, function(error, result) {
						if (!error) {
							IonLoading.hide();
							IonPopup.show({
								title: 'Payment Successful!',
								template: '<div class="center">A record of this payment is stored under Transactions History</div>',
								buttons: 
								[{
									text: 'OK',
									type: 'button-assertive',
									onTap: function() {
										IonPopup.close();
										Router.go('/transactions');
										Session.set('spendClicked', true);
									}
								}]
							});
						}
					})
				}

			});
		} else {
			Session.set('payRedirect', this._id);
			Router.go('/profile/savedcards');
		}
	},
	'click #showMap': function() {
		IonModal.open('onlyMap', this.meetupLatLong);
	}
});


