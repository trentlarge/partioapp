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
}

Template.connectRent.helpers({
   
    couponChecked: function() {
        return Session.get('couponChecked');
    },
    
    newPrice: function() {
        return Session.get('newPrice');
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
			title: 'Are you sure you want to return this item?',
			template: '<div class="center"><p>Please make sure the item is passed back to the owner</p></div>',
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
			template: '<p> Is your product delivered? </p>',
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

	'click #payAndRent': function() {
        
		Session.set('payRedirect', false);

		var connectionId = this.connectData._id,
            amount = 0.00,
            price = this.connectData.borrowDetails.price.total,
            priceWithFee = parseFloat(Number(price) + (0.03 * Number(price)) + 0.30).toFixed(2);
        
        // PROMOTION PAYMENT
        
        if(Session.get('couponChecked')) {
            
            amount = Session.get('newPrice');
            var partioAmount = parseFloat(Number(priceWithFee) - Number(amount)).toFixed(2);
            
            IonPopup.confirm({
                cancelText: 'Cancel',
                okText: 'PAY',
                title: 'PAYMENT',
                template: 'You are about to make a payment of $' + amount,
                onCancel: function() {

                },
                onOk: function() {
                    PartioLoad.show();
                    Meteor.call('chargeCardPromotion', connectionId, partioAmount, 'RENTING', function(error, result) {
                        PartioLoad.hide();

                        if(error) {
                            // var errorMessage = error.reason || error.message;
                            // if(error.details) {
                            //     errorMessage = errorMessage + "\nDetails:\n" + error.details;
                            // }
                            // sAlert.error(errorMessage);
                             IonPopup.show({
                                title: 'Ops...',
                                template: 'Coupon system isn\'t working now. Please try again later. Thank you.',
                                buttons:
                                [{
                                    text: 'OK',
                                    type: 'button-assertive',
                                    onTap: function() {
                                        IonPopup.close();
                                    }
                                }]
                            });

                            return;
                        }

                        IonPopup.show({
                            title: 'Payment Successful!',
                            template: 'A record of this payment is stored under Transactions History.',
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
                    });
                }
            });
            
        }
        
        // NORMAL PAYMENT
        
        else {
            
            amount = priceWithFee;
            
            IonPopup.confirm({
                cancelText: 'Cancel',
                okText: 'PAY',
                title: 'PAYMENT',
                template: 'You are about to make a payment of $' + amount,
                onCancel: function() {

                },
                onOk: function() {
                    PartioLoad.show();
                    Meteor.call('chargeCard', connectionId, 'RENTING', function(error, result) {
                        PartioLoad.hide();

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
                            template: 'A record of this payment is stored under Transactions History.',
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
                    });
                }
            });
        }

	},
    
    'click #payPurchasing': function() {
		Session.set('payRedirect', false);

		var connectionId = this.connectData._id,
            amount = 0.00,
            price = this.connectData.borrowDetails.price.total,
            priceWithFee = parseFloat(Number(price) + (0.03 * Number(price)) + 0.30).toFixed(2);
        
        // PROMOTION PAYMENT
        
        if(Session.get('couponChecked')) {
            
            amount = Session.get('newPrice');
            var partioAmount = parseFloat(Number(priceWithFee) - Number(amount)).toFixed(2);
            
            IonPopup.confirm({
                cancelText: 'Cancel',
                okText: 'PAY',
                title: 'PAYMENT',
                template: 'You are about to make a payment of $' + amount,
                onCancel: function() {

                },
                onOk: function() {
                    PartioLoad.show();
                    Meteor.call('chargeCardPromotion', connectionId, partioAmount, 'PURCHASING', function(error, result) {
                        PartioLoad.hide();

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
                            template: 'A record of this payment is stored under Transactions History.',
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
                    });
                }
            });
        }
        
        // NORMAL PAYMENT
        
        else {
            amount = priceWithFee;
            
            IonPopup.confirm({
                cancelText: 'Cancel',
                okText: 'PAY',
                title: 'PAYMENT',
                template: 'You are about to make a payment of $' + amount,
                onCancel: function() {

                },
                onOk: function() {
                    PartioLoad.show();
                    Meteor.call('chargeCard', connectionId, 'PURCHASING', function(error, result) {
                        PartioLoad.hide();

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
                            template: 'A record of this payment is stored under Transactions History.',
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
                    });
                }
            });
        }
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
                Meteor.call('updateConnection', connectionId, productId, function(err, res) {
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
