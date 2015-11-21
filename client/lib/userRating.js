userRating = function(userId) {
  if (Meteor.users.findOne(userId).profile.rating) {
    if (Meteor.users.findOne(userId).profile.rating.length > 1) {
      var ratingArray = Meteor.users.findOne(userId).profile.rating;
      var totalCount = ratingArray.length;
      var sum = _.reduce(ratingArray, function(memo, num) {
        return (Number(memo) + Number(num))/totalCount;
      });
      return parseFloat(sum).toFixed(1);
    }
  } else {
    return "1.0";
  }
}
