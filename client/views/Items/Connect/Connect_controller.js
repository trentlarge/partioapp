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
			//Meteor.subscribe("singleConnect", this.params._id),
		];
	},

	connection : function(){
		return Connections.findOne({ _id: this.params._id, finished: { $ne: true } });
	},

	data: function() {
		return {
			connectData: this.connection(),

			getCategoryIcon: function() {
                if(!this.connectData) { return; }
				return Categories.getCategoryIconByText(this.connectData.productData.category);
			},

			getCondition: function() {
                if(!this.connectData) { return; }
				return Rating.getConditionByIndex(this.connectData.productData.conditionId);
			},

			requestorInfo : function(){
                if(!this.connectData) { return; }
				return Meteor.users.findOne(this.connectData.requestor);
			},

			preferredLocation: function() {
                if(!this.connectData) { return; }
				return this.connectData.meetupLocation;
			},

			requestorAvatar: function() {
				var requestor = this.requestorInfo();

                if(!requestor) { return; }

				
				// if( !requestor ||
				// 	!requestor.profile ||
				// 	!requestor.profile.avatar ||
				// 	requestor.profile.avatar == 'notSet')
				// {
				// 	return '/profile_image_placeholder.jpg'
				// }

				return requestor.profile.avatar;
			},

			phoneNumber: function() {
        		var requestor = this.requestorInfo();
                if(!requestor) { return; }
				return requestor.profile.mobile;
			},

            isNotPurchasing: function() {
                if(!this.connectData) { return; }
				return (this.connectData.state.indexOf('PURCHASING') < 0 && this.connectData.state.indexOf('SOLD') < 0) ? true : false;
            },
            
			isBorrowed: function() {
        		if(!this.connectData) { return; }
				return (this.connectData.state === 'IN USE') ? true : false;
			},

			isReturned: function() {
        		if(!this.connectData) { return; }
				return (this.connectData.state === 'RETURNED') ? true : false;
			},

			locationSetted: function() {
				if(!this.connectData) { return; }
				return (this.connectData.meetupLocation !== 'Location not set') ? true : false;
			},

			getRequestDate: function() {
				if(!this.connectData) { return; }
				return formatDate(this.connectData.requestDate);
			},

			getStartDate: function() {
				if(!this.connectData) { return; }
				return formatDate(this.connectData.borrowDetails.date.start);
			},

			getEndDate: function() {
				if(!this.connectData) { return; }
				return formatDate(this.connectData.borrowDetails.date.end);
			},

			getTotalDays: function() {
				if(!this.connectData) { return; }
				if( this.connectData.borrowDetails.date.totalDays > 1 ) {
					return this.connectData.borrowDetails.date.totalDays + ' days';
				}
				return Math.round(this.connectData.borrowDetails.date.totalDays) + ' day';
			},

			alreadyApproved: function() {
				if(!this.connectData) { return; }
				return (this.connectData.state.indexOf("WAITING") < 0) ? true : false;
			},

			returnItem: function() {
				if(!this.connectData) { return; }
				return this.connectData.state === "RETURNED" ? true : false;
			},
            
            waitingPayment: function() {
                if(!this.connectData) { return; }
				return this.connectData.state === "PAYMENT" ? true : false;
            },
            
            confirmSold: function() {
				if(!this.connectData) { return; }
				return this.connectData.state === "SOLD CONFIRMED" ? true : false;
			},

			isTimeOver: function() {
				if(!this.connectData) { return; }
				var diff;
				if($.now() > new Date(this.connectData.borrowDetails.date.start).getTime()) {
					diff = new Date(this.connectData.borrowDetails.date.end - $.now());
				} else {
					diff = new Date(this.connectData.borrowDetails.date.end - this.connectData.borrowDetails.date.start);
				}
				var daysLeft = Math.floor((diff/1000/60/60/24) + 1);

				if(daysLeft < 0) {
					return true;
				}
				return false;
			},

			getDaysLeftValue: function() {
				if(!this.connectData) { return; }
				var diff;

				if($.now() > new Date(this.connectData.borrowDetails.date.start).getTime()) {
				  diff = new Date(this.connectData.borrowDetails.date.end - $.now());
				} else {
				  diff = new Date(this.connectData.borrowDetails.date.end - this.connectData.borrowDetails.date.start);
				}
				var daysLeft = Math.floor((diff/1000/60/60/24) + 1);

				if(daysLeft < 0) {
				  return 0;
				}

				return daysLeft;
			},

			getDaysLeft: function() {
				if(!this.connectData) { return; }
				var diff;
				if($.now() > new Date(this.connectData.borrowDetails.date.start).getTime()) {
				  diff = new Date(this.connectData.borrowDetails.date.end - $.now());
				} else {
				  diff = new Date(this.connectData.borrowDetails.date.end - this.connectData.borrowDetails.date.start);
				}
				var daysLeft = Math.floor((diff/1000/60/60/24) + 1);

				if(daysLeft < 0) {
				  return 'Time is Over';
				}
				else if(daysLeft <= 1) {
				  return daysLeft + ' day left'
				}
			  	return daysLeft + ' days left';
			},

			paymentPending: function() {
				if(!this.connectData) { return; }
				if(this.connectData.state.indexOf('PAYMENT') >= 0 || this.connectData.state.indexOf('WAITING') >= 0) {
					return true;
				}
				return false;
      		}
		}
	},

	onAfterAction: function() {

	}
});
