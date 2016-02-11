// LISTING SEARCH ------------------------------
SearchSource.defineSource('packages', function(searchText, options) {

  var userProducts = Products.find({ownerId: Meteor.userId() }).fetch();

  var searchIds = []

  userProducts.map(function(prod){
   searchIds.push(prod.searchId)
  });

  var user_id = Meteor.userId();

  console.log('######### NOT IN');
  //var result_products = Products.find({ownerId: user_id}, { searchId : 1, _id : 0}).fetch();
  //console.log(result_products);
  //console.log(user_id);
  console.log(searchIds);

  //db.search.find({ _id: { $nin: [ 'bwCTtntQjSkXGMFkx' ] } })

  var options = {sort: {isoScore: -1}, limit: 20};
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {_id: { $nin: searchIds}, $or: [{title: regExp},{category: regExp},{uniqueId: searchText}]};
    console.log('searchText');
    return Search.find(selector, options).fetch();
  } else {
    var selector = {_id: { $nin: searchIds}};
    console.log(Search.find(selector, options).fetch());
    return Search.find(selector, options).fetch();
  }
});

function buildRegExp(searchText) {
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
