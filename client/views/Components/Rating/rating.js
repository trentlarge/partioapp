Template.rating.rendered = function () {
  $('.rateit').rateit();
}

Template.rating.helpers({
  avgRating: function(userId) {
      
    if(this.rating) {
        if(this.rating.length >= 1) {
            var ratingArray = this.rating;
            var totalCount = ratingArray.length;
            var sum = _.reduce(ratingArray, function(memo, num) {
              return (Number(memo) + Number(num));
            });
            return parseFloat(sum/totalCount).toFixed(1);
        }
    }

    var user = Meteor.users.findOne(userId);
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
