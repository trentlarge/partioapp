Template.rating.rendered = function () {
  $('.rateit').rateit();
}

Template.rating.helpers({
    
  getRatingNumber: function(requestorId, requestorProfileId, profileId) {
      
      var _id = undefined;
      
      if(profileId) { _id = profileId }
      if(requestorId) { _id = requestorId }
      if(requestorProfileId) { _id = requestorProfileId }
      
      var user = Meteor.users.findOne(_id);
      
      if(user && user.profile && user.profile.rating) {
          
          if(user.profile.rating.length === 1) {
              return user.profile.rating.length + ' rating';
          }
          else if(user.profile.rating.length > 1) {
              return user.profile.rating.length + ' ratings';
          }
          return 'Not rated yet';
      }
      
      return 'Not rated yet';
  },
    
  avgRating: function(requestorId, requestorProfileId, profileId) {
      
    var _id = undefined;

    if(profileId) { _id = profileId }
    if(requestorId) { _id = requestorId }
    if(requestorProfileId) { _id = requestorProfileId }

    var user = Meteor.users.findOne(_id);

    if(user && user.profile && user.profile.rating) {
      if (user.profile.rating.length >= 1) {
        var ratingArray = user.profile.rating;
        var totalCount = ratingArray.length;
        var sum = _.reduce(ratingArray, function(memo, num) {
          return Number(memo) + Number(num);
        });
        return parseFloat(sum/totalCount).toFixed(1);
      }
    }

    return "5.0";
  }
});
