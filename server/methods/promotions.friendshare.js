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

  insertBestFriendCode: function(insertCode){
    if(!insertCode){
      return false;
    }

    var code = insertCode.trim();

    if(!code.length == 6) {
      return false;
    }

    var _user = Meteor.user();

    // check if that is not the user own code
    if(_user.private.promotions.friendShare.code != code){

      // check if there is a user and he is verified
      var _parent = Meteor.users.findOne({ $and: [ { 'private.promotions.friendShare.code': code }, { 'emails.0.verified': true }] });

      if(_parent) {
        var _userChildren = _user.private.promotions.friendShare.children;

        if(!_userChildren || _userChildren.length < 1) {
          _userChildren = [];
        }

        // check if parent is not children
        if(!_userChildren.has(_parent._id)) {

          // update user parent field
          Meteor.users.update({"_id": _user._id }, {$set: { "private.promotions.friendShare.parent": _parent._id }}, function(error) {
            if(error) {
              return false;
            }

            // update parent childrends field
            var _parentChildren = _parent.private.promotions.friendShare.children;

            if(!_parentChildren || _parentChildren.length < 1) {
              _parentChildren = [];
            }

            //check if user is not already children of parent
            if(!_parentChildren.has(_user._id)) {
              _parentChildren.push(_user._id);

              Meteor.users.update({"_id": _parent._id }, {$set: { "private.promotions.friendShare.children": _parentChildren }}, function(error) {
                if(error) {
                  return false;
                }
                return true;
              });

            } else { // user is already children from that
              return false;
            }
          });

        } else { // trying to insert child like parent
          return false;
        }

      } else { // no parent (user not found)
        return false;
      }

    } else { // own code
      return false;
    }
  }
});
