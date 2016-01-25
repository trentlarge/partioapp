AdminController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
		return [
            Meteor.subscribe("users"),
			Meteor.subscribe("products")
		];
	},

	data: function() {
        
		return {
            
            users: Users.find({}).fetch(),
            products: Products.find({}).fetch(),
            
            getUsersLenght: function() {
                return this.users.length;  
            },
            
            getProductsLenght: function() {
                return this.products.length;  
            },
            
            getTotalUsersByUniversity: function(uni) {
                var users = this.users.filter(function( user ) {
                    return (user.emails[0].address.indexOf(uni) >= 0);
                });
                
                return users.length;
            },
            
             getTotalProductsByUniversity: function(uni) {
                 
                var self = this;
                 
                var users = this.users.filter(function (user) {
                    return (user.emails[0].address.indexOf(uni) >= 0);
                });
                 
                var usersId = [];
                $.each(users, function(index, user) {
                    usersId.push(user._id);
                });
                 
                var products = this.products.filter(function( product ) {
                    return ($.inArray(product.ownerId, usersId) >= 0);
                });
                
                return products.length;
            }
                
		};
	},

	onAfterAction: function() {

	}
});
