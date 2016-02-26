Template.updateProfile.rendered = function() {
    $('.updateProfile .button-icon').hide();
//     $('#input-birthDate').inputmask({"mask": "99/99/9999"});
//     $('#input-birthDate').datepicker({
//       startView: 'decade',
//       endDate: '-16y',
//     });  

};

Template.updateProfile.helpers({
  user: function(){
      return Meteor.user();
  }
});

Template.updateProfile.events({
  'keypress #input-mobile': function(e, template) {
    $('#input-mobile').inputmask("+1 (999) 999-9999", {placeholder:" " });
  },

  'keypress #input-birthDate': function(e, template) {
    $('#input-birthDate').inputmask("99/99/9999", {placeholder:" " });
  },
    
  'click #updateButton': function(e, template) {
    var updatedProfile = {
      mobile: $('#input-mobile').val(),
      birthDate: $('#input-birthDate').val(),
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
        
      //Meteor.call('checkProfileFields');
    });
  },
});
