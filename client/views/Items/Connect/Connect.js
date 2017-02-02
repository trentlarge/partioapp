Template.connect.onCreated(function () {
  Meteor.subscribe("singleConnect", Router.current().params._id);
});

Template.connect.rendered = function() {
    Session.set('isConnectScreen', true);
    Session.set('insuranceChecked', true);
};

Template.connectRent.helpers({

    insuranceChecked: function() {
        return Session.get('insuranceChecked');
    },
});

Template.connect.events({

    'click .check-insurance': function(e, template) {

        // if(Session.get('insuranceChecked')) {
        //     Session.set('insuranceChecked', false);
        // }
        // else {
        //     Session.set('insuranceChecked', true);
        // }
    },

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
		var requestor = Users.findOne({ _id: connection.requestor });
        var productId = connection.productData._id;

		IonPopup.confirm({
			cancelText: 'No',
			okText: 'Yes',
			title: 'Confirmation',
			template: 'Is your product returned?' +
            '<span class="popup-sub-message">The product will now be available for others to borrow.</span>',
			onCancel: function() {

			},
			onOk: function() {
                PartioLoad.show();
				Meteor.call('confirmReturn', connection._id, productId, function(err, res) {
                    PartioLoad.hide();
					IonPopup.close();
					if(err) {
						var errorMessage = err.reason || err.message;
						if(err.details) {
							errorMessage = errorMessage + "\nDetails:\n" + err.details;
						}
						sAlert.error(errorMessage);
						return;
					}
					//console.log(connection);
					IonModal.open("feedbackborrower", requestor);
				});
			}
		});
	},

    'click #giveFeedback': function() {
		var connection = this.connectData,
            requestor = Users.findOne({ _id: connection.requestor }),
		    productTitle = connection.productData.title,
		    searchCollectionId = Search.findOne({title: productTitle}),
            message = {
                title: 'Feedback',
                template: 'The delivery confirmation has been made. Please give us your feedback.'
            };

        if(connection.report && connection.report.status) {
            message = {
                title: 'Confirmation',
                template: 'Is your product returned?'
            };
        }

		IonPopup.confirm({
			cancelText: 'No',
			okText: 'Yes',
			title: message.title,
			template: message.template,
			onCancel: function() {

			},
			onOk: function() {
                PartioLoad.show();
				Meteor.call('giveFeedback', searchCollectionId, connection._id, function(err, res) {
                    PartioLoad.hide();
					IonPopup.close();
					if(err) {
						var errorMessage = err.reason || err.message;
						if(err.details) {
							errorMessage = errorMessage + "\nDetails:\n" + err.details;
						}
						sAlert.error(errorMessage);
						return;
					}
					IonModal.open("feedbackborrower", requestor);
				});
			}
		});
	},


	'click #btnCallUser': function(err, template) {
		PartioCall.init(this.connectData);
	},

  	'click #cancelRequest': function() {
		connectionId = this.connectData._id;
        productId = this.connectData.productData._id;

		IonPopup.confirm({
			cancelText: 'No',
			okText: 'Yes',
			title: 'Request Cancel',
			template: 'Do you wish to cancel the request?',
			onCancel: function() {

			},
			onOk: function() {
				Meteor.call('declineConnection', connectionId, productId, function(err, res) {
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
				Router.go('/items');
			}
		});
	},

	'click #ownerAccept': function() {
		PartioLoad.show();
		var requestor = this.requestorInfo();
		Meteor.call('ownerAccept', this.connectData._id, Session.get('insuranceChecked'), function(err, res) {
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
        var hasInsurance = true; // Session.get('insuranceChecked')
		Meteor.call('ownerPurchasingAccept', this.connectData._id, hasInsurance, function(err, res) {
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

    'click .location': function() {
        if(Session.get('connectLocation')) {
            IonModal.open('connectMap');
        }
    },

    'click .change-location': function() {

        var connection = this.connectData,
            connectionType;

        //set user current location
        if(connection.location.type === 'product') {
            connectionType = 'user';

            PartioLoad.show();
            navigator.geolocation.getCurrentPosition(function(position) {

                var location = {
                    type: connectionType,
                    coords: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        point: [position.coords.latitude, position.coords.longitude]
                    }
                }

                Meteor.call("updateLocation", connection._id, location, function(err, res) {
                    PartioLoad.hide();
                    if(err) {
                        var errorMessage = err.reason || err.message;
                        if(err.details) {
                            errorMessage = errorMessage + "\nDetails:\n" + err.details;
                        }
                        sAlert.error(errorMessage);
                        return;
                    }

                    Session.set('conenctLocation', location.coords);
                });

            }, function(error) {
                PartioLoad.hide();
            });
        }
        //set product location
        else {
            connectionType = 'product';

            var location = {
                type: connectionType,
                coords: connection.productData.location
            }

            Meteor.call("updateLocation", connection._id, location, function(err, res) {
                PartioLoad.hide();
                if(err) {
                    var errorMessage = err.reason || err.message;
                    if(err.details) {
                        errorMessage = errorMessage + "\nDetails:\n" + err.details;
                    }
                    sAlert.error(errorMessage);
                    return;
                }

                Session.set('conenctLocation', location.coords);
            });

        }

    }

	// 'click #changeMeetupLocation': function() {
    //     PartioLoad.show();
	// 	connectionId = this.connectData._id;
    //
	// 	meetingCoordinates = this.connectData.meetupLatLong;
	// 	CheckLocationOn();
	// }
})

// var meetingCoordinates;
// var connectionId;
// var currentPosition;
//
// var CheckLocationOn = function(){
//
// //	console.log(Geolocation.currentLocation());
//
// 	//navigator.geolocation.getCurrentPosition(onSuccess, onError);
//
// 	checkUserLocation(function(result){
// 		PartioLoad.hide();
//
// 		if(result) {
// 			meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
// 			currentPosition = result;
//
// 			if(meetingCoordinates.H && JSON.stringify(meetingCoordinates) != 'Location not set') {
// 				Session.set('initialLoc', {lat: meetingCoordinates.H, lng: meetingCoordinates.L});
// 			} else {
// 				Session.set('initialLoc', {lat: currentPosition.lat, lng: currentPosition.long});
// 			}
//
// 			Session.set('currentLoc', {lat: currentPosition.lat, lng: currentPosition.long});
//
// 			var essentialData = {};
// 			essentialData.meetupLatLong = Session.get('initialLoc');
// 			essentialData.connectionId = connectionId;
// 			IonModal.open('map', essentialData);
// 		}
// 	});
// };



// var onSuccess = function(position){
// 	console.log(position);

// 	meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
// 	currentPosition = position;

// 	if(meetingCoordinates.H && JSON.stringify(meetingCoordinates) != 'Location not set') {
// 		Session.set('initialLoc', {lat: meetingCoordinates.H, lng: meetingCoordinates.L});
// 	} else {
// 		Session.set('initialLoc', {lat: position.coords.latitude, lng: position.coords.longitude});
// 	}

// 	Session.set('currentLoc', {lat: position.coords.latitude, lng: position.coords.longitude});

// 	var essentialData = {};
// 	essentialData.meetupLatLong = Session.get('initialLoc');
// 	essentialData.connectionId = connectionId;
// 	IonModal.open('map', essentialData);
// };

// var onError = function(error) {
//   	console.log(error);

// 	IonPopup.show({
// 		title: "Location Services Unavailable.",
// 		template: 'Please enable Location services for this app from Settings > Privacy > Location Services',
// 		buttons: [{
// 			text: 'OK',
// 			type: 'button-calm',
// 			onTap: function() {
// 				IonPopup.close();
// 				IonModal.close();
// 			}
// 		}]
// 	});
// }
