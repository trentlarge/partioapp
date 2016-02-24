Template.adminPromotions.onCreated(function () {
  var _thiz = this;

  var _filter = this.data.getFilterId();

  Meteor.subscribe('allUsersByArea', _filter, function(){
    var _userIds = _thiz.data.allUsersId();

    if(_userIds && !_userIds.length < 1) {
      Meteor.subscribe('transactionsByUserId', _userIds);
    }
  });
});

Template.adminPromotions.rendered = function() {
  if(!this.data.isUserPermitted()) {
      return;
  }
}

Template.adminPromotions.events({
  'click .parent': function() {
    $('.children[data-id='+this._id+']').toggleClass('hidden');
  },
});
