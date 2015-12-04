Template.connectRent.rendered = function() {
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

	  if(!productDetailsItem.is(':visible')){
          productDetailsItem.slideDown('fast');
          productDetails.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
      }
      else {
          productDetailsItem.slideUp('fast');
          productDetails.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
      }
	},

	'click #btnCallUser': function(err, template) {
    PartioCall.init(this.connectData);
	},

	'click #returnItem': function() {
		var connectionData = this.connectData;
		var requestorName = this.connectData.requestorData.profile.name;
		var ownerId 			= this.connectData.productData.ownerId;

		IonPopup.confirm({
			cancelText: 'Cancel',
			okText: 'Return',
			title: 'Are you sure you want to return this item?',
			template: '<div class="center"><p>Please make sure the item is passed back to the owner</p></div>',
			onCancel: function() {
				console.log('Cancelled')
        IonPopup.close();
			},
			onOk: function() {
				Meteor.call('returnItem', connectionData._id, function(error, result) {
          IonPopup.close();
          if(!error){
            //      Router.go('/renting');
            IonModal.open("feedback", connectionData);
          } else {
            console.log('some error', $error);
          }
				})
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

			var connectionId = this.connectData._id;
			var amount = this.connectData.borrowDetails.price.total;

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

          Meteor.call('chargeCard', Meteor.settings.public.STRIPE_PUBKEY, connectionId, function(error, result) {
            //console.log(result);

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
						} else {
              console.log('some error with charge card', error);
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
        //remove data from client is not a good pratice
				Connections.remove({"_id": connectionId});
				//Chat.remove({connectionId: connectionId})
				IonPopup.close();
				Router.go('/listing');
			}

		});
	},

	'click #showMap': function(e, t) {
		e.preventDefault();
		PartioLoad.show();

		var connection = this.connectData;

		if(!connection) {
			PartioLoad.hide();
			return false;
		}

		var meetupLocation = connection.meetupLatLong || "Location not set";

		if (meetupLocation === "Location not set") {
			PartioLoad.hide();
			return false;
		} else {
			navigator.geolocation.getCurrentPosition(function(position) {
				PartioLoad.hide();
				IonModal.open('onlyMap', {
					meetupLocation: meetupLocation,
					takerLocation: {
					 	lat: position.coords.latitude,
					 	lng: position.coords.longitude
					}
				});
			}, function(error) {
				PartioLoad.hide();
				// error
				console.log('Err: '+ error);
			});
		}
	}
});
