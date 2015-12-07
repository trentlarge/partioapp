ItemsController = RouteController.extend({
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
			//Meteor.subscribe("productsListOwner", 'cTdzt4agGotZJQ4eD'),
			Meteor.subscribe("singleUser",this.params._id),
			Meteor.subscribe("productsListOwner",this.params._id),
		];
	},
	search: function() {
		return Products.find({ownerId:this.params._id})
	},
	dataOwner: function () {
		//return Products.findOne({ownerId:this.params._id});
		return Meteor.users.findOne(this.params._id);
	},
	data: function() {
		return {
			connectData: this.dataOwner(),
			items: this.search(),
			nameOwner:this.dataOwner(),
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
                return Connections.find({"productData.ownerId": Meteor.userId(), $or: [ {"state": "WAITING"}, {"state": "PAYMENT"}, {"state": "IN USE"} ]});
            },
            finalizedRequests: function() {
                return Connections.find({"productData.ownerId": Meteor.userId(), "state": "RETURNED"});
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
            getDaysLeft: function(startDate, endDate) {
				 var diff;
				 if($.now() > new Date(startDate).getTime()) {
						 diff = new Date(endDate - $.now());
				 } else {
						 diff = new Date(endDate - startDate);
				 }
				 var daysLeft = Math.floor((diff/1000/60/60/24) + 1);

				 if(daysLeft <= 1) {
						 return daysLeft + ' day left'
				 }
				 return daysLeft + ' days left';
			},
		}
	},

	onAfterAction: function() {

	}
});
