Template.connectRent.onCreated(function() {
	IonSideMenu.snapper.disable();
});

Template.connectRent.onDestroyed(function() {
	IonSideMenu.snapper.enable();
});

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
		console.log('Meet Up Location CONNECT JS: ' + Connections.findOne(this._id).meetupLocation);
		return Connections.findOne(this._id).meetupLocation;
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
				Meteor.call('confirmReturn', searchCollectionId, connectionId, function(error, result) {
					console.log(error, result);
				})

				// var result = Search.update({_id: searchCollectionId}, {$inc: {qty: 1}})

				IonPopup.close();
				IonModal.open("feedbackborrower", Connections.findOne(connectionId));
			}

		});
	},
	'click #startChatOwner': function() {
		IonModal.open("chat", Connections.findOne(this));		
	},
	'click #cancelRequest': function() {
		connectionId = this._id;
		console.log('Cancelling Book Request');

		IonPopup.confirm({
			cancelText: 'No',
			okText: 'Yes',
			title: 'Book Request Cancel',
			template: '<div class="center"><p> Do you wish to cancel the request? </p></div>',
			onCancel: function() {
				console.log('Cancelled')
			},
			onOk: function() {

				Connections.remove({"_id": connectionId});
				IonPopup.close();
				Router.go('/inventory');
			}
	
		});	
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
		connectionId = this._id;
		console.log('connectionId: '+ connectionId);

		meetingCoordinates = Connections.findOne(this._id).meetupLatLong;

		// var essentialData = {};
		// essentialData.meetupLatLong = this.meetupLatLong;
		// essentialData.connectionId = this._id;
		// IonModal.open('mapChat', essentialData);
// 
		CheckLocatioOn();	
		
		// if(!currentPosition)
		// {
		// 	CheckLocatioOn();	
		// }	
		// else
		// {
		// 	console.log('meeting lat: ' + meetingCoordinates.lat);
		// 	Session.set('initialLoc', {lat: meetingCoordinates.H, lng: meetingCoordinates.L});
		// 	Session.set('currentLoc', {lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude});

		// 	// console.log('initial: ' + Session.get('initialLoc'));
		// 	// console.log('currentLoc: ' + Session.get('currentLoc'));

		// 	var essentialData = {};
		// 	essentialData.meetupLatLong = Session.get('initialLoc');
		// 	essentialData.connectionId = connectionId;

		// 	console.log('essentialData: ' + essentialData);

		// 	IonModal.open('map', essentialData);
		// }

	}
})

var meetingCoordinates;
var connectionId;
var currentPosition;
var onSuccess = function(position) 
{
	meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
	currentPosition = position;
	console.log('onSuccess');

	console.log('meeting lat: ' + JSON.stringify(meetingCoordinates));
	if(meetingCoordinates.H &&
		JSON.stringify(meetingCoordinates) != 'Location not set')
	{
		Session.set('initialLoc', {lat: meetingCoordinates.H, lng: meetingCoordinates.L});
	}
	else
	{
		Session.set('initialLoc', {lat: position.coords.latitude, lng: position.coords.longitude});
	}
	
	Session.set('currentLoc', {lat: position.coords.latitude, lng: position.coords.longitude});

	console.log('initial: ' + JSON.stringify(Session.get('initialLoc')));
	console.log('currentLoc: ' + JSON.stringify(Session.get('currentLoc')));

	var essentialData = {};
	essentialData.meetupLatLong = Session.get('initialLoc');
	essentialData.connectionId = connectionId;
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


Template.connectRent.onRendered(function() {
	Session.set('sliderValue', 4);
})

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
	},
	paymentPending: function() {
		return Connections.findOne(this._id).state === "PAYMENT" ? true : false;
	},
	sliderValue: function() {
		return Session.get('sliderValue')
	},
	todaysDate: function() {
		return moment().format('MM/DD'); 
	},
	endDate: function() {
		return moment().add(Session.get('sliderValue'), 'w').format('MM/DD');
	},
	calculatedPrice: function() {
		return (Number(this.bookData.customPrice) * Session.get('sliderValue')).toFixed(2);
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
				Meteor.call('returnBook', connectionId, function(error, result) {
					console.log(error, result)
				})
				
				IonPopup.close();
				IonModal.open("feedback", Connections.findOne(connectionId));
			}

		});
		
	},
	'change #slider': function(e) {
		Session.set('sliderValue', e.target.value);
	},
	'click #startChat': function() {
		IonModal.open("chat", Connections.findOne(this));
	},
	'click #payAndRent': function() {
		
		if (Meteor.user().profile.cards) {
			Session.set('payRedirect', false);
			var payerCardId = Meteor.user().profile.cards.data[0].id;
			var connectionId = this._id;
			var payerCustomerId = Meteor.user().profile.customer.id;
			var recipientAccountId = Meteor.users.findOne(this.bookData.ownerId).profile.stripeAccount.id;
			var amount = (Number(this.bookData.customPrice) * Session.get('sliderValue')).toFixed(2);
			var transactionsId = Meteor.user().profile.transactionsId;
			var transactionsRecipientId = Meteor.users.findOne(this.bookData.ownerId).profile.transactionsId;
			var recipientDebitId = Meteor.users.findOne(this.bookData.ownerId).profile.payoutCard.id;

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
					Meteor.call('chargeCard', payerCustomerId, payerCardId, recipientDebitId, amount, connectionId, transactionsId, transactionsRecipientId, function(error, result) {
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
	'click #cancel-request': function() {
		connectionId = this._id;
		console.log('Cancelling Book Request');

		IonPopup.confirm({
			cancelText: 'No',
			okText: 'Yes',
			title: 'Book Request Cancel',
			template: '<div class="center"><p> Do you wish to cancel the request? </p></div>',
			onCancel: function() {
				console.log('Cancelled')
			},
			onOk: function() {

				Connections.remove({"_id": connectionId});
				IonPopup.close();
				Router.go('/listing');
			}
	
		});	
	},
	'click #showMap': function() 
	{
		this.meetupLocation = Connections.findOne(this._id).meetupLocation;

		

		if (this.meetupLatLong === "Location not set") 
		{
			return false;
		} 
		else 
		{
			argMeetupLatLong = Connections.findOne(this._id).meetupLatLong;
			CheckLocatioOnForTaker();
		}
	}
});

var currentTakerPosition, argMeetupLatLong;
function CheckLocatioOnForTaker()
{
	navigator.geolocation.getCurrentPosition(onSuccessMethod, onErrorMethod);	
}

var onSuccessMethod = function(position)
{
	currentTakerPosition = position;
	
	Session.set('takerCurrentPosition', {lat: currentTakerPosition.coords.latitude, lng: currentTakerPosition.coords.longitude});
	console.log('coords: ' + Session.get('takerCurrentPosition').lat);
	console.log(argMeetupLatLong);
	IonModal.open('onlyMap', argMeetupLatLong);	
}

function onErrorMethod(error) {
	console.log('Err: '+ error);
}


