Template.updateProfile.rendered = function() {
    $('.updateProfile .button-icon').hide();
};

Template.updateProfile.helpers({
    getMobilePhone: function(){
        var user = Users.findOne({_id: Meteor.userId()});
        return user.private.mobile;
    }
});

Template.updateProfile.events({
  'keypress #input-mobile': function(e, template) {
    $('#input-mobile').inputmask("+1 (999) 999-9999", {placeholder:" " });
  },
    
  'click #updateButton': function(e, template) {
    
    var updatedProfile = {
      mobile: $('#input-mobile').val(),
    };

    Meteor.call("updateUserProfile", updatedProfile, function(err, res) {
      PartioLoad.hide();
      if(err) {
        var errorMessage = err.reason || err.message;
        if(err.details) {
          errorMessage = errorMessage + "\nDetails:\n" + err.details;
        }
        sAlert.error(errorMessage);
        return;
      }
      
      $('.modal .bar button').trigger('click');
        
      Meteor.call('checkProfileFields');
    
    });
  },
});
