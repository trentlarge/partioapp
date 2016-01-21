RentingController = RouteController.extend({
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
		];
	},

	data: function() {
		return {
            toBeApprovedPurchasing: function() {
                return Connections.find({"requestor": Meteor.userId(), finished: { $ne: true }, $or: [ {"state": "WAITING PURCHASING"}, {"state": "PAYMENT PURCHASING"}, {"state": "SOLD"} ]});
            },
            toBeApproved: function() {
                return Connections.find({"requestor": Meteor.userId(), finished: { $ne: true }, "state": "WAITING"}); //{$ne: "IN USE", $ne: "DONE"}})
            },
            toBePaid: function() {
                return Connections.find({"requestor": Meteor.userId(), finished: { $ne: true }, "state": "PAYMENT"}); //{$ne: "IN USE", $ne: "DONE"}})
            },
            currentlyBorrowed: function() {
                return Connections.find({"requestor": Meteor.userId(), finished: { $ne: true }, "state": "IN USE"}); //{$ne: "IN USE", $ne: "DONE"}})
            //return Connections.find({"requestor": Meteor.userId(), "state": "DONE"});
            },
            dataExists: function() {
                return (Connections.find({"requestor": Meteor.userId(), finished: { $ne: true }, "state": {$ne: "IN USE"}}).count() || Connections.find({"requestor": Meteor.userId(), "state": "IN USE"}).count()) ? true : false;
            },
            isReturned: function() {
                return (Connections.find({"requestor": Meteor.userId(), finished: { $ne: true }, "state": "RETURNED"}));
            },
            itemReturned: function() {
                return (Connections.find({"requestor": Meteor.userId(), finished: { $ne: true }, "state": "RETURNED"})).count();
            },
            isTapping: function() {
                return Session.get('isTapping');
            },
            getProductCondition: function(conditionId) {
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
		};
	},

	onAfterAction: function() {

	}
});
