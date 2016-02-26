Template.adminPromotions.onCreated(function () {
  if(!this.data.isUserPermitted()) {
      return;
  }

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

// Template.adminPromotions.rendered = function() {
//   if(!this.data.isUserPermitted()) {
//       return;
//   }
// }