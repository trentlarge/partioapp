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
			userInfo: function() {
                if(!this.connectData) { return; }
				return this.connectData.productData.ownerData.profile;
			},

			ownerAvatar: function() {
                if(!this.connectData) { return; }
				if(this.connectData.productData.ownerData.profile.avatar == 'notSet' ||
					 this.connectData.productData.ownerData.profile.avatar == ''
				 ){
					return '/profile_image_placeholder.jpg'
				} else {
					return this.connectData.productData.ownerData.profile.avatar;
				}
			},

            isNotPurchasing: function() {
                if(!this.connectData) { return; }
				return (this.connectData.state.indexOf('PURCHASING') < 0 && this.connectData.state.indexOf('SOLD') < 0) ? true : false;
            },
            
			approvedStatus: function() {
                if(!this.connectData) { return; }
				return (this.connectData.state.indexOf('WAITING') < 0)  ? true : false;
			},

			phoneNumber: function() {
                if(!this.connectData) { return; }
				return this.connectData.productData.ownerData.profile.mobile;
			},

			preferredLocation: function() {
                if(!this.connectData) { return; }
				return this.connectData.meetupLocation;
			},

			paymentDone: function() {
                if(!this.connectData) { return; }
				return this.connectData.payment ? true : false;
			},
            
            itemSold: function() {
                if(!this.connectData) { return; }
				return (this.connectData.state === "SOLD") ? true : false;
			},

			itemReturnDone: function() {
                if(!this.connectData) { return; }
				return (this.connectData.state === "RETURNED" || this.connectData.state === "DONE" ) ? true : false;
			},

            paymentState: function() {
                if(!this.connectData) { return; }
				return (this.connectData.state.indexOf("PAYMENT") >= 0) ? true : false;
			},
            
			paymentPending: function() {
                if(!this.connectData) { return; }
				return ((this.connectData.state.indexOf("PAYMENT") >= 0) || (this.connectData.state.indexOf("WAITING")) >= 0) ? true : false;
			},

			calculatedPrice: function() {
                if(!this.connectData) { return; }
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
                if(!this.connectData) { return; }
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
                if(!this.connectData) { return; }
				return (this.connectData.state === 'IN USE') ? true : false;
			},

			isReturned: function() {
                if(!this.connectData) { return; }
				return (this.connectData.state === 'RETURNED') ? true : false;
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

			getLocation: function(param) {
				if(param != 'Location not set') {
					return '<a id="showMap" href="#"><p>'+param+'</p></a>';	
				} else {
					return '<p style="min-height:15px">Waiting location...</p>';
				}
				
			},
            
            // PROMOTION 
            
            getPromotionalValue: function() {
                
                var user = Meteor.user();
                
                if(user.private.promotions && user.private.promotions.earning) {
                    
                    var value = Number(user.private.promotions.earning.total);
                    
                    if(user.private.promotions.spending) {
                        value = value - Number(user.private.promotions.spending.total);
                    }
                    
                    return parseFloat(value).toFixed(2);;
                }
                
                return 0.00;
                
            },
            
            hasCoupon: function() {
                return (this.getPromotionalValue() > 0) ? true : false;
            },
            
            getNewPrice: function(oldPrice) {
                var value = this.getPromotionalValue();
                
                if(value >= Number(oldPrice)) {
                    Session.set('newPrice', parseFloat(0.00).toFixed(2));
                    return  parseFloat(0.00).toFixed(2);
                }
                
                var newPrice = parseFloat(Number(oldPrice) - value).toFixed(2);
                
                Session.set('newPrice', newPrice);
                return newPrice;
            },
            
            getNewCouponPrice: function(rentPrice) {
                var value = this.getPromotionalValue();
                
                if(Number(rentPrice) >= value) {
                    return  parseFloat(0.00).toFixed(2);
                }
                
                return  parseFloat(value - Number(rentPrice)).toFixed(2);
            },
            
            getCouponValue: function() {
                return this.getPromotionalValue();
            }
		}
	},

	onAfterAction: function() {

	}
});
