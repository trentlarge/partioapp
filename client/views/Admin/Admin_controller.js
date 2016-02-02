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
			Meteor.subscribe("products"),
            Meteor.subscribe("allConnections"),
            Meteor.subscribe("transactions")
		];
	},

	data: function() {
        
		return {
            
            user: Users.findOne({_id: Meteor.userId()}),
            users: Users.find({}).fetch(),
            products: Products.find({}).fetch(),
            connections: Connections.find({}).fetch(),
            transactions: Transactions.find({}).fetch(),
            
            isUserPermited: function() {
                
                var permitedUsers = [
                    "talles.souza@duke.edu",
                    "talles@gmail.com",
                    "trentonlarge@gmail.com",
                    "trenton.large@duke.edu",
                    "petar.korponaic@gmail.com",
                    "korponaic@gmail.com",
                    "claytonmarinho@gmail.com",
                    "breno.wd@gmail.com",
                    "lucasbr.dafonseca@gmail.com",
                    "flashblade123@gmail.com",
                    "cw249@duke.edu"
                ];
                
                return ($.inArray(this.user.emails[0].address, permitedUsers) >= 0) ? true : false;
                
            },
            
            getUsersLenght: function() {
                return this.users.length;  
            },
            
            getProductsLenght: function() {
                return this.products.length;  
            },
            
            getConnectionsLenght: function() {
                return this.connections.length;  
            },
            
            getTransactionsLenght: function() {
                var transactionsLength = 0;
                $.each(this.transactions, function(index, transaction) {
                    transactionsLength += transaction.spending.length;
                });
                return transactionsLength;
            },
            
            getUsersIdByUniversity: function(uni) {
                
                var users = this.users.filter(function (user) {
                    return (user.profile.area == uni);
                });
                 
                var usersId = [];
                $.each(users, function(index, user) {
                    usersId.push(user._id);
                });
                
                return usersId;
            },
            
            getTotalUsersByUniversity: function(uni) {
                
                var users = this.users.filter(function( user ) {
                    return (user.profile.area == uni);
                });
                
                return users.length;
            },
            
             getTotalProductsByUniversity: function(uni) {
                 
                var usersId = this.getUsersIdByUniversity(uni);
                 
                var products = this.products.filter(function( product ) {
                    return (product.ownerArea == uni);
                });
                
                return products.length;
            },
            
            getTotalConnectionsByUniversity: function(uni) {
                 
                var usersId = this.getUsersIdByUniversity(uni);
                 
                var connections = this.connections.filter(function( connection ) {
                    return ($.inArray(connection.owner, usersId) >= 0);
                });
                
                return connections.length;
            },
            
            getTotalTransactionsByUniversity: function(uni) {
                 
                var usersId = this.getUsersIdByUniversity(uni);
                 
                var transactions = this.transactions.filter(function( transaction ) {
                    return ($.inArray(transaction.userId, usersId) >= 0);
                });
                
                var transactionsLength = 0;
                
                $.each(transactions, function(index, transaction) {
                    transactionsLength += transaction.spending.length;
                });
                
                return transactionsLength;
            }
                
		};
	},

	onAfterAction: function() {

	}
});
