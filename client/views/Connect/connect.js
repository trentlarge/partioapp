//Instead of disabling side menu completely, attempting to stop propagation on slider
// Template.connectRent.onCreated(function() {
// 	IonSideMenu.snapper.disable();
// });

// Template.connectRent.onDestroyed(function() {
// 	IonSideMenu.snapper.enable();
// });

Template.connect.rendered = function() {
	var dataContext = this.data;
	//Chat input textarea auto-resize when more than 1 line is entered
	console.log(dataContext);

	Session.set("_requestor", dataContext.requestor);
	Session.set("_owner", dataContext.productData.ownerId);
}

Template.connect.helpers({
    getCategoryIcon: function() {
        return Categories.getCategoryIconByText(this.productData.category);  
    },
	noProfileYet: function() {
		if (this.avatar === "notSet") {
			return true;
		} else {
			return false;
		}
	},
	validNumber: function() {
		return Meteor.users.findOne(Meteor.userId()).profile.mobileValidated
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
	},
	connectData: function() {
		return Connections.findOne(this._id);
	}
});

Template.connect.events({
	'click #confirmReturn': function() {
		console.log(this);
		var connectionId = this._id;
		var ean = this.productData.ean;

		var productTitle = this.productData.title;
    	var searchCollectionId = Search.findOne({title: productTitle})._id;

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

		'click #btnCallUser': function(err, template) {
			var _requestor = Session.get("_requestor");
			var _owner 	 	 = Session.get("_owner");

			PartioCall.init(_requestor, _owner);
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
				Chat.remove({connectionId: connectionId})
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
