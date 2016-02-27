Template.myItems.rendered = function() {
    
    if(Session.get('isConnectScreen')) {
        Session.set('isConnectScreen', false);
    }
    else {
        Session.set('tabBorrowed', false);
        Session.set('tabRequests', false);
        Session.set('isConnections', false);
    }
}

Template.myItems.helpers({
   
    tabBorrowed: function() {
        return Session.get('tabBorrowed');
    },
    tabRequests: function() {
        return Session.get('tabRequests');
    },
    isConnections: function() {
        return Session.get('isConnections');
    }
    
});

Template.myItems.events({
    
    'click #tabInventory': function(e) {
		Session.set('tabRequests', false);
        Session.set('isConnections', false);
	},
    
	'click #tabRequests': function() {
        Session.set('tabRequests', true);
        Session.set('isConnections', true);
	},    
    
    'click #tabShared': function(e, template) {
        Session.set('tabBorrowed', false);
        Session.set('tabRequests', false);
        Session.set('isConnections', false);
    },
    
    'click #tabBorrowed': function(e, template) {
        Session.set('tabBorrowed', true);
        Session.set('isConnections', true);
    }
    
})