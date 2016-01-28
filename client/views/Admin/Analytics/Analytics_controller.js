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
                
                soldProducts.averagePrice = Number(soldProducts.averagePrice).toFixed(2);
                
                return soldProducts;
            },
            
            // CONNECTIONS METHODS
            
            getBorrowConnectionsAverageDaysAndPrice: function() {
                
                states = ["IN USE", "DONE", "RETURNED"];
                
                var connections = this.connections.filter(function(connection) {
                   return ($.inArray(connection.state, states) >= 0); 
                });
                
                var totalDays = 0;
                var totalPrice = 0.00
                
                $.each(connections, function(index, connection) {
                    totalDays += connection.borrowDetails.date.totalDays;
                    totalPrice += parseFloat(connection.borrowDetails.price.total);
                });
                
                var average = {
                    days: Number(totalDays/connections.length).toFixed(0),
                    price: Number(totalPrice/connections.length).toFixed(2)
                } 
                
                return average;
            },
            
            getPurchasingConnectionsAveragePrice: function() {
                
                states = ["SOLD", "SOLD CONFIRMED"];
                
                var connections = this.connections.filter(function(connection) {
                   return ($.inArray(connection.state, states) >= 0); 
                });
                
                var totalPrice = 0.00
                
                $.each(connections, function(index, connection) {
                    totalPrice += parseFloat(connection.borrowDetails.price.total);
                });
                
                var averagePrice = Number(totalPrice/connections.length).toFixed(2)
                
                return averagePrice;
            },
            
            getConnectionsFinished: function() {
                
                var connections = this.connections.filter(function(connection) {
                   return (connection.finished === true); 
                });
                
                return connections.length;
            },
            
            getConnectionsInProgress: function() {
                
                var connections = this.connections.filter(function(connection) {
                   return !(connection.finished === true); 
                });
                
                return connections.length;
            },
            
            getBorrowConnectionsByState: function() {
                
                states = ["WAITING", "PAYMENT", "IN USE", "DONE", "RETURNED"];
                
                var connections = [0, 0, 0, 0, 0];
                
                $.each(this.connections, function(index, connection) {
                    if($.inArray(connection.state, states) >= 0 && !connection.finished) {
                        connections[$.inArray(connection.state, states)]++;
                    }
                });
                
                return connections;
                
            },
            
            getBorrowConnectionsByStateFinished: function() {
                
                states = ["WAITING", "PAYMENT", "IN USE", "DONE", "RETURNED"];
                
                var connections = [0, 0, 0, 0, 0];
                
                 $.each(this.connections, function(index, connection) {
                    if($.inArray(connection.state, states) >= 0 && connection.finished) {
                        connections[$.inArray(connection.state, states)]++;
                    }
                });
                
                return connections;
                
            },
            
            getPurchasingConnectionsByState: function() {
                
                states = ["WAITING PURCHASING", "PAYMENT PURCHASING", "SOLD", "SOLD CONFIRMED"];
                
                var connections = [0, 0, 0, 0];
                
                 $.each(this.connections, function(index, connection) {
                    if($.inArray(connection.state, states) >= 0 && !connection.finished) {
                        connections[$.inArray(connection.state, states)]++;
                    }
                });
                
                return connections;
                
            },
            
            getPurchasingConnectionsByStateFinished: function() {
                
                states = ["WAITING PURCHASING", "PAYMENT PURCHASING", "SOLD", "SOLD CONFIRMED"];
                
                var connections = [0, 0, 0, 0];
                
                 $.each(this.connections, function(index, connection) {
                    if($.inArray(connection.state, states) >= 0 && connection.finished) {
                        connections[$.inArray(connection.state, states)]++;
                    }
                });
                
                return connections;
                
            },
            
            getConnectionsRequestedByMonth: function() {
                
                var todayDate = new Date();
                var today = {
                    day: todayDate.getDate(),
                    month: todayDate.getMonth(), //January is 0!
                    year: todayDate.getFullYear()
                };
                
                var connections = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                
                $.each(this.connections, function(index, conenction) {
                   
                    var date = new Date(conenction.requestDate);
                    var conenctionDate = {
                        month: date.getMonth(),
                        year: date.getFullYear()
                    };
                    
                    if(conenctionDate.year === conenctionDate.year) {
                        connections[conenctionDate.month]++;  
                    };
                    
                });

                return connections;
                
            },
            
            // TRANSACTIONS METHODS
            
            getTotalSpending: function() {
                
                var averageSpending = 0.00;
                
                $.each(this.transactions, function(index, transaction) {
                   
                    $.each(transaction.spending, function(key, spend) {
                        averageSpending += parseFloat(spend.paidAmount);
                    });
                });
                
                averageSpending = Number(averageSpending).toFixed(2);
                
                return averageSpending;
            },
            
            getAverageSpending: function() {
                
                var averageSpending = 0.00;
                var numberTransactions = 0;
                
                $.each(this.transactions, function(index, transaction) {
                   
                    $.each(transaction.spending, function(key, spend) {
                        averageSpending += parseFloat(spend.paidAmount);
                        numberTransactions++;
                    });
                });
                
                averageSpending = Number(averageSpending/numberTransactions).toFixed(2);
                
                return averageSpending;
            }
            
		};
	},

	onAfterAction: function() {

	}
});