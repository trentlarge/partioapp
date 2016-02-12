Template.shoutout.rendered = function() {
    Session.set('shoutsPageNumber', 1);
    Session.set('shoutsPageSize', 15);
}

Template.shoutout.destroyed = function() {
    Session.set('shoutsPageNumber', 1);
    Session.set('shoutsPageSize', 15);
}

Template.shoutout.helpers({
   
    isActivated: function(index) {
        if(index == 0 && !Session.get('tabMyShouts')) {
            return 'active';
        }
        else if(index == 1 && Session.get('tabMyShouts')) {
            return 'active';
        }
        return '';
    }
    
});

Template.shoutout.events({
    
    'scroll .overflow-scroll': function(e, t) {
        var parent = t.$(e.currentTarget);

        var pageNumber = Session.get('shoutsPageNumber');
        var pageSize = Session.get('shoutsPageSize');

        if($('.card').length < pageNumber * pageSize) {
            return;
        }

        //if(parent.scrollTop() + parent.height() >= scrollingElement.innerHeight() + 20) {
        if(parent.scrollTop() + parent.height() >= parent[0].scrollHeight) {        
            $('.loadbox').fadeIn('fast',function(){
                var pageNumber = Session.get('shoutsPageNumber');
                Session.set("shoutsPageNumber", pageNumber + 1);
            });
        }
    },
    
    'click #shoutSubmit': function(e, template) {
        
        var message = $('#messageInput').val();
        if(message == '') return;
        
        $('#messageInput').val('');
        
        Meteor.call('insertShoutOut', Meteor.userId(), message, function(err, res) {
          PartioLoad.hide();
          if(err) {
            var errorMessage = err.reason || err.message;
            if(err.details) {
              errorMessage = errorMessage + "\nDetails:\n" + err.details;
            }
            sAlert.error(errorMessage);
            return;
          }  
        });
        
    },
    
    'click #tabShoutOut': function(e, template) {
        
        var tabShoutOut = $('#tabShoutOut');
        var tabMyShouts = $('#tabMyShouts');
        
        if(tabShoutOut.hasClass('active')) return;
        
        tabMyShouts.removeClass('active');
        tabShoutOut.addClass('active');
        
        $('.list').fadeOut('fast', function() {
           
            $('.loadbox').fadeIn('fast', function () {
                Session.set('tabMyShouts', false);
                Session.set('shoutsPageNumber', 1);
                Session.set('shoutsPageSize', 15);
                
                $('.list').fadeIn();
            });
        });
    },
    
    'click #tabMyShouts': function(e, template) {
        
        var tabShoutOut = $('#tabShoutOut');
        var tabMyShouts = $('#tabMyShouts');
        
        if(tabMyShouts.hasClass('active')) return;
        
        tabShoutOut.removeClass('active');
        tabMyShouts.addClass('active');
        
        $('.list').fadeOut('fast', function() {
        
            $('.loadbox').fadeIn('fast', function () {
                Session.set('tabMyShouts', true);
                Session.set('shoutsPageNumber', 1);
                Session.set('shoutsPageSize', 15);
                
                $('.list').fadeIn();
            }); 
        });
    }
    
})