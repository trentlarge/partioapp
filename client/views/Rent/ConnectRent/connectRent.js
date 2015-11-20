Template.connectRent.rendered = function() {
	var dataContext = this.data;
	//Chat input textarea auto-resize when more than 1 line is entered
	Session.set("_requestor", dataContext.requestor);
	Session.set("_owner", dataContext.productData.ownerId);

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

Template.connectRent.helpers({
    getCategoryIcon: function() {
      return Categories.getCategoryIconByText(this.productData.category);
    },
    getCondition: function() {
      return Rating.getConditionByIndex(this.productData.conditionId);
    },
    getRequestDate: function() {
        return formatDate(this.requestDate);  
    },
    getStartDate: function() {
        return formatDate(this.borrowDetails.date.start);
    },
    getEndDate: function() {
        return formatDate(this.borrowDetails.date.end);
    },
    getTotalDays: function() {
        if( this.borrowDetails.date.totalDays > 1 ) {
            return this.borrowDetails.date.totalDays + ' days';
        }
        return this.borrowDetails.date.totalDays + ' day';
    },
	noProfileYet: function() {
		if (this.avatar === "notSet") {
			return true;
		} else {
			return false;
		}
	},
	userInfo: function() {
		return Meteor.users.findOne(this.productData.ownerId).profile;
	},
	approvedStatus: function() {
		return Connections.findOne(this._id).state !== 'WAITING' ? true : false;
	},
	phoneNumber: function() {
		return Meteor.users.findOne(this.productData.ownerId).profile.mobile;
	},
	preferredLocation: function() {
		return Connections.findOne(this._id).meetupLocation;
	},
	paymentDone: function() {
		return Connections.findOne(this._id).payment ? true : false;
	},
	itemReturnDone: function() {
		return (Connections.findOne(this._id).state === "RETURNED" || Connections.findOne(this._id).state === "DONE" ) ? true : false;
	},
	paymentPending: function() {
		return (Connections.findOne(this._id).state === "PAYMENT" || Connections.findOne(this._id).state === "WAITING") ? true : false;
	},
	calculatedPrice: function() {

        if(!Session.get('rentPrice')) {
            return 0;
        }

        var rentPrice = Session.get('rentPrice');
        var price =
                (Number(this.productData.rentPrice.semester) * rentPrice.semesters) +
                (Number(this.productData.rentPrice.month) * rentPrice.months) +
                (Number(this.productData.rentPrice.week) * rentPrice.weeks) +
                (Number(this.productData.rentPrice.day) * rentPrice.days);

        Session.set('amountPrice', price);
		return price;
	},
    validatePrice: function() {

        if(!Session.get('rentPrice')) {
            return 'disabled';
        }

        var rentPrice = Session.get('rentPrice');
        var price =
                (Number(this.productData.rentPrice.semester) * rentPrice.semesters) +
                (Number(this.productData.rentPrice.month) * rentPrice.months) +
                (Number(this.productData.rentPrice.week) * rentPrice.weeks) +
                (Number(this.productData.rentPrice.day) * rentPrice.days);

		if(price > 0) {
            return '';
        }
        else {
            return 'disabled';
        }
    },
    isBorrowed: function() {
        return (this.state === 'IN USE') ? true : false;
    },
    isReturned: function() {
        return (this.state === 'RETURNED') ? true : false;
    },
    getDaysLeft: function() {
       var diff;
       if($.now() > new Date(this.borrowDetails.date.start).getTime()) {
           diff = new Date(this.borrowDetails.date.end - $.now());
       }
       else {
           diff = new Date(this.borrowDetails.date.end - this.borrowDetails.date.start);
       }
       var daysLeft = Math.floor((diff/1000/60/60/24) + 1);

       if(daysLeft <= 1) {
           return daysLeft + ' day left'
       }
       return daysLeft + ' days left';
    }
});


Template.connectRent.events({
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
	'click #btnCallUser': function(err, template) {
		var _requestor = Session.get("_requestor");
		var _owner 	 	 = Session.get("_owner");

		PartioCall.init(_requestor, _owner);
	},
	'click #returnItem': function() {
		var connectionId = this._id;
		var requestorName = Meteor.users.findOne(this.requestor).profile.name;
		var ownerId = this.productData.ownerId;

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
	'click #startChat': function() {
		IonModal.open("chat", Connections.findOne(this));
	},
	'click #payAndRent': function() {

		if (Meteor.user().profile.cards) {
			Session.set('payRedirect', false);
			var payerCardId = Meteor.user().profile.cards.data[0].id;
			var connectionId = this._id;
			var payerCustomerId = Meteor.user().profile.customer.id;
			var recipientAccountId = Meteor.users.findOne(this.productData.ownerId).profile.stripeAccount.id;
			var amount = this.borrowDetails.price.total; 
			var transactionsId = Meteor.user().profile.transactionsId;
			var transactionsRecipientId = Meteor.users.findOne(this.productData.ownerId).profile.transactionsId;
			var recipientDebitId = Meteor.users.findOne(this.productData.ownerId).profile.payoutCard.id;

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
				Chat.remove({connectionId: connectionId})
				IonPopup.close();
				Router.go('/listing');
			}

		});
	},

	'click #showMap': function(e, t) {
		e.preventDefault();

		var connection = Connections.findOne(this._id);
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

function formatDate(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = month + "-" + day + "-" + year;

    return date;
}
