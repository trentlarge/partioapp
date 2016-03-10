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
		var connection = Connections.findOne({ _id: this.params._id, finished: { $ne: true } });
        
        if(connection && connection.selfCheck) {
            if(connection.selfCheck.status) {
                setInterval(function() {
                    Session.set('timeNow', Date.now()); 
                }, 1000);
            }
            
            Session.set('connectionId', connection._id);
        }
         
        if(connection && connection.report) {
            if(connection.report.status) {
                setInterval(function() {
                    Session.set('timeNow', Date.now()); 
                }, 1000);
            }
        }
        
        return connection;
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
				return ((this.connectData.state.indexOf("PAYMENT") < 0) && (this.connectData.state.indexOf("WAITING")) < 0) ? true : false;
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
            
            selfCheck: function() {
                if(this.connectData && this.connectData.selfCheck) {
                    var selfCheck = this.connectData.selfCheck;

                    //if not promotion
                    if(this.connectData.transfer.source_transaction) {
                        if(selfCheck.status && Math.floor((Date.now() - selfCheck.timestamp)/60000) < 120) {
                            return true;
                        } 
                    }
                }

                return false;
            },
            
            getSelfCheckTimeLeft: function() {
                if(this.connectData && this.connectData.selfCheck && Session.get('timeNow')) {
                    var selfCheck = this.connectData.selfCheck,
                        timeleft = Math.floor(7200000 - ((Session.get('timeNow') - selfCheck.timestamp))),
//                        timeleft = Math.floor(10000 - ((Session.get('timeNow') - selfCheck.timestamp))),
                        hours =  Math.floor(timeleft/3600000),
                        minutes = Math.floor((timeleft/60000) - (60*hours)),
                        seconds = Math.floor((timeleft/1000) - (3600*hours) - (60*minutes));

                    if(hours < 0) {
                        //time out -> ignore self check
                        $('.ion-ios-close-empty').click();
                        Meteor.call('ignoreSelfCheck', this.connectData._id);
                        return '(time out)'
                    }
                    
                    if(hours < 10) { hours = '0' + hours; }
                    if(minutes < 10) { minutes = '0' + minutes; }
                    if(seconds < 10) { seconds = '0' + seconds; }
                    
                    return '(' + hours + ':' + minutes + ':' + seconds + ' left)';

                }
            },
            
            itemReported: function() {
                if(this.connectData && this.connectData.report) {
                    return (this.connectData.report.status);
                }
            },
            
            getReportTimeLeft: function() {
                if(this.connectData && this.connectData.report && Session.get('timeNow')) {
                    var report = this.connectData.report,
                        timeleft = Math.floor(86400000 - ((Session.get('timeNow') - report.timestamp))),
//                        timeleft = Math.floor(10000 - ((Session.get('timeNow') - report.timestamp))),
                        hours =  Math.floor(timeleft/3600000),
                        minutes = Math.floor((timeleft/60000) - (60*hours)),
                        seconds = Math.floor((timeleft/1000) - (3600*hours) - (60*minutes));

                    if(hours < 0) {
                        //time out -> ignore report
                        Meteor.call('ignoreReport', this.connectData._id);
                        return '(time out)'
                    }
                    
                    if(hours < 10) { hours = '0' + hours; }
                    if(minutes < 10) { minutes = '0' + minutes; }
                    if(seconds < 10) { seconds = '0' + seconds; }
                    
                    return '(' + hours + ':' + minutes + ':' + seconds + ' left)';

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
                    
                    return parseFloat(value).toFixed(2);
                }
                
                return 0.00;
                
            },
            
            getTotalPrice: function(price) {
                return parseFloat((Number(price) + 0.3)/0.971).toFixed(2);
            },
            
            getFee: function(price) {
                return parseFloat(((Number(price) + 0.3)/0.971) - Number(price)).toFixed(2);
            },
            
            hasCoupon: function() {
                return (this.getPromotionalValue() > 0) ? true : false;
            },
            
            getNewPrice: function(oldPrice) {
                var value = this.getPromotionalValue(),
                    newPrice = Number(oldPrice) - Number(value);
                
                if(value >= Number(oldPrice)) {
                    Session.set('newPrice', parseFloat(0.00).toFixed(2));
                    Session.set('newPriceWithFee', parseFloat(0.00).toFixed(2));
                    return  parseFloat(0.00).toFixed(2);
                }
                
                Session.set('newPrice', newPrice);
                
                //add fee
                newPrice = parseFloat((Number(newPrice) + 0.3)/0.971).toFixed(2);
                
                Session.set('newPriceWithFee', newPrice);
                
                return newPrice;
            },
            
            getNewFee: function(oldPrice) {
                var value = this.getPromotionalValue(),
                    newPrice = Number(oldPrice) - Number(value);

                if(value >= Number(oldPrice)) {
                    return  parseFloat(0.00).toFixed(2);
                }
                
                //add fee
                return parseFloat(((Number(newPrice) + 0.3)/0.971) - Number(newPrice)).toFixed(2);
            },
            
            getNewCouponPrice: function(rentPrice) {
                var value = this.getPromotionalValue();
                
                if(Number(rentPrice) >= value) {
                    return  parseFloat(0.00).toFixed(2);
                }
                
                //add fee
                //rentPrice = parseFloat(((Number(rentPrice) + 0.3)/0.971)).toFixed(2);
                
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
