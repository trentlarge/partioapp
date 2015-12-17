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

            getCategoryIcon: function() {
                return Categories.getCategoryIconByText(this.product.category);
            },
            
            getConditions: function() {
                return Rating.getConditions();  
            },
            
            selectCondition: function(index) {
                return (index == this.product.conditionId) ? 'selected' : '';  
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
