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
			Meteor.subscribe("singleProduct", this.params._id)
		];
	},

	data: function() {
		return {
			product: Products.findOne(this.params._id),

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
