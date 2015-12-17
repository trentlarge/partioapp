Template.rating.rendered = function () {
  $('.rateit').rateit();
}

Template.rating.helpers({
    
  getRatingNumber: function(ownerId, ownerProfileId) {

      console.log('ownerId: ' + ownerId);
      console.log('ownerProfileId: ' + ownerProfileId);
      
      var _id = Meteor.userId();

      if(ownerId) { _id = ownerId }
      if(ownerProfileId) { _id = ownerProfileId }
      
      var user = Meteor.users.findOne(_id);
      
      console.log(user.profile.name);
      
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
    
  avgRating: function(ownerId, ownerProfileId) {
      
    var _id = Meteor.userId();

    if(ownerId) { _id = ownerId }
    if(ownerProfileId) { _id = ownerProfileId }

    var user = Meteor.users.findOne(_id);
      
    console.log(user.profile.name);

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
