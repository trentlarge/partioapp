MyItemsController = RouteController.extend({
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
			//Meteor.subscribe("myProducts"),
			//Meteor.subscribe("myConnections")
		];
	},
    
    myProducts: function() {
        if(!Session.get('tabBorrowed') && !Session.get('tabRequests')) {
            Meteor.subscribe("myProducts", function() {});
            return Products.find({ownerId: Meteor.userId(), sold: { $ne: true }}).fetch();
        }
    },
    
    connections: function() {
        if(Session.get('tabBorrowed')) {
            return Connections.find({"requestor": Meteor.userId(), finished: { $ne: true }}).fetch();
        }
        else if(Session.get('tabRequests')){
            return Connections.find({"productData.ownerId": Meteor.userId(), finished: { $ne: true } }).fetch();
        }
    },
    
	data: function() {
		return {
			myProducts: this.myProducts(),
            connections: this.connections(),
            
			labelState: function(state) {
				if(state === 'PAYMENT') {
					return 'WAITING ON RENTER PAYMENT';
				}
				else if(state === 'IN USE') {
					return 'BORROWED';
				}
                else if(state === 'SOLD CONFIRMED') {
                    return 'FEEDBACK';
                }
				else {
					return state;
				}
			},
            
            // BORROW STATES: WAITING, PAYMENT, IN USE, RETURNED
            // PURCHASING STATES: WAITING PURCHASING, PAYMENT PURCHASING, SOLD, SOLD CONFIRMED
            isPurchasing: function(state) {
               return (state === 'WAITING PURCHASING' || state === 'PAYMENT PURCHASING' || state === 'SOLD' || state === 'SOLD CONFIRMED') ? true : false;
            },
            
            getCondition: function(conditionId) {
                return Rating.getConditionByIndex(conditionId);
            },
            
            getRequestDate: function(requestDate) {
				return formatDate(requestDate);
			},
            
			getStartDate: function(startDate) {
				return formatDate(startDate);
			},
            
			getEndDate: function(endDate) {
				return formatDate(endDate);
			},
            
			getTotalDays: function(totalDays) {
				if( totalDays > 1 ) {
					return totalDays + ' days';
				}
				return totalDays + ' day';
			},

            isTimeOver: function(startDate, endDate) {
                var diff;
                if($.now() > new Date(startDate).getTime()) {
                     diff = new Date(endDate - $.now());
                } else {
                     diff = new Date(endDate - startDate);
                }
                var daysLeft = Math.floor((diff/1000/60/60/24) + 1);

                if(daysLeft < 0) {
                    return true;
                }
                return false;
            },

            getDaysLeft: function(startDate, endDate) {
                var diff;
                if($.now() > new Date(startDate).getTime()) {
                  diff = new Date(endDate - $.now());
                } else {
                  diff = new Date(endDate - startDate);
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

       };                                       
    },
                                           
	onAfterAction: function() {

	}
});
