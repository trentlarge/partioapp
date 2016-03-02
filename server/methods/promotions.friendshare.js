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
      throw new Meteor.Error("insertBestFriendCode", "Promotional Code: Missing code");
    }

    var code = insertCode.trim();

    if(!code.length == 6) {
      throw new Meteor.Error("insertBestFriendCode", "Promotional Code: Invalid code");
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
        if(!_userChildren.indexOf(_parent._id) >= 0) {

          // update parent children field
          var _parentChildren = _parent.private.promotions.friendShare.children;

          if(!_parentChildren || _parentChildren.length < 1) {
            _parentChildren = [];
          }

          //check if user is not already children of parent
          if(!_parentChildren.indexOf(_user._id) >= 0) {
            var newChildren = { 'id': _user._id,
                                'status': 'waiting' }

            _parentChildren.push(newChildren);

            // update user parent field
            Meteor.users.update({"_id": _user._id }, {$set: { "private.promotions.friendShare.parent": _parent._id }}, function(error) {
              if(error) {
                throw new Meteor.Error("insertBestFriendCode", "Promotional Code: Some error... please try again");
              }

              // update parent children
              Meteor.users.update({"_id": _parent._id }, {$set: { "private.promotions.friendShare.children": _parentChildren }}, function(error) {
                if(error) {
                  throw new Meteor.Error("insertBestFriendCode", "Promotional Code: Some error... please try again");
                }

                var notifyMessage = "You have a new friend code request from "+_user.profile.name;
                var pushMessage = "Promotional Code: You have a new friend code request from "+_user.profile.name;

                sendNotification(_parent._id, _user._id, notifyMessage, "Promotional Code");
                sendPush(_parent._id, pushMessage);

              });
            });

          } else { // user is already children from that
            throw new Meteor.Error("insertBestFriendCode", "Promotional Code: "+_parent.profile.name+" is already your best friend");
          }

        } else { // trying to insert child like parent
          throw new Meteor.Error("insertBestFriendCode", "Promotional Code: "+_parent.profile.name+" is already your friend.");
        }

      } else { // no parent (user not found)
        throw new Meteor.Error("insertBestFriendCode", "Promotional Code: User not found ;)");
      }

    } else { // own code
      throw new Meteor.Error("insertBestFriendCode", "Promotional Code: Ops... this is your own code ;)");
    }
  },

  acceptFriendRequest: function(friendId){
    if(!friendId){
      throw new Meteor.Error("acceptFriendRequest", "Missing user id");
    }

    var _friend = Meteor.users.findOne({ _id: friendId });
    var _parent = Meteor.user();

    //checking if there is friend
    if(!_friend) {
      throw new Meteor.Error("acceptFriendRequest", "User not found");
    }

    //checking friend parent with user id
    if(_friend.private.promotions.friendShare.parent != _parent._id) {
      throw new Meteor.Error("acceptFriendRequest", "Parent id doesn't match");
    }

    //change friend status
    var _parentChildren = _parent.private.promotions.friendShare.children;

    if(!_parentChildren || _parentChildren.length < 1) {
      throw new Meteor.Error("acceptFriendRequest", "User doesn't have friends");
    }

    _parentChildren.map(function(_user){
      if(_user.id == friendId) {
        _user.status = 'accepted';
        _user.timestamp = Date.now();
      }
    });

    // update parent children
    Meteor.users.update({"_id": _parent._id }, {$set: { "private.promotions.friendShare.children": _parentChildren }}, function(error) {
      if(error) {
        throw new Meteor.Error("acceptFriendRequest", "Some error... please try again");
      }

      var notifyMessage = "Congratulations! "+_parent.profile.name+" has accepted your friend request.";
      var pushMessage = "Promotional Code: Congratulations! "+_parent.profile.name+" has accepted your friend request.";

      sendNotification(friendId, _parent._id, notifyMessage, "Promotional Code");
      sendPush(friendId, pushMessage);

      return true;
    });
  },

  declineFriendRequest: function(friendId){
    if(!friendId){
      throw new Meteor.Error("declineFriendRequest", "Missing user id");
    }

    var _friend = Meteor.users.findOne({ _id: friendId });
    var _parent = Meteor.user();

    //checking if there is friend
    if(!_friend) {
      throw new Meteor.Error("acceptFriendRequest", "User not found");
    }

    //checking friend parent with user id
    if(_friend.private.promotions.friendShare.parent != _parent._id) {
      throw new Meteor.Error("acceptFriendRequest", "Parent id doesn't match");
    }

    //change friend status
    var _parentChildren = _parent.private.promotions.friendShare.children;

    if(!_parentChildren || _parentChildren.length < 1) {
      throw new Meteor.Error("acceptFriendRequest", "User doesn't have friends");
    }

    _newParentChildren = [];

    _parentChildren.map(function(_user){
      if(_user.id != friendId) {
        _newParentChildren.push(_user);
      }
    });

    // update parent children
    Meteor.users.update({"_id": _parent._id }, {$set: { "private.promotions.friendShare.children": _newParentChildren }}, function(error) {
      if(error) {
        throw new Meteor.Error("acceptFriendRequest", "Some error... please try again");
      }

      Meteor.users.update({"_id": friendId }, {$set: { "private.promotions.friendShare.parent": "" }}, function(error) {
        if(error) {
          throw new Meteor.Error("acceptFriendRequest", "Some error... please try again");
        }
        return true;
      });
    });
  },

  getParentStatus: function(parentId, callback){
    if(!parentId){
      throw new Meteor.Error("getParentStatus", "Missing parent id");
    }

    var response = Async.runSync(function(done) {

      var _parent = Meteor.users.findOne({ _id: parentId });
      var _friend = Meteor.user();

      if(!_parent) {
        done("Parent not found", false);
      }

      //change friend status
      var _parentChildren = _parent.private.promotions.friendShare.children;

      if(!_parentChildren || _parentChildren.length < 1) {
        done("Parent doesn't have friends", false);
      }

      var _return = false;

      _parentChildren.map(function(_user){
        if(_user.id == _friend._id) {
          _return = _user.status;
        }
      });

      if(_return) {
        done(false, _return);
      } else {
        done('User not found', false);
      }
    });

    if(response.error) {
      throw new Meteor.Error("getParentStatus", response.error);
    } else {
      return response.result;
    }
  },

  getUserChildren: function(idUser){
    console.log(idUser);

    if(!idUser){
      throw new Meteor.Error("getUserChildren", 'missing user id');
    }

    var response = Async.runSync(function(done) {
      var _parent = Meteor.users.findOne({ '_id': idUser });

      if(!_parent) {
        done('Parent not found', false);
      }

      if(!_parent.private.promotions) {
        done('user does not has promotions field', false);
      }

      if(!_parent.private.promotions.friendShare) {
        done('user does not has friendShare field', false);
      }

      if(!_parent.private.promotions.friendShare.children) {
        done('user does not has children', false);
      }

      var children = _parent.private.promotions.friendShare.children;

      if(!children || children.length < 1) {
         done('user does not has children', false);
      }

      var _ids = [];

      children.map(function(child){
        if(child.status == 'accepted') {
          _ids.push(child.id);
        }
      })

      //var _children = Meteor.users.find({'_id': { $in: _ids } }).fetch();
      done(false, _ids);
    });

    if(response.error) {
      throw new Meteor.Error("getUserChildren", response.error);
    } else {
      return response.result;
    }
  }
  
});
