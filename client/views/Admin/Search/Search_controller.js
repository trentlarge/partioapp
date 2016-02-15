AdminSearchController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
		return [

		];
	},

    getElements: function(searchId) {
        
        var subscribeElement;
        
        var limit = Session.get("adminSearchPageNumber") * Session.get("adminSearchPageSize");
        var text = Session.get('adminSearchText');
        
        if(searchId == 'users') {
            Meteor.subscribe("searchUsers", text, limit, function() {
                $('.loadbox').fadeOut();
            });
            return Users.find({ 
                'profile.name': { $regex: ".*"+text+".*", $options: 'i' }, 
            }, { 
                limit: limit, 
                sort: { 'profile.name': 1 }
            }).fetch();
        }
//        if(searchId == 'products') {
//            Meteor.subscribe("products", function() {
//                $('.loadbox').fadeOut();
//            });
//            return Products.find({}).fetch();
//        }
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
        
		return {
            
            searchId: this.params._id,
            
            user: Users.findOne({_id: Meteor.userId()}),
            users: this.getElements('users'),
         
            isUserPermited: function() {
                return ($.inArray(this.user.emails[0].address, Admin.getPermitedUsers()) >= 0) ? true : false;
            }, 
            
            isUserSearch: function() {
                return (this.searchId === 'users') ? true : false;
            },
            
            // USERS
            
            
                
		};
	},

	onAfterAction: function() {

	}
});
