Template.connect.onCreated(function () {
  Meteor.subscribe("singleConnect", Router.current().params._id);
});

Template.connect.events({
	'click .product-details': function(e, template) {
		var productDetails = $('.product-details');
		var productDetailsItem = $('.product-details-item');

		if(!productDetailsItem.is(':visible')){
		  productDetailsItem.slideDown('fast');
		  productDetails.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
		}
		else {
		  productDetailsItem.slideUp('fast');
		  productDetails.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
		}
	},

	'click #confirmReturn': function() {
		var connection = this.connectData;
		var productTitle = connection.productData.title;
		var searchCollectionId = Search.findOne({title: productTitle});

		IonPopup.confirm({
			cancelText: 'No',
			okText: 'Received',
			title: 'Is your product returned?',
			template: '<p> The product will now be available for others to borrow </p>',
			onCancel: function() {

			},
			onOk: function() {
				Meteor.call('confirmReturn', searchCollectionId, connection._id, function(err, res) {
					IonPopup.close();
					if(err) {
						var errorMessage = err.reason || err.message;
						if(err.details) {
							errorMessage = errorMessage + "\nDetails:\n" + err.details;
						}
						sAlert.error(errorMessage);
						return;
					}
					IonModal.open("feedbackborrower", connection);
				});
			}
		});
	},
    
    'click #giveFeedback': function() {
		var connection = this.connectData;
		var productTitle = connection.productData.title;
		var searchCollectionId = Search.findOne({title: productTitle});

		IonPopup.confirm({
			cancelText: 'No',
			okText: 'Yes',
			title: 'Feedback',
			template: '<p> The delivery confirmation has been made. Please give us your feedback. </p>',
			onCancel: function() {

			},
			onOk: function() {
				Meteor.call('giveFeedback', searchCollectionId, connection._id, function(err, res) {
					IonPopup.close();
					if(err) {
						var errorMessage = err.reason || err.message;
						if(err.details) {
							errorMessage = errorMessage + "\nDetails:\n" + err.details;
						}
						sAlert.error(errorMessage);
						return;
					}
					IonModal.open("feedbackborrower", connection);
				});
			}
		});
	},


	'click #btnCallUser': function(err, template) {
		PartioCall.init(this.connectData);
	},

  	'click #cancelRequest': function() {
		connectionId = this.connectData._id;

		IonPopup.confirm({
			cancelText: 'No',
			okText: 'Yes',
			title: 'Book Request Cancel',
			template: '<div class="center"><p> Do you wish to cancel the request? </p></div>',
			onCancel: function() {

			},
			onOk: function() {
				Meteor.call('updateConnection', connectionId, function(err, res) {
					if(err) {
						var errorMessage = err.reason || err.message;
						if(err.details) {
							errorMessage = errorMessage + "\nDetails:\n" + err.details;
						}
						sAlert.error(errorMessage);
						return;
					}
				});
				//Chat.remove({connectionId: connectionId})
				IonPopup.close();
				Router.go('/inventory');
			}
		});
	},

	'click #ownerAccept': function() {
		PartioLoad.show();
		var requestor = this.requestorInfo();
		Meteor.call('ownerAccept', this.connectData._id, requestor._id, function(err, res) {
			PartioLoad.hide();

			if(err) {
				var errorMessage = err.reason || err.message;
				if(err.details) {
					errorMessage = errorMessage + "\nDetails:\n" + err.details;
				}
				sAlert.error(errorMessage);
				return;
			}

			IonPopup.show({
				title: 'Great!',
				template: 'Make sure you setup a meeting location and pass on the item to <strong>'+requestor.profile.name+'</strong> once you receive the payment.',
				buttons:
					[{
						text: 'OK',
						type: 'button-assertive',
						onTap: function() {
							IonPopup.close();
						}
					}]
			});
		});
	},
    
    'click #ownerPurchasingAccept': function() {
		PartioLoad.show();
		var requestor = this.requestorInfo();
		Meteor.call('ownerPurchasingAccept', this.connectData._id, requestor._id, function(err, res) {
			PartioLoad.hide();

			if(err) {
				var errorMessage = err.reason || err.message;
				if(err.details) {
					errorMessage = errorMessage + "\nDetails:\n" + err.details;
				}
				sAlert.error(errorMessage);
				return;
			}

			IonPopup.show({
				title: 'Great!',
				template: 'Make sure you setup a meeting location and pass on the item to <strong>'+requestor.profile.name+'</strong> once you receive the payment.',
				buttons:
					[{
						text: 'OK',
						type: 'button-assertive',
						onTap: function() {
							IonPopup.close();
						}
					}]
			});
		});
	},

	'click #changeMeetupLocation': function() {
        PartioLoad.show();
		connectionId = this.connectData._id;

		meetingCoordinates = this.connectData.meetupLatLong;
		CheckLocationOn();
	}
})

var meetingCoordinates;
var connectionId;
var currentPosition;

var CheckLocationOn = function(){
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

var onSuccess = function(position){
  PartioLoad.hide();
	meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
	currentPosition = position;

	if(meetingCoordinates.H && JSON.stringify(meetingCoordinates) != 'Location not set') {
		Session.set('initialLoc', {lat: meetingCoordinates.H, lng: meetingCoordinates.L});
	} else {
		Session.set('initialLoc', {lat: position.coords.latitude, lng: position.coords.longitude});
	}

	Session.set('currentLoc', {lat: position.coords.latitude, lng: position.coords.longitude});

	var essentialData = {};
	essentialData.meetupLatLong = Session.get('initialLoc');
	essentialData.connectionId = connectionId;
	IonModal.open('map', essentialData);
};

var onError = function(error) {
  PartioLoad.hide();

  //console.log(error);

	IonPopup.show({
		title: "Location Services Unavailable.",
		template: 'Please enable Location services for this app from Settings > Privacy > Location Services',
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
