Template.connectRent.rendered = function() {
	var dataContext = this.data;
	//Chat input textarea auto-resize when more than 1 line is entered

	Session.set("_requestor", dataContext.requestor);
	Session.set("_owner", dataContext.bookData.ownerId);
}


Template.connectRent.events({
	'click #btnCallUser': function(err, template) {

		PartioLoad.show();

		//CHECK NUMBER ON TWILIO API
		Meteor.call('twilioVerification', Meteor.user().profile.mobile, function(error, result) {

			// IF GET SOME ERROR FROM TWILIO
			if(error) {
				console.log('>>>> twilio error');
				console.log(error);

				PartioLoad.hide();

				IonPopup.show({
					title: 'Ops...',
					template: '<div class="center dark">Sorry, the service is unavailable at this moment. Please try again later. Thank you. ;)'+error.message+'</div>',
					buttons:
					[{
						text: 'OK',
						type: 'button-energized',
						onTap: function() {
							IonPopup.close();
						}
					}]
				});

				return false;
			}

			// TWILIO IS WORKING
			if(result){
				console.log(result);
        
				var _requestor = Session.get('_requestor')
				var _owner = Session.get('_owner');

        var _from = Meteor.users.findOne(_requestor).profile.mobile;
        var _to = Meteor.users.findOne(_owner).profile.mobile;

				PartioLoad.hide();

				//REGISTERING FIRST TIME
				if(result.statusCode == 200) {
					console.log('Twilio >>>>>>> registering phone')
					IonPopup.show({
						title: 'Phone activation',
						template: '<div class="center dark">Please, answer call and digit your activation number: "'+data.validation_code+'". Press OK when done. Thank you.</div>',
						buttons:
						[{
							text: 'OK',
							type: 'button-energized',
							onTap: function() {
								console.log(_from);
								console.log(_to);
								Meteor.call('callTwilio', { from: _from, to: _to }, function(error, data){
									console.log('Twilio >>>> call callTwilio method >>>');
									console.log(error);
									console.log(data);
								});
							}
						}]
					});

				//ALREADY REGISTRED
				} else if(result.statusCode == 400) {
					console.log('Twilio >>>>>>> phone already registered')
					console.log(_from);
					console.log(_to);

					Meteor.call('callTwilio', { from: _from, to: _to }, function(error, data){
						console.log('Twilio >>>> call callTwilio method >>>');
						console.log(error);
						console.log(data);
					});
				}
			}
		});
	}
});

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
	'touchstart #slider-container': function(e) {
		e.stopPropagation();
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
					PartioLoad.show();
					Meteor.call('chargeCard', payerCustomerId, payerCardId, recipientDebitId, amount, connectionId, transactionsId, transactionsRecipientId, function(error, result) {
						if (!error) {
							PartioLoad.hide();
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
				Chat.remove({connectionId: connectionId})
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
