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
			Meteor.subscribe("myConnectionsOwner")
		];
	},
	data: function() {
		return {
			myProducts: function() {
				return Products.find({ownerId: Meteor.userId()})
			},
			getState: function() {
				if(this.state === 'PAYMENT') {
					return 'RENTER PAYMENT';
				}
				else if(this.state === 'IN USE') {
					return 'BORROWED';
				}
				else {
					return this.state;
				}
			},
			newRequests: function() {
		  	return Connections.find({"productData.ownerId": Meteor.userId(), $or: [ {"state": "WAITING"}, {"state": "PAYMENT"}, {"state": "IN USE"} ]});
		  },
		  finalizedRequests: function() {
		  	return Connections.find({"productData.ownerId": Meteor.userId(), "state": "RETURNED"});
		  },
		  status: function() {
		    return Connections.findOne(this._id).approved ? "IN USE" : "WAITING" ;
		  },
		  statusWaiting: function() {
		    return Connections.findOne(this._id).state === "WAITING" ? true: false;
		  },
		  getCondition: function() {
		      return Rating.getConditionByIndex(this.conditionId);
		  }
		}
	},
	onAfterAction: function() {

	}
});
