InventoryDetailController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready){
			this.render();
		}
	},

	waitOn: function() {
		return [
			// subscribe to data here
			Meteor.subscribe("myProducts"),
			Meteor.subscribe("myConnectionsOwner"),
		];
	},

	data: function() {
		return {
			product: Products.findOne({ownerId: Meteor.userId()}),
			getCategoryIcon: function(_productCategory) {
		    return Categories.getCategoryIconByText(_productCategory);
		  },
		  editMode: function(_productId) {
		    var ConnectionObj = Connections.findOne({'productData._id': _productId});
		    if(ConnectionObj){
		      var ConnectionStatus = ConnectionObj.state;
		      if(ConnectionStatus != "RETURNED"){
		        return false;
		      }
		    }
		    return Session.get('editMode') ? true : false;
		  }
		}
	},

	onAfterAction: function() {

	}
});
