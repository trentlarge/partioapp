ConnectRentController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready()) {
			this.render();
		}
	},

	waitOn: function() {
		return [
			Meteor.subscribe("singleConnect", this.params._id),
		];
	},

	connection : function(){
		return Connections.findOne(this.params._id);
	},

	data: function() {
		return {
			connectData: this.connection(),

			getCategoryIcon: function() {
				return Categories.getCategoryIconByText(this.connectData.productData.category);
			},

			getCondition: function() {
				return Rating.getConditionByIndex(this.connectData.productData.conditionId);
			},

			getRequestDate: function() {
				return formatDate(this.connectData.requestDate);
			},

			getStartDate: function() {
				return formatDate(this.connectData.borrowDetails.date.start);
			},

			getEndDate: function() {
				return formatDate(this.connectData.borrowDetails.date.end);
			},

			getTotalDays: function() {
				if( this.connectData.borrowDetails.date.totalDays > 1 ) {
						return this.connectData.borrowDetails.date.totalDays + ' days';
				}
				return this.connectData.borrowDetails.date.totalDays + ' day';
			},
			userInfo: function() {
				return this.connectData.productData.ownerData.profile;
			},

			ownerAvatar: function() {
				if(this.connectData.productData.ownerData.profile.avatar == 'notSet' ||
					 this.connectData.productData.ownerData.profile.avatar == ''
				 ){
					return '/profile_image_placeholder.jpg'
				} else {
					return this.connectData.productData.ownerData.profile.avatar;
				}
			},

			approvedStatus: function() {
				return this.connectData.state !== 'WAITING' ? true : false;
			},

			phoneNumber: function() {
				return this.connectData.productData.ownerData.profile.mobile;
			},

			preferredLocation: function() {
				return this.connectData.meetupLocation;
			},

			paymentDone: function() {
				return this.connectData.payment ? true : false;
			},

			itemReturnDone: function() {
				return (this.connectData.state === "RETURNED" || this.connectData.state === "DONE" ) ? true : false;
			},

			paymentPending: function() {
				return (this.connectData.state === "PAYMENT" || this.connectData.state === "WAITING") ? true : false;
			},

			calculatedPrice: function() {
				if(!Session.get('rentPrice')) {
						return 0;
				}

				var rentPrice = Session.get('rentPrice');
				var price =
					(Number(this.connectData.productData.rentPrice.semester) * rentPrice.semesters) +
					(Number(this.connectData.productData.rentPrice.month) * rentPrice.months) +
					(Number(this.connectData.productData.rentPrice.week) * rentPrice.weeks) +
					(Number(this.connectData.productData.rentPrice.day) * rentPrice.days);

				Session.set('amountPrice', price);
				return price;
			},

			validatePrice: function() {
				if(!Session.get('rentPrice')) {
					return 'disabled';
				}

				var rentPrice = Session.get('rentPrice');
				var price =
					(Number(this.connectData.productData.rentPrice.semester) * rentPrice.semesters) +
					(Number(this.connectData.productData.rentPrice.month) * rentPrice.months) +
					(Number(this.connectData.productData.rentPrice.week) * rentPrice.weeks) +
					(Number(this.connectData.productData.rentPrice.day) * rentPrice.days);

				if(price > 0) {
					return '';
				} else {
					return 'disabled';
				}
			},

			isBorrowed: function() {
				return (this.connectData.state === 'IN USE') ? true : false;
			},

			isReturned: function() {
				return (this.connectData.state === 'RETURNED') ? true : false;
			},

			getDaysLeft: function() {
				 var diff;
				 if($.now() > new Date(this.connectData.borrowDetails.date.start).getTime()) {
					 diff = new Date(this.connectData.borrowDetails.date.end - $.now());
				 } else {
					 diff = new Date(this.connectData.borrowDetails.date.end - this.connectData.borrowDetails.date.start);
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