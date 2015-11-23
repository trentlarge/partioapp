Template.connectRent.rendered = function() {

	//var dataContext = this.data.connectData;

	//Chat input textarea auto-resize when more than 1 line is entered
	//Session.set("_requestor", dataContext.requestor);
	//Session.set("_owner", this.data.connectData.productData.ownerId);

    var nowTemp = new Date();
    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

    $('.range').datepicker({
        format: 'mm-dd-yyyy',
        startDate: 'd',
        todayHighlight: true,
        toggleActive: true,
        inputs: $('.range-start, .range-end'),
    });

    $('.datepicker-days .active').click(function(){
        $(this).removeClass('selected').removeClass('active');
    });

    var rentPrice = {
        "semesters": 0,
        "months": 0,
        "weeks": 0,
        "days": 0,
    }

    Session.set('rentPrice', rentPrice);
    Session.set('numberDays', 0);
    Session.set('numberWeeks', 0);
    Session.set('numberMonths', 0);
    Session.set('numberSemesters', 0);

}

Template.connectRent.events({
	'click .product-details': function(e, template) {

		var productDetails = $('.product-details');
		var productDetailsItem = $('.product-details-item');

	  if(productDetailsItem.hasClass('hidden')){
	      productDetailsItem.removeClass('hidden');
	      productDetails.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
	  } else {
	      productDetailsItem.addClass('hidden');
	      productDetails.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
	  }
	},

	'click #btnCallUser': function(err, template) {
		var _requestor = this.connectData.requestor;
		var _owner 	 	 = this.connectData.productData.ownerId;

		PartioCall.init(_requestor, _owner);
	},

	'click #returnItem': function() {
		var connectionId 	= this.connectData._id;
		var requestorName = this.connectData.requestorData.profile.name;
		var ownerId 			= this.connectData.productData.ownerId;

		IonPopup.confirm({
			cancelText: 'Cancel',
			okText: 'Return',
			title: 'Are you sure you want to return this item?',
			template: '<div class="center"><p>Please make sure the item is passed back to the owner</p></div>',
			onCancel: function() {
				console.log('Cancelled')
			},
			onOk: function() {
				Meteor.call('returnItem', connectionId, function(error, result) {
					console.log(error, result)
				})

				IonPopup.close();
//                Router.go('/renting');
				IonModal.open("feedback", Connections.findOne(connectionId));
			}

		});

	},

	// 'click #startChat': function() {
	// 	IonModal.open("chat", Connections.findOne(this));
	// },
	//

	'click #payAndRent': function() {

		if (Meteor.user().profile.cards) {
			Session.set('payRedirect', false);
			var payerCardId = Meteor.user().profile.cards.data[0].id;
			var connectionId = this.connectData._id;
			var payerCustomerId = Meteor.user().profile.customer.id;
			var recipientAccountId = this.connectData.productData.ownerData.profile.stripeAccount.id;
			var amount = this.connectData.borrowDetails.price.total;
			var transactionsId = Meteor.user().profile.transactionsId;
			var transactionsRecipientId = this.connectData.productData.ownerData.profile.transactionsId;
			var recipientDebitId = this.connectData.productData.ownerData.profile.payoutCard.id;

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
			Session.set('payRedirect', this.connectData._id);
			Router.go('/profile/savedcards');
		}
	},
	'click #cancelRequest': function() {
		connectionId = this.connectData._id;
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

	'click #showMap': function(e, t) {
		e.preventDefault();

		var connection = this.connectData;
		if(!connection) {
			return false;
		}
		this.meetupLocation = connection.meetupLocation || { lat: 0, lng: 0 };

		if (this.meetupLatLong === "Location not set") {
			return false;
		} else {
			navigator.geolocation.getCurrentPosition(function(position) {
				IonModal.open('onlyMap', {
					meetupLocation: connection.meetupLatLong,
					takerLocation: {
					 	lat: position.coords.latitude,
					 	lng: position.coords.longitude
					}
				});
			}, function(error) {
				// error
				console.log('Err: '+ error);
			});
		}
	}
});

// function formatDate(dateObject) {
//     var d = new Date(dateObject);
//     var day = d.getDate();
//     var month = d.getMonth() + 1;
//     var year = d.getFullYear();
//     if (day < 10) {
//         day = "0" + day;
//     }
//     if (month < 10) {
//         month = "0" + month;
//     }
//     var date = month + "-" + day + "-" + year;
//
//     return date;
// }
