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
			//Meteor.subscribe("singleProduct", this.params._id)
		];
	},

	product: function() {
		var product = Products.findOne(this.params._id);
		if(product) {
			Session.set('productId', product._id);
			return product;
		}
	},

	data: function() {
		return {
			product: this.product(),

			getCategoryIcon: function() {
				if(this.product) {
					return Categories.getCategoryIconByText(this.product.category);
				}
			},

			getCategories: function() {
				return Categories.getCategories();
			},

			selectedCategory: function(category) {
				if(this.product) {
					return (this.product.category == category) ? 'selected' : '';
				}
			},

			getConditions: function() {
				if(this.product) {
					return Rating.getConditions();
				}
			},

			selectCondition: function(index) {
				if(this.product) {
					return (index == this.product.conditionId) ? 'selected' : '';
				}
			},

			sellingStatusChecked: function() {
				if(this.product) {
					if(this.product.selling) {
						return (this.product.selling.status === 'ON') ? 'checked' : '';
					}
				}
			},

			rentingStatusChecked: function() {
				if(this.product) {
					if(this.product.rentPrice) {
						if(this.product.rentPrice.status) {
							return (this.product.rentPrice.status === 'ON') ? 'checked' : '';
						}
						else {
							return 'checked';
						}
					}
				}
			},

			isSellingStatusOn: function() {
				if(this.product) {
					if(this.product.selling) {
						return (this.product.selling.status === 'ON') ? true : false;
					}
				}
			},

			isRentingStatusOn: function() {
				if(this.product) {
					if(this.product.rentPrice) {
						if(this.product.rentPrice.status) {
							return (this.product.rentPrice.status === 'ON') ? true : false;
						}
						else {
							return true;
						}
					}
				}
			},

			isEditMode: function() {
				if(this.product) {
					var ConnectionObj = Connections.findOne({'productData._id': this.product._id});
					if(ConnectionObj){
						var ConnectionStatus = ConnectionObj.state;
						if(ConnectionStatus != "RETURNED"){
							return 'disabled';
						}
					}
				}
				return Session.get('editMode') ? '' : 'disabled';
			},

			editMode: function() {
				if(this.product) {
					var ConnectionObj = Connections.findOne({'productData._id': this.product._id});
					if(ConnectionObj){
						var ConnectionStatus = ConnectionObj.state;
						if(ConnectionStatus != "RETURNED"){
							return false;
						}
					}
				}

				return Session.get('editMode') ? true : false;
			}
		}
	},

	onAfterAction: function() {

	}
});
