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
    },
    'iconRandom': function() {
        return Random.choice(['ion-ios-book',
                              'ion-ios-game-controller-b',
                              'ion-headphone',
                              'ion-android-restaurant',
                              'ion-ios-americanfootball',
                              'ion-cube']);
    }
    
});

Template.myItems.events({
    
    'click #tabInventory': function(e) {
        
        if(!Session.get('tabRequests') && !Session.get('isConnections')) {
            return;
        }
        
        $('.items-list').fadeOut(function() {
            Session.set('tabRequests', false);
            Session.set('isConnections', false);
           
            $('.loadbox').fadeIn('fast', function () {
//                setTimeout(function(){
//                    $('.items-list').fadeIn('fast');
//                }, 500);
            });
        });
		
	},
    
	'click #tabRequests': function() {
        
        if(Session.get('tabRequests') && Session.get('isConnections')) {
            return;
        }
        
        $('.items-list').fadeOut(function() {
            Session.set('tabRequests', true);
            Session.set('isConnections', true);
            
            $('.loadbox').fadeIn('fast', function () {    
//                setTimeout(function(){
//                    $('.items-list').fadeIn('fast');
//                }, 500);
            });
        });
	},    
    
    'click #tabShared': function(e, template) {
        
        if(!Session.get('tabRequests') && !Session.get('isConnections') && !Session.get('tabBorrowed')) {
            return;
        }
        
        $('.items-list').fadeOut(function() {
            Session.set('tabBorrowed', false);
            Session.set('tabRequests', false);
            Session.set('isConnections', false);
            
            $('.loadbox').fadeIn('fast', function () {
//                setTimeout(function(){
//                    $('.items-list').fadeIn('fast');
//                }, 500);
            });
        });
    },
    
    'click #tabBorrowed': function(e, template) {
        
        if(Session.get('isConnections') && Session.get('tabBorrowed')) {
            return;
        }
        
        $('.items-list').fadeOut(function() {
            Session.set('tabBorrowed', true);
            Session.set('isConnections', true);
            
            $('.loadbox').fadeIn('fast', function () {
//                setTimeout(function(){
//                    $('.items-list').fadeIn('fast');
//                }, 500);
            });
        });
    }
    
})