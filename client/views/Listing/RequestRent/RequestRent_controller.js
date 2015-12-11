RequestRentController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready()){
			this.render();
		}
	},

	waitOn: function() {
		return [
			// subscribe to data here
			// Meteor.subscribe("someSubscription"),
			// Meteor.subscribe("otherSubscription"),
			// ...
		];
	},

	data: function() {
		return {
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
				var owner = Meteor.users.findOne(this.productData.ownerId);
				if(!owner || !owner.profile) {
					return {};
				}

				return owner.profile;
			},
			approvedStatus: function() {
				var connection = Connections.findOne(this._id);
				return connection.state !== 'WAITING' ? true : false;
			},
			phoneNumber: function() {
				var owner = Meteor.users.findOne(this.productData.ownerId);
				if(!owner || !owner.profile || !owner.profile.mobile) {
					return "";
				}
				return owner.profile.mobile;
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
				 } else {
						 diff = new Date(this.borrowDetails.date.end - this.borrowDetails.date.start);
				 }
				 var daysLeft = Math.floor((diff/1000/60/60/24) + 1);

				 if(daysLeft <= 1) {
						 return daysLeft + ' day left'
				 }
				 return daysLeft + ' days left';
			}
		}
	},

	onAfterAction: function() {

	}
});
