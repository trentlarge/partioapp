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
	}
});

Template.connect.events({
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
	'click #changeMeetupLocation': function() {
		var essentialData = {};
		essentialData.meetupLatLong = this.meetupLatLong;
		essentialData.connectionId = this._id;
		IonModal.open('mapChat', essentialData);
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
	approvedStatus: function() {
		return Connections.findOne(this._id).state !== 'WAITING' ? '' : 'disabled';
	},
	phoneNumber: function() {
		return Meteor.users.findOne(this.bookData.ownerId).profile.mobile;
	},
	preferredLocation: function() {
		return Connections.findOne(this._id).meetupLocation;
	}
})

Template.connectRent.events({
	'click #startChat': function() {
		IonModal.open("chat", Connections.findOne(this));
	},
	'click #payAndRent': function() {
		var connectionId = this._id;
		var payerCardId = Meteor.user().profile.cards.data[0].id;
		var payerCustomerId = Meteor.user().profile.cards.data[0].customer;
		var recipientAccountId = Meteor.users.findOne(this.bookData.ownerId).profile.stripeAccount.id;
		var amount = this.bookData.customPrice;
		var transactionsId = Meteor.user().profile.transactionsId;
		var transactionsRecipientId = Meteor.users.findOne(this.bookData.ownerId).profile.transactionsId;

		IonPopup.confirm({
			cancelText: 'Cancel',
			okText: 'Proceed',
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

	},
	'click #showMap': function() {
		IonModal.open('onlyMap', this.meetupLatLong);
	}
});


