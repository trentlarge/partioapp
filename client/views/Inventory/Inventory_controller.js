InventoryController = RouteController.extend({
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
	data: function() {
		return {
			myProducts: function() {
				return Products.find({ownerId: Meteor.userId()})
			},
			labelState: function(state) {
				if(state === 'PAYMENT') {
					return 'WAITING ON RENTER PAYMENT';
				}
				else if(state === 'IN USE') {
					return 'BORROWED';
				}
				else {
					return state;
				}
			},
			newRequests: function() {
                return Connections.find({"productData.ownerId": Meteor.userId(), finished: { $ne: true }, $or: [ {"state": "WAITING"}, {"state": "PAYMENT"}, {"state": "IN USE"} ]});
            },
            newPurchasingRequests: function() {
                return Connections.find({"productData.ownerId": Meteor.userId(), finished: { $ne: true }, $or: [ {"state": "WAITING PURCHASING"}, {"state": "PAYMENT PURCHASING"},  {"state": "SOLD"}]});
            },
      finalizedRequests: function() {
        return Connections.find({"productData.ownerId": Meteor.userId(), finished: { $ne: true }, "state": "RETURNED"});
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
          return 'time is over';
        }
        else if(daysLeft <= 1) {
          return daysLeft + ' day left'
        }
        return daysLeft + ' days left';
			},
		}
	},
	onAfterAction: function() {

	}
});
