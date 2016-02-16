AdminSearchDetailsController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
		var user = Users.findOne({_id: Meteor.userId()});
        
		return [
            Meteor.subscribe("userAdmin", user.emails[0].address),
		];
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

	data: function() {

        if(this.params._id === 'users') {
            
            return {

                searchId: this.params._id,
                userId: this.params.elementId,

                userAdmin: Admins.find({}).fetch(),
                
                user: this.getUser(this.params.elementId),
                userProducts: this.getUserProducts(this.params.elementId),
                userConnections: this.getUserConnections(this.params.elementId),
                userTransactions: this.getUserTransactions(this.params.elementId),

                isUserPermited: function() {
                    return (this.userAdmin.length > 0) ? true : false;
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
	},

	onAfterAction: function() {

	}
});
