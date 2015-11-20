userAvatar = function(userId){
  if(Meteor.users.findOne(userId)) {
      Meteor.users.findOne(userId).profile.avatar === "notSet" ? "/profile_image_placeholder.jpg" : Meteor.users.findOne(userId).profile.avatar;
  } else {
    return false;
  }
}
