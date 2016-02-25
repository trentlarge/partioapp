Template.adminPromotions.onCreated(function () {
  var thiz = this;

  this.subscribe("adminVerifiedUsers", function(){
    var _parents = thiz.data.allUsers();

    var _ids = []

    _parents.map(function(user){
      _ids.push(user._id);
    });

    thiz.subscribe("transactionsByUserId", _ids);
  });

});

Template.adminPromotions.rendered = function() {
  if(!this.data.isUserPermitted()) {
      return;
  }

}

// Template.adminPromotions.helpers({


// usersByArea: function(){
//         return Meteor.users.find({ 'profile.area': this.getFilterId }).fetch()
//       },


// });




// Template.adminPromotions.events({
//   'click .parent': function() {
//     $('.children[data-id='+this._id+']').toggleClass('hidden');
//   },
// });
