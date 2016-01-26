AnalyticsController = RouteController.extend({
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
            
            analyticsId: this.params._id,
            
            users: Users.find({}).fetch(),
            products: Products.find({}).fetch(),
            connections: Connections.find({}).fetch(),
            transactions: Transactions.find({}).fetch(),
            
            getAnalyticsId: function() {
                return this.analyticsId;
            },
            
            getLenght: function() {
                switch(this.analyticsId) {
                    case 'users': 
                        return this.users.length;
                        break;
                    case 'products': 
                        return this.products.length;
                        break;
                    case 'connections': 
                        return this.connections.length;
                        break;
                    case 'transactions': 
                        var transactionsLength = 0;
                        $.each(this.transactions, function(index, transaction) {
                            transactionsLength += transaction.spending.length;
                        });
                        return transactionsLength;
                        break;
                    default:
                        return 0;
                }
            },
            
            getUsersIdByUniversity: function(uni) {
                
                var users = this.users.filter(function (user) {
                    return (user.emails[0].address.indexOf(uni) >= 0);
                });
                 
                var usersId = [];
                $.each(users, function(index, user) {
                    usersId.push(user._id);
                });
                
                return usersId;
            },
            
            getTotalUsersByUniversity: function(uni) {
                
                var users = this.users.filter(function( user ) {
                    return (user.emails[0].address.indexOf(uni) >= 0);
                });
                
                return users.length;
            },
            
             getTotalByUniversity: function(uni) {
                
                var usersId = this.getUsersIdByUniversity(uni);
                
                var elements;
                
                switch(this.analyticsId) {
                    case 'products': 
                        elements = this.products.filter(function( product ) {
                            return ($.inArray(product.ownerId, usersId) >= 0);
                        });
                        break;
                    case 'connections': 
                        elements = this.connections.filter(function( connection ) {
                            return ($.inArray(connection.owner, usersId) >= 0);
                        });
                        break;
                    case 'transactions': 
                        elements = this.transactions.filter(function( transaction ) {
                            return ($.inArray(transaction.userId, usersId) >= 0);
                        });
                        var transactionsLength = 0;
                        $.each(elements, function(index, transaction) {
                            transactionsLength += transaction.spending.length;
                        });
                        return transactionsLength;
                        break;
                    default:
                        return 0;
                }
                
                return elements.length;
            },
            
                
		};
	},

	onAfterAction: function() {

	}
});
