AdminSearchDetailsController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
		return [
//            Meteor.subscribe("userAdmin", user.emails[0].address),
            Meteor.subscribe("admins")
		];
	},
    
    getUserAdmin: function() {
        var user = Meteor.user();
        return Admins.findOne({email: user.emails[0].address});
    },
    
    getAdmins: function() {
        return Admins.find({}).fetch();  
    },
    
    getUser: function(userId) {
        Meteor.subscribe('searchSingleUser', userId);
        return Users.findOne(userId);
    },
    
    getUserProducts: function(userId) {
        Meteor.subscribe('adminSearchOwnerProducts', userId);
        return Products.find({ ownerId: userId }).fetch();
    },
    
    getUserConnections: function(userId) {
        Meteor.subscribe('adminSearchUserConnections', userId);
        return Connections.find({ $or: [ { "owner": userId }, { "requestor": userId } ] }).fetch();
    },
    
    getUserTransactions: function(userId) {
        Meteor.subscribe('adminSearchUserTransactions', userId);
        return Transactions.findOne({ "userId": userId });
    },
    
    getProduct: function(productId) {
        Meteor.subscribe('singleProduct', productId);
        var product = Products.findOne(productId);
        if(product) {
            Meteor.subscribe('searchSingleUser', product.ownerId);
            return product;
        }
    },
    
    getConnection: function(connectionId) {
        Meteor.subscribe('adminSingleConnection', connectionId);
        return Connections.findOne(connectionId);
    },

	data: function() {

        if(this.params._id === 'users') {
            
            return {

                searchId: this.params._id,
                userId: this.params.elementId,
                userAdmin: this.getUserAdmin(),
                admins: this.getAdmins(),
                
                user: this.getUser(this.params.elementId),
                userProducts: this.getUserProducts(this.params.elementId),
                userConnections: this.getUserConnections(this.params.elementId),
                userTransactions: this.getUserTransactions(this.params.elementId),

                isUserPermited: function() {
                    return (this.userAdmin) ? true : false;
                },  
                
                userCanUpdate: function() {
                    //check if user is not admin
                    if(this.user.emails[0]) {
                        var admin = Admins.findOne({email: this.user.emails[0].address, admin: true});
                        if(!admin) {
                            return this.userAdmin.permissions.update;
                        }
                        return false;
                    }
                },
                
                userCanDelete: function() {
                    //check if user is not admin
                    if(this.user.emails[0]) {
                        var admin = Admins.findOne({email: this.user.emails[0].address, admin: true});
                        if(!admin) {
                            return this.userAdmin.permissions.delete;
                        }
                        return false;
                    }
                },

                isUserDetails: function() {
                    return (this.searchId === 'users') ? true : false;
                },

                getUserProductsLength: function() {
                    return this.userProducts.length;
                },
                
                getUserConnectionsOwnerLength: function() {
                    if(!this.userConnections) return;
                    
                    var self = this;
                    
                    var connections = this.userConnections.filter(function(connection) {
                        return (connection.owner == self.userId);
                    })
                    
                    return connections.length;
                },
                
                getUserConnectionsRequestorLength: function() {
                    if(!this.userConnections) return;
                    
                    var self = this;
                    
                    var connections = this.userConnections.filter(function(connection) {
                        return (connection.requestor == self.userId);
                    })
                    
                    return connections.length;
                },
                
                getUserTransactionsSpendingLength: function() {
                    if(this.userTransactions && this.userTransactions.spending) {
                        return this.userTransactions.spending.length;
                    }
                    else {  
                        return 0;
                    }
                },
                
                getUserTransactionsEarningLength: function() {
                    if(this.userTransactions && this.userTransactions.earning) {
                        return this.userTransactions.earning.length;
                    }
                    else {
                        return 0;
                    }
                },

            }
        }
            
        else if(this.params._id === 'products') {
            
            return {
                
                searchId: this.params._id,
                productId: this.params.elementId,
                userAdmin: this.getUserAdmin(),
                
                product: this.getProduct(this.params.elementId),

                isUserPermited: function() {
                    return (this.userAdmin) ? true : false;
                },  
                
                getUser: function(userId) {
                    return Users.findOne(userId);    
                },
                
                isProductDetails: function() {
                    return (this.searchId === 'products') ? true : false;
                },
                
                getCategories: function() {
                    Session.set('selectedCategory', this.product.category);
                    return Categories.getCategories();
                },

                getConditions: function() {
                    Session.set('selectedCondition', this.product.conditionId);
                    return Rating.getConditions();
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

            }
            
        }
        
        else if(this.params._id === 'connections') {
            
             return {
                
                searchId: this.params._id,
                productId: this.params.elementId,
                userAdmin: this.getUserAdmin(), 
                
                connection: this.getConnection(this.params.elementId),

                isUserPermited: function() {
                    return (this.userAdmin) ? true : false;
                },  
                
                getUser: function(userId) {
                    return Users.findOne(userId);    
                },
                
                isConnectionDetails: function() {
                    return (this.searchId === 'connections') ? true : false;
                },
                 
                formatDate: function(date) {
                    return formatDate(date);
                },
                 
                getTime: function(date) {
                    var time = new Date(date),
                        hours = time.getHours(),
                        minutes = time.getMinutes(),
                        seconds = time.getSeconds();
                        
                    if(hours < 10) { hours = '0' + hours; }
                    if(minutes < 10) { minutes = '0' + minutes; }
                    if(seconds < 10) { seconds = '0' + seconds; }
                    
                    return '(' + hours + ':' + minutes + ':' + seconds + ')';
                }

            }
            
        }
        
	},

	onAfterAction: function() {

	}
});
