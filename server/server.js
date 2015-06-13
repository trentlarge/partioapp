// Meteor.methods({
// 	callGoogleBooks: function() {
// 		var result = HTTP.get("https://www.googleapis.com/books/v1/volumes?q=isbn:9780241184837");
// 		console.log(result);
// 		return result;
// 	}
// })



SearchSource.defineSource('packages', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {"title": regExp},
      {"subtitle": regExp}
    ]};
    return Meteor.users.find(selector, options).fetch();
  } else {
    return Meteor.users.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}