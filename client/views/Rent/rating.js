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
                console.log(Number(memo));
                console.log(Number(num));
              return (Number(memo) + Number(num));
            });
            return parseFloat(sum/totalCount).toFixed(1);
        }
    }
      
    if(Meteor.users.findOne(userId)){
        if (Meteor.users.findOne(userId).profile.rating) {
          if (Meteor.users.findOne(userId).profile.rating.length >= 1) {
            var ratingArray = Meteor.users.findOne(userId).profile.rating;
            var totalCount = ratingArray.length;
            var sum = _.reduce(ratingArray, function(memo, num) {
              return Number(memo) + Number(num);
            });
            return parseFloat(sum/totalCount).toFixed(1);
          }
        } else {
          return "0.0";
        }
    }
    else {
        return "0.0";
    }
  },
});
