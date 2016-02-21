Template.shoutout.events({
    
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
        
    }
    
})