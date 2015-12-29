SearchController = RouteController.extend({
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
      Meteor.subscribe("singleProduct", this.params._id),
      Meteor.subscribe("singleUser", this.params.query.ownerId),
      Meteor.subscribe("ownerConnections", this.params.query.ownerId)
    ];
	},

  product: function() {
    return Products.findOne(this.params._id);
  },

  owner: function() {
    if(this.product()) {
      return Users.findOne(this.product().ownerId);
    }
    return false;
  },

	data: function() {
		return {
      //search: this.search(),
      owner: this.owner(),
      product: this.product(),

      ownerAvatar: function(data) {
        return userAvatar(data);
      },
      isNotOwner: function() {
        return (this.product.ownerId !== Meteor.userId()) ? true : false;
      },
      getCondition: function() {
        return Rating.getConditionByIndex(this.product.conditionId);
      },
      getCategoryIcon: function() {
        return Categories.getCategoryIconByText(this.product.category);
      },
      requestSent: function() {
        return Connections.findOne({"requestor": Meteor.userId(), finished: { $ne: true }, "owner": this.product.ownerId, "productData._id": this.product._id}) ? true : false;
      },
      isBorrowed: function() {
        return Connections.findOne({"requestor": Meteor.userId(), finished: { $ne: true }, "owner": this.product.ownerId, "productData._id": this.product._id, "state":"WAITING"}) ? false : true;
      },
      isUnavailable: function() {
        return Connections.findOne({"owner": this.product.ownerId, finished: { $ne: true }, "productData._id": this.product._id}) ? true : false;
      },
      rating: function() {
        userRating(this.product.userId);
      }
		}
	},

	onAfterAction: function() {

	}
});
