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

	data: function() {
		return {
			product: Products.findOne(this.params._id),

      getCategoryIcon: function() {
        if(this.product) {
          return Categories.getCategoryIconByText(this.product.category);
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
            
      isSellingStatusOn: function() {
          if(this.product) {
            if(this.product.selling) {
                return (this.product.selling.status === 'ON') ? true : false;
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
