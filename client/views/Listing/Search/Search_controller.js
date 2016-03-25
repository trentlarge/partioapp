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
		];
	},

	product: function() {
		var _product = Products.findOne(this.params._id);
		if(_product){
			return _product
		}
		return false;
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
				if(this.product){
					return (this.product.ownerId !== Meteor.userId()) ? true : false;
				}
			},
			getCondition: function() {
				if(this.product){
					return Rating.getConditionByIndex(this.product.conditionId);
				}
			},
			getCategoryIcon: function() {
				if(this.product){
					return Categories.getCategoryIconByText(this.product.category);
				}
			},
			requestSent: function() {
				if(this.product){
					return Connections.findOne({"requestor": Meteor.userId(), finished: { $ne: true }, "owner": this.product.ownerId, "productData._id": this.product._id}) ? true : false;
				}
			},
			isPurchasingByUser: function() {
				return this.product.purchasing;
			},
			isBorrowedByUser: function() {
				if(this.product){
					return Connections.findOne({"requestor": Meteor.userId(), finished: { $ne: true }, "owner": this.product.ownerId, "productData._id": this.product._id, "state":"WAITING"}) ? true : false;
				}
			},
			isUnavailable: function() {
				if(this.product){
					return Connections.findOne({"owner": this.product.ownerId, finished: { $ne: true }, "productData._id": this.product._id}) ? true : false;
				}
			},
			isSellingStatusOn: function() {
				if(this.product){
					if(this.product.selling){
						return (this.product.selling.status === 'ON') ? true : false;
					}
				}
			},
			isRentingStatusOn: function() {
				if(this.product){
					if(this.product.rentPrice && this.product.rentPrice.status){
						return (this.product.rentPrice.status === 'ON') ? true : false;
					}
					else {
						return true;
					}
				}
			},
			rating: function() {
				if(this.product){
					userRating(this.product.userId);
				}
			}
		}
	},

	onAfterAction: function() {

	}
});
