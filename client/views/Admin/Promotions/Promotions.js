Template.adminPromotions.onCreated(function () {
  var _thiz = this;

  Meteor.subscribe('all_users',function(){
    var _userIds = _thiz.data.allUsersId();

    if(_userIds && !_userIds.length < 1) {
      Meteor.subscribe('transactionsByUserId', _userIds);
    }
  });
});
