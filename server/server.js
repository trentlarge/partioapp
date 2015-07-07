  // SERVER FRESH START SEQUENCE
  // Products.remove({});
  // Meteor.users.remove({});
  // Connections.remove({});
  // SERVER FRESH START SEQUENCE

// ServiceConfiguration.loginServiceConfiguration.remove({
//     service: "facebook"
// });

SearchSource.defineSource('packages', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {title: regExp},
      {subtitle: regExp}
    ]};
    return Products.find(selector, options).fetch();
  } else {
    return Products.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {

  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}



Meteor.methods({
  priceFromAmazon: function(isbn) {
    var getAmazonPriceSearchSynchronously =  Meteor.wrapAsync(amazonPriceSearch);
    var result = getAmazonPriceSearchSynchronously(isbn);

    console.log(JSON.stringify(result));
    if (result.ItemLookupResponse.Items[0].Request[0].IsValid[0] === "True") {
      if (result.ItemLookupResponse.Items[0].Item[0].OfferSummary[0].LowestNewPrice) {
        // console.log(result.ItemLookupResponse.Items[0].Item[0].OfferSummary[0].LowestNewPrice);
        formattedPrice = result.ItemLookupResponse.Items[0].Item[0].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];
        productImage = result.ItemLookupResponse.Items[0].Item[0].LargeImage[0].URL[0];
        console.log(productImage);
        return {"formattedPrice": formattedPrice, "productImage": productImage};
      } else {
        console.log(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
        throw new Meteor.Error(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
      } 
    }
    
    // return result.ItemLookupResponse.Items[0].Item[0].OfferSummary[0].LowestNewPrice;
  },
  requestOwner: function(requestor, productId) {
    console.log(requestor, productId);
    var connection = {
      requestor: requestor,
      approved: false,
      borrowed: false,
      requestDate: new Date(),
      borrowedDate: null,
      bookData: Products.findOne(productId),
      chat: [  ]
    };
    Meteor._sleepForMs(1000);
    return Connections.insert(connection);
  }
})



amazonPriceSearch = function(isbn, callback) {
  OperationHelper = apac.OperationHelper;

  var opHelper = new OperationHelper({
    awsId:     'AKIAJ5R6HKU33B4DAF3A',
    awsSecret: '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',
    assocId:   'codefynecom06-20'
  });

  opHelper.execute('ItemLookup', {
    'SearchIndex': 'Books',
    'ResponseGroup': ['Images', 'OfferSummary'],
    'Operation': 'ItemLookup',
    'ItemId': isbn,
    'IdType': 'ISBN',
    'IncludeReviewsSummary': true
  }, callback )
}

