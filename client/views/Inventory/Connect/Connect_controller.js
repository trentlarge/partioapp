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
			Meteor.subscribe("singleConnect", this.params._id),
		];
        
//		let _subs = [ Meteor.subscribe("singleConnect", this.params._id) ];
//
//		if(this.connection())
//			_subs.push( Meteor.subscribe("singleUser", this.connection().requestor) );
//
//		return _subs;
	},

	connection : function(){
		return Connections.findOne(this.params._id);
	},

	data: function() {
//		let _connectId = this.params._id;

		return {
			connectData: this.connection(),

			getCategoryIcon: function() {
				return Categories.getCategoryIconByText(this.connectData.productData.category);
			},

			getCondition: function() {
				return Rating.getConditionByIndex(this.connectData.productData.conditionId);
			},

			preferredLocation: function() {
				return this.connectData.meetupLocation;
			},

			requestorAvatar: function() {
				var requestor = this.requestorInfo();
				if( !requestor ||
					!requestor.profile ||
					!requestor.profile.avatar ||
					 requestor.profile.avatar == 'notSet')

				{
					return '/profile_image_placeholder.jpg'
				}

				return requestor.profile.avatar;
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

            locationSetted: function() {
                console.log(this.connectData.meetupLocation);
                return (this.connectData.meetupLocation !== 'Location not set') ? true : false;
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

            isTimeOver: function() {
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
                var diff;
                if($.now() > new Date(this.connectData.borrowDetails.date.start).getTime()) {
                    diff = new Date(this.connectData.borrowDetails.date.end - $.now());
                } else {
                    diff = new Date(this.connectData.borrowDetails.date.end - this.connectData.borrowDetails.date.start);
                }
                var daysLeft = Math.floor((diff/1000/60/60/24) + 1);
                
                if(daysLeft < 0) {
                    return 'time is over';
                }
                else if(daysLeft <= 1) {
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
