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
			// subscribe to data here
			// Meteor.subscribe("someSubscription"),
			//Meteor.subscribe("myConnectionsRequestor"),
			// ...
		];
	},



	data: function() {
		return {
			toBeApproved: function() {
		    return Connections.find({"requestor": Meteor.userId(), "state": "WAITING"}); //{$ne: "IN USE", $ne: "DONE"}})
		  },
		  toBePaid: function() {
		    return Connections.find({"requestor": Meteor.userId(), "state": "PAYMENT"}); //{$ne: "IN USE", $ne: "DONE"}})
		  },
		  currentlyBorrowed: function() {
		    return Connections.find({"requestor": Meteor.userId(), "state": "IN USE"}); //{$ne: "IN USE", $ne: "DONE"}})
		  	//return Connections.find({"requestor": Meteor.userId(), "state": "DONE"});
		  },
		  dataExists: function() {
		  	return (Connections.find({"requestor": Meteor.userId(), "state": {$ne: "IN USE"}}).count() || Connections.find({"requestor": Meteor.userId(), "state": "IN USE"}).count()) ? true : false;
		  },
		  isReturned: function() {
		    return (Connections.find({"requestor": Meteor.userId(), "state": "RETURNED"}));
		  },
		  itemReturned: function() {
		    return (Connections.find({"requestor": Meteor.userId(), "state": "RETURNED"})).count();
		  },
		  isTapping: function() {
		      return Session.get('isTapping');
		  },
		  getProductCondition: function() {
		      return Rating.getConditionByIndex(this.productData.conditionId);
		  }
		};
	},

	onAfterAction: function() {

	}
});
