Template.connect.rendered = function() {
	//var dataContext = this.data;
	//Chat input textarea auto-resize when more than 1 line is entered
	//console.log(dataContext);

	//Session.set("_requestor", dataContext.requestor);
	//Session.set("_owner", dataContext.productData.ownerId);
}

Template.connect.events({
  'click .product-details': function(e, template) {
    var productDetails = $('.product-details');
    var productDetailsItem = $('.product-details-item');

      if(productDetailsItem.hasClass('hidden')){
          productDetailsItem.removeClass('hidden');
          productDetails.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
      }
      else {
          productDetailsItem.addClass('hidden');
          productDetails.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
      }
  },

	'click #confirmReturn': function() {
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
				IonPopup.close();
				IonModal.open("feedbackborrower", Connections.findOne(connectionId));
			}

		});
	},

  'click #btnCallUser': function(err, template) {
      var _requestor = this.connectData.requestor;
      var _owner 	 	 = this.connectData.productData.ownerId;
      PartioCall.init(_requestor, _owner);
  },

	// 'click #startChatOwner': function() {
	// 	IonModal.open("chat", Connections.findOne(this));
	// },

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
				//Chat.remove({connectionId: connectionId})
				IonPopup.close();
				Router.go('/inventory');
			}
		});
	},

	'click #ownerAccept': function() {
    var requestor = this.connectData.requestor;
		Meteor.call('ownerAccept', this.connectData._id, requestor, function(error, result) {
			if (!error) {
				IonPopup.show({
    			title: 'Great!',
    			template: '<div class="center">Make sure you setup a meeting location and pass on the item to <strong>'+this.connectData.requestorData.profile.name+'</strong> once you receive the payment. </div>',
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

	'click #changeMeetupLocation': function() {
    PartioLoad.show();
		connectionId = this.connectData._id;
		console.log('connectionId: '+ connectionId);
		meetingCoordinates = this.connectData.meetupLatLong;
		CheckLocationOn();
	}
})

var meetingCoordinates;
var connectionId;
var currentPosition;

var CheckLocationOn = function(){
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  console.log('getCurrentPosition');
}

var onSuccess = function(position){
  PartioLoad.hide();
	meetingCoordinates = Connections.findOne(connectionId).meetupLatLong;
	currentPosition = position;
	console.log('onSuccess');

	console.log('meeting lat: ' + JSON.stringify(meetingCoordinates));
	if(meetingCoordinates.H && JSON.stringify(meetingCoordinates) != 'Location not set') {
		Session.set('initialLoc', {lat: meetingCoordinates.H, lng: meetingCoordinates.L});
	} else {
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

var onError = function(error) {
  PartioLoad.hide();
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
