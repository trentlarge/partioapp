Template.connect.helpers({
	noProfileYet: function() {
		if (Meteor.users.findOne(this.requestor) && Meteor.users.findOne(this.requestor).profile.avatar === "notSet") {
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
		return Connections.findOne(this._id).approved;
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
		if (Meteor.users.findOne(this.bookData.ownerId).profile.avatar === "notSet") {
			return true;
		} else {
			return false;
		}
	},
	userInfo: function() {
		return Meteor.users.findOne(this.bookData.ownerId).profile;
	},
	approvedStatus: function() {
		return Connections.findOne(this._id).approved ? '' : 'disabled';
	},
	phoneNumber: function() {
		return Meteor.users.findOne(this.bookData.owner).profile.mobile;
	}
})

Template.connectRent.events({
	'click #startChat': function() {
		IonModal.open("chat", Connections.findOne(this));
	},
	'click #payAndRent': function() {
		IonPopup.show({
			title: 'Work in Progress!',
			template: '<div class="center">Payment gateway integration to be done</div>',
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
})