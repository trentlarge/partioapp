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

Template.connectRent.onRendered(function() {
	Session.set('sliderValue', 4);
})

Template.connectRent.helpers({
    getCategoryIcon: function() {
      return Categories.getCategoryIconByText(this.productData.category);
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
		return Connections.findOne(this._id).payment ? true:false;
	},
	itemReturnDone: function() {
		return (Connections.findOne(this._id).state === "RETURNED" || Connections.findOne(this._id).state === "DONE" ) ? true : false;
	},
	paymentPending: function() {
		return Connections.findOne(this._id).state === "PAYMENT" ? true : false;
	},
	todaysDate: function() {
		return moment().format('MM/DD');
	},
	endDate: function() {
		return moment().add(Session.get('sliderValue'), 'w').format('MM/DD');
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
    numberDays: function() {
        return Session.get('numberDays');
    },
    numberWeeks: function() {
        return Session.get('numberWeeks');
    },
    numberMonths: function() {
        return Session.get('numberMonths');
    },
    numberSemesters: function() {
        return Session.get('numberSemesters');
    },
    totalPriceDays: function() {
        return Session.get('numberDays') * this.productData.rentPrice.day;
    },
    totalPriceWeeks: function() {
        return Session.get('numberWeeks') * this.productData.rentPrice.week;
    },
    totalPriceMonths: function() {
        return Session.get('numberMonths') * this.productData.rentPrice.month;
    },
    totalPriceSemesters: function() {
        return Session.get('numberSemesters') * this.productData.rentPrice.semester;
    },
    activeDays: function() {
         return (Session.get('numberDays') > 0) ? 'active' : '';
    },
    activeWeeks: function() {
         return (Session.get('numberWeeks') > 0) ? 'active' : '';
    },
    activeMonths: function() {
         return (Session.get('numberMonths') > 0) ? 'active' : '';
    },
    activeSemesters: function() {
         return (Session.get('numberSemesters') > 0) ? 'active' : '';
    },
    isBorrowed: function() {
        return (this.state === 'IN USE') ? true : false;
    },
    isReturned: function() {
        return (this.state === 'RETURNED') ? true : false;
    },
    getDaysLeft: function() {
       var diff;
       if($.now() > new Date(this.date.start).getTime()) {
           diff = new Date(this.date.end - $.now());
       }
       else {
           diff = new Date(this.date.end - this.date.start);
       }
       var totalDays = Math.floor((diff/1000/60/60/24) + 1);

       if(totalDays <= 1) {
           return totalDays + ' day left'
       }
       return totalDays + ' days left';
    },
    getBorrowPeriod: function() {
        var startDate = formatDate(this.date.start),
            endDate = formatDate(this.date.end);
        return startDate + ' to ' + endDate;
    },
});


Template.connectRent.events({
	'click #btnCallUser': function(err, template) {
		var _requestor = Session.get("_requestor");
		var _owner 	 	 = Session.get("_owner");

		PartioCall.init(_requestor, _owner);
	},

  'changeDate .range-end': function(e, template) {

      var start = $(".range-start").datepicker("getDate"),
          end   = $(".range-end").datepicker("getDate");

      var diff = new Date(end - start);
      var totalDays = (diff/1000/60/60/24) + 1;

      if($('.selected').length === 0) {
          totalDays = 0;
      }

      //rent days and period
      var rentDays = $('.rent-days'),
          rentPeriod = $('.rent-period');

      rentDays.empty();
      rentPeriod.empty();

      if(totalDays > 0) {

          if(totalDays === 1) {
              rentDays.append(Math.floor(totalDays) + ' day');
          }
          else {
              rentDays.append(Math.floor(totalDays) + ' days');
          }

          var startDate = $('.range-start').data('datepicker').getFormattedDate('mm-dd-yyyy'),
              endDate = $('.range-end').data('datepicker').getFormattedDate('mm-dd-yyyy');

          rentPeriod.append(startDate + ' to ' + endDate);
      }


      //rent prices

      //semesters
      var semesters = Math.floor(totalDays/120);
      totalDays =  Math.floor(totalDays % 120);
      //months
      var months = Math.floor(totalDays/30);
      totalDays =  Math.floor(totalDays % 30);
      //weeks
      var weeks = Math.floor(totalDays/7);
      totalDays =  Math.floor(totalDays % 7);
      //days
      var days = totalDays;

      var rentPrice = {
          "semesters": semesters,
          "months": months,
          "weeks": weeks,
          "days": days,
      };

      Session.set('rentPrice', rentPrice);

      Session.set('numberDays', days);
      Session.set('numberWeeks', weeks);
      Session.set('numberMonths', months);
      Session.set('numberSemesters', semesters);

      if(days > 0){ $('.thDay').addClass('active') } else { $('.thDay').removeClass('active') }
      if(weeks > 0){ $('.thWeek').addClass('active') } else { $('.thWeek').removeClass('active') }
      if(months > 0){ $('.thMonth').addClass('active') } else { $('.thMonth').removeClass('active') }
      if(semesters > 0){ $('.thSemester').addClass('active') } else { $('.thSemester').removeClass('active') }

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
                Router.go('/renting');
//				IonModal.open("feedback", Connections.findOne(connectionId));
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
			var recipientAccountId = Meteor.users.findOne(this.productData.ownerId).profile.stripeAccount.id;
			var amount = Session.get('amountPrice');//(Number(this.productData.customPrice) * Session.get('sliderValue')).toFixed(2);
			var transactionsId = Meteor.user().profile.transactionsId;
			var transactionsRecipientId = Meteor.users.findOne(this.productData.ownerId).profile.transactionsId;
			var recipientDebitId = Meteor.users.findOne(this.productData.ownerId).profile.payoutCard.id;
            var rentDate = {
                start : $(".range-start").datepicker("getDate"),
                end : $(".range-end").datepicker("getDate")
            }

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
					Meteor.call('chargeCard', payerCustomerId, payerCardId, recipientDebitId, amount, rentDate, connectionId, transactionsId, transactionsRecipientId, function(error, result) {
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
