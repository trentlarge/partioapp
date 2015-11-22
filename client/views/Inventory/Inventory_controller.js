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
			Meteor.subscribe("myProducts"),
			//Meteor.subscribe("myConnectionsOwner")
		];
	},
	data: function() {
		return {
			myProducts: function() {
				return Products.find({ownerId: Meteor.userId()})
			},
			labelState: function(state) {
				if(state === 'PAYMENT') {
					return 'RENTER PAYMENT';
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
                //return Rating.getConditionByIndex(conditionId);
            }
		}
	},
	onAfterAction: function() {

	}
});
