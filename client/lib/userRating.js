userRating = function(userId) {
  var rating = "1.0";

  var user = Meteor.users.findOne(userId);

  if (user && user.profile && user.profile.rating) {
    if (user.profile.rating.length > 1) {
      var ratingArray = user.profile.rating;
      var totalCount = ratingArray.length;
      var sum = _.reduce(ratingArray, function(memo, num) {
        return (Number(memo) + Number(num)) / totalCount;
      });
      rating = parseFloat(sum).toFixed(1);
    }
  }

  return rating;
}
