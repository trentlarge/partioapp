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
                    "petar.korponaic@gmail.com",
                    "korponaic@gmail.com",
                    "claytonmarinho@gmail.com",
                    "breno.wd@gmail.com",
                    "lucasbr.dafonseca@gmail.com",
                    "flashblade123@gmail.com"
                ];
                
                return ($.inArray(this.user.emails[0].address, permitedUsers) >= 0) ? true : false;
                
            },
            
            getAnalyticsId: function() {
                return this.analyticsId;
            },
            
            isUserAnalytics: function() {
                return (this.analyticsId === 'users') ? true : false;
            },
            
            isProductsAnalytics: function() {
                return (this.analyticsId === 'products') ? true : false;
            },
            
            isConnectionsAnalytics: function() {
                return (this.analyticsId === 'connections') ? true : false;
            },
            
            isTransactionsAnalytics: function() {
                return (this.analyticsId === 'transactions') ? true : false;
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
            
            // USERS METHODS
            
            getUsersByMonth: function() {
                
                var todayDate = new Date();
                var today = {
                    day: todayDate.getDate(),
                    month: todayDate.getMonth(), //January is 0!
                    year: todayDate.getFullYear()
                };
                
                var users = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                
                $.each(this.users, function(index, user) {
                   
                    var date = new Date(user.createdAt);
                    var userDate = {
                        month: date.getMonth(),
                        year: date.getFullYear()
                    };
                    
                    if(userDate.year === today.year) {
                        users[userDate.month]++;  
                    };
                    
                });
                
                console.log(users);
                
                return users;
                
            },
            
            // PRODUCTS METHODS
            
            getProductsByCategories: function() {
              
                var categories = Categories.getAllCategoriesText();
                
                var products = [];
                for(var i=0; i<categories.length; i++) {
                    products.push(0);
                }
                
                $.each(this.products, function(index, product) {
                    products[$.inArray(product.category, categories)]++;
                });
                
                console.log(products);
                
                return products;
            },
            
            getSoldProducts: function() {
                
                var products = this.products.filter(function(product) {
                    return (product.sold === true)
                });
                
                var soldProducts = {
                    total: products.length,
                    averagePrice: 0.00
                };
                
                $.each(products, function(index, product) {
                    soldProducts.averagePrice += parseFloat(product.selling.price);
                })
                
                return soldProducts;
            }
                
		};
	},

	onAfterAction: function() {

	}
});
