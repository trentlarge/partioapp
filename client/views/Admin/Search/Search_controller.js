AdminSearchController = RouteController.extend({
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

    getElements: function(searchId) {
        
        var subscribeElement;
        
        var limit = Session.get("adminSearchPageNumber") * Session.get("adminSearchPageSize");
        var text = Session.get('adminSearchText');
        
        if(searchId == 'users') {
            Meteor.subscribe("adminSearchUsers", text, limit, function() {
                $('.loadbox').fadeOut();
            });
            return Users.find({ 
                'profile.name': { $regex: ".*"+text+".*", $options: 'i' }, 
            }, { 
                limit: limit, 
                sort: { 'profile.name': 1 }
            }).fetch();
        }
        if(searchId == 'products') {
            Meteor.subscribe("adminSearchProducts", text, limit, function() {
                $('.loadbox').fadeOut();
            });
            return Products.find({ 
                'title': { $regex: ".*"+text+".*", $options: 'i' }, 
            }, { 
                limit: limit, 
                sort: { 'title': 1 }
            }).fetch();
//            return Products.find({}).fetch();
        }
//        if(searchId == 'connections') {
//            Meteor.subscribe("allConnections", function() {
//                $('.loadbox').fadeOut();
//            });
//            return Connections.find({}).fetch();
//        }
//        if(searchId == 'transactions') {
//            Meteor.subscribe("transactions", function() {
//                $('.loadbox').fadeOut();
//            });
//            return Transactions.find({}).fetch();
//        }
        
    },
    
	data: function() {
        
        if(this.params._id === 'users') {
            
            return {
            
                searchId: this.params._id,

                userAdmin: Admins.find({}).fetch(),
                users: this.getElements('users'),

                isUserPermited: function() {
                    return (this.userAdmin.length > 0) ? true : false;
                }, 

                isUserSearch: function() {
                    return (this.searchId === 'users') ? true : false;
                },

            };
        }
        
        if(this.params._id === 'products') {
            
            return {
            
                searchId: this.params._id,

                userAdmin: Admins.find({}).fetch(),
                products: this.getElements('products'),

                isUserPermited: function() {
                    return (this.userAdmin.length > 0) ? true : false;
                }, 
                
                isProductSearch: function() {
                    return (this.searchId === 'products') ? true : false;
                },

            };
            
        }
        
		
	},

	onAfterAction: function() {

	}
});