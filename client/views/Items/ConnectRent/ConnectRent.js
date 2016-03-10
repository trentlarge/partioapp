Template.connectRent.onCreated(function () {
  this.subscribe("singleConnect", Router.current().params._id);
});

Template.connectRent.rendered = function() {
    Session.set('isConnectScreen', true);
    
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

	var initializing = true;

	//var handle = this.connectData.find().observe({
	var handle = Connections.find().observeChanges({
		changed: function(id, fields) {
			if(fields.finished){
				Router.go('/items');
			}
		}
	});

	initializing = false;
	Session.set('rentPrice', rentPrice);
	Session.set('numberDays', 0);
	Session.set('numberWeeks', 0);
	Session.set('numberMonths', 0);
	Session.set('numberSemesters', 0);
}

Template.connectRent.destroyed = function() {
    Session.set('couponChecked', null);
    Session.set('newPrice', null);
    Session.set('connectionId', null);
}

Template.connectRent.helpers({
   
    couponChecked: function() {
        return Session.get('couponChecked');
    },
    
    newPriceWithFee: function() {
        return Session.get('newPriceWithFee');
    }
    
});

Template.connectRent.events({
    
    'click .check-coupon': function(e, template) {
        
        if(Session.get('couponChecked')) {
            Session.set('couponChecked', false);
        }
        else {
            Session.set('couponChecked', true);
        }
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

	'click #btnCallUser': function(err, template) {
    	PartioCall.init(this.connectData);
	},

	'click #returnItem': function() {
		var connectionData = this.connectData;
		var requestorName = this.connectData.requestorData.profile.name;
		var ownerId	= this.connectData.productData.ownerId;

		IonPopup.confirm({
			cancelText: 'Cancel',
			okText: 'Return',
			title: 'Return Item',
			template: 'Are you sure you want to return this item?' +
            '<span class="popup-sub-message">Please make sure the item is passed back to the owner</span>',
			onCancel: function() {
        	IonPopup.close();
			},
			onOk: function() {
				Meteor.call('returnItem', connectionData._id, function(err, result) {
					IonPopup.close();
					if(err) {
						var errorMessage = err.reason || err.message;
						if(err.details) {
							errorMessage = errorMessage + "\nDetails:\n" + err.details;
						}
						sAlert.error(errorMessage);
						return;
					}

		            IonModal.open("feedback", connectionData);
				});
			}
		});
	},
    
    'click #confirmReceived': function() {
		var connectionData = this.connectData;
		var requestorName = this.connectData.requestorData.profile.name;
		var ownerId	= this.connectData.productData.ownerId;

		IonPopup.confirm({
			cancelText: 'Cancel',
			okText: 'Yes',
			title: 'Confirmation',
			template: 'Is your product delivered?',
			onCancel: function() {
        	IonPopup.close();
			},
			onOk: function() {
				Meteor.call('confirmSold', connectionData._id, connectionData.productData._id, function(err, result) {
					IonPopup.close();
					if(err) {
						var errorMessage = err.reason || err.message;
						if(err.details) {
							errorMessage = errorMessage + "\nDetails:\n" + err.details;
						}
						sAlert.error(errorMessage);
						return;
					}

		            IonModal.open("feedback", connectionData);
				});
			}
		});
	},

	'click #payment': function(e, template) {
        
		Session.set('payRedirect', false);

		var connectionId = this.connectData._id,
            amount = 0.00,
            amountWithFee = 0.00,
            price = Number(this.connectData.borrowDetails.price.total),
            priceWithFee = ((price + 0.3)/0.971).toFixed(2), 
            partioAmount = 0.00,
            type = $(e.target).attr('paymentType'), //'RENTING';
            successMessage = 'A record of this payment is stored under Transactions History.';
        
        //promotion
        if(Session.get('couponChecked')) {
            amount = Session.get('newPrice');
            amountWithFee = Session.get('newPriceWithFee');
            partioAmount = parseFloat(Number(price) - Number(amount)).toFixed(2);
        }
        //normal
        else {
            amountWithFee = priceWithFee;
        }
        
        //type renting
        if(type === 'RENTING') {
            successMessage += '<span class="popup-sub-message red">Note: You have 2 hours to report the item if you find some problem.</span>';
        }
        
        var askMessage = 'You are about to make a payment of $' + amountWithFee;
        
        //promotion
        if(Session.get('couponChecked')) {
            askMessage += "<span class=\"popup-sub-message red\">Using the coupon you won't be able of ask refund.</span>";
        }
        
        
//        console.log('amount: ' + amountWithFee);
//        console.log('partioAmount: ' + partioAmount);
        
        IonPopup.confirm({
            cancelText: 'Cancel',
            okText: 'PAY',
            title: 'PAYMENT',
            template: 'You are about to make a payment of $' + amountWithFee,
            onCancel: function() {

            },
            onOk: function() {
                PartioLoad.show();
                Meteor.call('chargeCard', connectionId, type, partioAmount, function(error, result) {
                    PartioLoad.hide();
                    Session.set('couponChecked', null);
                    
                    if(error) {
                        var errorMessage = error.reason || error.message;
                        if(error.details) {
                            errorMessage = errorMessage + "\nDetails:\n" + error.details;
                        }
                        sAlert.error(errorMessage);
                        return;
                    }

                    IonPopup.show({
                        title: 'Payment Successful!',
                        template: successMessage,
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
            }
        });
        
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
                //remove data from client is not a good pratice
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
			});
		}
	}
});

// REPORT ITEM

Template.reportItem.rendered = function() {
    
    Session.set('sendEnabled', false);
}

Template.reportItem.helpers({
    
    sendEnabled: function() {
        return Session.get('sendEnabled') ? '' : 'disabled';
    }
    
});

Template.reportItem.events({
   
    'change .check-problem': function(e, template) {
        
        var broken = $('.broken').prop('checked'),
            working = $('.working').prop('checked'),
            condition = $('.condition').prop('checked');
        
        if(broken || working || condition ) {
            Session.set('sendEnabled', true);
        }
        else {
            Session.set('sendEnabled', false);
        }
        
    },
    
    'click .send-report': function(e, template) {
        
        var problems = {
                broken: $('.broken').prop('checked'),
                working: $('.working').prop('checked'),
                condition: $('.condition').prop('checked')
            },
            connectionId = Session.get('connectionId');
        
        IonPopup.confirm({
          okText: 'Proceed',
          cancelText: 'Cancel',
          title: 'Report item',
          template: 'Are you sure you want report this item?',
          onOk: function() {
            Meteor.call('reportItem', connectionId, problems, function(err, res) {
              IonPopup.close();
              $('.ion-ios-close-empty').click();
                
              if(err) {
                var errorMessage = err.reason || err.message;
                if(err.details) {
                  errorMessage = errorMessage + "\nDetails:\n" + err.details;
                }
                sAlert.error(errorMessage);
                return;
              }
                
              setTimeout(function(){
                IonPopup.show({
                  title: 'Item reported',
                  template: 'Item reported successfully!' + 
                    '<span class="popup-sub-message red">Note: You have 24 hours to return the item and receive confirmation from owner.</span>',
                  buttons: [{
                    text: 'OK',
                    type: 'button-energized',
                    onTap: function() {
                      IonPopup.close();
                    }
                  }]
                });
              }, 500);
                
            });
          },

          onCancel: function() {
            return false;
          }
        });
        
    },
    
    
});
