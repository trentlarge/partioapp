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
	}
});

Template.connect.events({
	'click #startChatOwner': function() {
		IonModal.open("chat", Connections.findOne(this));
	},
	'click #ownerAccept': function() {
		var requestor = this.requestor;
		console.log(requestor);
		Meteor.call('ownerAccept', this._id, function(error, result) {
			if (!error) {
				IonPopup.show({
	    			title: 'Great!',
	    			template: '<div class="center">Make sure you pass on the item to <strong>'+ Meteor.users.findOne(requestor).profile.name+'</strong> once you receive the payment. </div>',
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
	}
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
	// approvedStatus: function() {
	// 	return Connections.findOne(this._id).state !== ? '' : 'disabled';
	// },
	phoneNumber: function() {
		return Meteor.users.findOne(this.bookData.ownerId).profile.mobile;
	}
})

Template.connectRent.events({
	'click #startChat': function() {
		IonModal.open("chat", Connections.findOne(this));
	},
	'click #payAndRent': function() {
		var connectionId = this._id
		IonPopup.show({
			title: 'Work in Progress!',
			template: '<div class="center">Payment gateway integration to be done <br><br> <div class="item item-toggle">TEST PAY<label class="toggle"><input id="payToggle" type="checkbox"><div class="track"><div class="handle"></div></div></label></div></div>',
			buttons: 
			[{
				text: 'OK',
				type: 'button-assertive',
				onTap: function(event) {
						if (Session.get('testPay')) {
							IonPopup.close();
							Meteor.call('payNow', connectionId, function(error, result) {
								console.log(result);

								IonLoading.show({
									duration: 2000,
									delay: 400,
									customTemplate: '<div class="center"><h5>Payment Successfully Processed</h5></div>',
								});
								Meteor.setTimeout(function() {
									Router.go('/booksLent');
								}, 2500)

							})
						} else {
							IonPopup.close();
						}
				}
			}]
		});
	}
})