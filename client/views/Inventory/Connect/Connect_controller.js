ConnectController = RouteController.extend({
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
			// subscribe to data here
			Meteor.subscribe("singleConnect", this.params._id),
			//Meteor.subscribe("singleUser", this.connectData.requestor),

		];
	},

	data: function() {
		let _connectId = this.params._id;

		return {
			connectData: Connections.findOne(_connectId),

			getCategoryIcon: function() {
				console.log(this.connectData);
				return Categories.getCategoryIconByText(this.connectData.productData.category);
			},

			getCondition: function() {
				return Rating.getConditionByIndex(this.connectData.productData.conditionId);
			},

			requestorInfo : function(){
				console.log(Meteor.users.findOne(this.connectData.requestor))
				return Meteor.users.findOne(this.connectData.requestor);
			},

			preferredLocation: function() {
				console.log('Meet Up Location CONNECT JS: ' +this.connectData.meetupLocation);
				return this.connectData.meetupLocation;
			},

			requestorAvatar: function() {
				if(this.requestorInfo().profile.avatar == 'notSet' ||
					 this.requestorInfo().profile.avatar == ''
				 ){
					return '/profile_image_placeholder.jpg'
				} else {
					return this.requestorInfo().profile.avatar;
				}
			},

			phoneNumber: function() {
				return this.requestorInfo().profile.mobile;
			},

			isBorrowed: function() {
					return (this.connectData.state === 'IN USE') ? true : false;
			},

			isReturned: function() {
					return (this.connectData.state === 'RETURNED') ? true : false;
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

			validNumber: function() {
				return Meteor.user().profile.mobileValidated;
			},

			alreadyApproved: function() {
				return (this.connectData.state !== "WAITING") ? true : false;
			},

			returnItem: function() {
				return this.connectData.state === "RETURNED" ? true : false;
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
			},

			paymentPending: function() {
				if(this.connectData.state === 'PAYMENT' || this.connectData.state === 'WAITING') {
						return true;
				}
				return false;
			}
		}
	},

	onAfterAction: function() {

	}
});
