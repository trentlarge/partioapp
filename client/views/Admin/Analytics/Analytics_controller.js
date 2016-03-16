AnalyticsController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
        
        var analyticsId = this.params._id,
            user = Users.findOne({_id: Meteor.userId()}),
            subscribeElement = [
                Meteor.subscribe("userAdmin", user.emails[0].address),
                Meteor.subscribe("users")
            ];
        
        switch(analyticsId) {
            case 'products': 
                subscribeElement.push(Meteor.subscribe("products"));
                break;
            case 'connections': 
                subscribeElement.push(Meteor.subscribe("allConnections"));
                break;
            case 'transactions': 
                subscribeElement.push(Meteor.subscribe("transactions"));
                subscribeElement.push(Meteor.subscribe("allConnections"));
                break;
        }
        
		return subscribeElement;
	},
    
	data: function() {
        
		return {
            
            analyticsId: this.params._id,
            
            userAdmin: Admins.find({}).fetch(),
            user: Users.findOne({ _id: Meteor.userId() }),
            users: Users.find({}, { sort: { 'profile.name': 1 }}).fetch(),
            products: Products.find({}).fetch(),
            connections: Connections.find({}).fetch(),
            transactions: Transactions.find({}).fetch(),
            
            isUserPermited: function() {
                return (this.userAdmin.length > 0) ? true : false;
                //return ($.inArray(this.user.emails[0].address, Admin.getPermitedUsers()) >= 0) ? true : false;  
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
            
            getUserById: function(userId) {
                var reponseUser = {};
                $.each(this.users, function(index, user) {
                    if(user._id == userId) {
                        reponseUser = user;
                        return user;
                    }
                })
                
                return reponseUser;
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
            
            getTotalByUniversity: function(uni) {
                
                var usersId = this.getUsersIdByUniversity(uni);
                
                var elements;
                
                switch(this.analyticsId) {
                    case 'products': 
                        elements = this.products.filter(function( product ) {
                            return (product.ownerArea == uni);
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
            
            getUsersWithPagination: function() {
                
                if(!Session.get('pages')) return;
                
                var usersArray = Users.find({}, { sort: { 'createdAt': -1 }}).fetch();
                var users = [];
                var pages = Session.get('pages');
                var page = pages.total;
                
                for(var i = (page*10); i < ((page+1)*10); i++) {
                    if(usersArray[i]) {
                        users.push(usersArray[i]);
                    }
                }
                
                return users;
            },
            
            getAreaName: function(area) {
                return areaName(area);
            },
            
            getFormattedDate: function(date) {
                return formatDate(date);  
            },
            
            getUsersWithPaginationByUniversity: function(uni) {
                
                if(!Session.get('pages')) return;
                
                var users = [];
                
                var pages = Session.get('pages');
                var page = 0;
                
                if(uni == 1) { page = pages.duke }
                else if(uni == 2) { page = pages.yale }
                else { page = pages.others }
                
                var filterUsers = this.users.filter(function (user) {
                     return (user.profile.area == uni);
                });
                
                for(var i = (page*10); i < ((page+1)*10); i++) {
                    if(filterUsers[i]) {
                        users.push(filterUsers[i]);
                    }
                }
                
                return users;
            },
            
            getUserTotalProducts: function(userId) {
              
                var products = this.products.filter(function (product) {
                     return (product.ownerId == userId);
                });   
                
                return products.length;
            },
            
            getLastUser: function() {
                
                var lastUser = this.users[0];
                
                $.each(this.users, function(index, user) {
                    
                    if(Number(user.createdAt) > Number(lastUser.createdAt)) {
                        lastUser = user;
                    }
                });
                
                var user = {
                    name: lastUser.profile.name,
                    avatar: lastUser.profile.avatar,
                    createdAt: formatDate(lastUser.createdAt)
                }
                
                return user;
            },
            
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
                
                return users;
                
            },
            
            getUsersByDays: function() {
                
                var todayDate = new Date();
                var today = {
                    day: todayDate.getDay(),
                    week: getWeekNumber(todayDate),
                    month: todayDate.getMonth(), //January is 0!
                    year: todayDate.getFullYear()
                };
                
                var users = [0, 0, 0, 0, 0, 0, 0];
                
                $.each(this.users, function(index, user) {
                   
                    var date = new Date(user.createdAt);
                    var userDate = {
                        day: date.getDay(),
                        week: getWeekNumber(date),
                        month: date.getMonth(),
                        year: date.getFullYear()
                    };
                    
                    if(userDate.year === today.year && userDate.month === today.month && userDate.week[1] === today.week[1]) {
                        users[userDate.day]++;  
                    };
                    
                });
                
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
            
            getConnections: function() {
                return this.connections;
            },
            
            getTotalConnections: function() {
                return this.connections.length;
            },
            
            getBorrowConnectionsAverageDaysAndPrice: function() {
                
                states = ["IN USE", "DONE", "RETURNED"];
                
                var connections = this.connections.filter(function(connection) {
                   return ($.inArray(connection.state, states) >= 0); 
                }),
                    totalDays = 0,
                    totalPrice = 0.00,
                    average = {
                        days: 0,
                        price: 0.00,
                        totalPrice: 0.00
                    }
                
                $.each(connections, function(index, connection) {
                    totalDays += connection.borrowDetails.date.totalDays;
                    totalPrice += parseFloat(connection.borrowDetails.price.total);
                });
                
                if(connections.length > 0) {
                    average = {
                        days: Number(totalDays/connections.length).toFixed(0),
                        price: Number(totalPrice/connections.length).toFixed(2),
                        totalPrice: Number(totalPrice).toFixed(2),
                    }
                }
                
                return average;
            },
            
            getPurchasingConnectionsAveragePrice: function() {
                
                states = ["SOLD", "SOLD CONFIRMED"];
                
                var connections = this.connections.filter(function(connection) {
                   return ($.inArray(connection.state, states) >= 0); 
                });
                
                var totalPrice = 0.00,
                    average = {
                        price: 0.00,
                        totalPrice: 0.00
                    };
                
                $.each(connections, function(index, connection) {
                    totalPrice += parseFloat(connection.borrowDetails.price.total);
                });
                
                if(totalPrice > 0) {
                    average.price = Number(totalPrice/connections.length).toFixed(2);
                    average.totalPrice = Number(totalPrice).toFixed(2);
                }
                
                return average;
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
            
            getConnectionsWithPagination: function() {
                
                if(!Session.get('pages')) return;
                
                var connections = [];
                
                var pages = Session.get('pages');
                var page = pages.connections;
                
                for(var i = (page*10); i < ((page+1)*10); i++) {
                    if(this.connections[i]) {
                        connections.push(this.connections[i]);
                    }
                }
                
                return connections;
            },
            
            // TRANSACTIONS METHODS
            
            getTotalTransactions: function() {
              
                var totalTransactions = 0;
                
                $.each(this.transactions, function(index, transaction) {
                    totalTransactions += transaction.spending.length;
                });
                
                return totalTransactions;
            },
            
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
                
                var averageSpending = 0.00,
                    numberTransactions = 0;
                
                $.each(this.transactions, function(index, transaction) {
                   
                    $.each(transaction.spending, function(key, spend) {
                        averageSpending += parseFloat(spend.paidAmount);
                        numberTransactions++;
                    });
                });
                
                if(numberTransactions > 0) {
                    averageSpending = Number(averageSpending/numberTransactions).toFixed(2);
                }
                
                return averageSpending;
            },
            
            getTotalPartioEarning: function() {
                
                var averageEarning = 0;
                
                $.each(this.connections, function(index, connection) {
                    if(connection.charge) {
                        averageEarning += connection.charge.amount;
                    }
                });
                
                averageEarning = Number(averageEarning*0.001).toFixed(2);
                
                return averageEarning;
            },
            
            
            getAveragePartioEarning: function() {
                
                var averageEarning = 0,
                    numberTransactions = 0;
                
                $.each(this.connections, function(index, connection) {
                    if(connection.charge) {
                        averageEarning += connection.charge.amount;
                        numberTransactions++;
                    }
                });
                
                averageEarning = Number((averageEarning/numberTransactions)*0.001).toFixed(2);
                
                return averageEarning;
                
            },
            
            getTransactionsWithPagination: function() {
                
                if(!Session.get('pages')) return;
                
                var transactions = [],
                    self = this;
                
                $.each(this.transactions, function(index, transaction) {
                   
                    var user = self.getUserById(transaction.userId)
                    
                    $.each(transaction.spending, function(key, spend) {

                        var owner = undefined; 
                        
                        if(spend.userId) {
                            owner = self.getUserById(spend.userId)
                        }
                        
                        transactions.push({
                            'requestor': (function() {
                                return (user && user.profile) ? user.profile.name : 'User Deleted';
                            })(),
                            'owner': (function() {
                                return (owner && owner.profile) ? owner.profile.name : 'Not Available';
                            })(),
                            'product': spend.productName,
                            'value': spend.paidAmount
                        });
                    });
                });
                
                var trans = [],
                    pages = Session.get('pages'),
                    page = pages.transactions;
                
                for(var i = (page*10); i < ((page+1)*10); i++) {
                    if(transactions[i]) {
                        trans.push(transactions[i]);
                    }
                }
                
                return trans;
            },
            
		};
	},

	onAfterAction: function() {

	}
});
