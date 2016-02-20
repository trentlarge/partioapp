Meteor.methods({
  checkFriendShareCode: function() {
    var _user = Meteor.user();
    var _codeok = false;

    if(!_user.private.promotions) {
      var promotions = { friendShare: { code: '' }}
      Meteor.users.update({"_id": _user._id }, {$set: { "private.promotions": promotions }});
    } else {
      if(!_user.private.promotions.friendShare) {
        var friendShare = { code: '' };
        Meteor.users.update({"_id": _user._id }, {$set: { "private.promotions.friendShare": friendShare }});
      } else {
        if(_user.private.promotions.friendShare.code) {
          var _code = _user.private.promotions.friendShare.code;
          if(_code.length == 6 && _code != ''){
            var _codeok = true;
          }
        }
      }
    }

    var _timelimit = 15;
    var _time = 0;

    Meteor.setTimeout(function(){
      if(!_codeok) {
        var checking = Meteor.setInterval(function(){
          var randomCode = Math.random().toString(36).slice(-6);

          console.log('>>>>>>> friendcode >> new '+randomCode);

          var existingCode = Meteor.users.findOne({'private.promotions.friendShare.code': randomCode });

          if (!existingCode) {
            Meteor.users.update({"_id": _user._id }, {$set: { "private.promotions.friendShare.code": randomCode }}, function(error) {
              if(error) {
                return false;
              }

              console.log('>>>>>>> friendcode >> new saved');
              return true;
            });
            Meteor.clearInterval(checking);
          } else {
            console.log('>>>>>>> friendcode >> code '+randomCode+' already exists, generating a new one');
          }

          _time++;
          //avoinding to loop 4ever for some reason
          if(_time == _timelimit) {
            Meteor.clearInterval(checking);
          }
        }, 2000);
      } else {
        console.log('>>>>>>> friendcode >> ok');
      }
  	}, 1500);
  },
});
