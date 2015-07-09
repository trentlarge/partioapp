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
      {authors: regExp}
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
  priceFromAmazon: function(barcode, format) {
    var originalFormat = format;
    var originalBarcode = barcode;
    console.log("originFormat: "+originalFormat+ ",originalBarcode: "+ originalBarcode);
    var getAmazonPriceSearchSynchronously =  Meteor.wrapAsync(amazonPriceSearch);
    var result = getAmazonPriceSearchSynchronously(barcode, format);

    if (result.html && (result.html.body[0].b[0] === "Http/1.1 Service Unavailable")) {
      console.log(result.html.body[0].b[0]);
      throw new Meteor.Error("Error from Amazon - Service Unavailable");
    } else {
        if (result.ItemLookupResponse.Items[0].Item && (result.ItemLookupResponse.Items[0].Request[0].IsValid[0] === "True")) {
          return amazonResultProcessing(result);
      } else {
        if (result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0] === "AWS.InvalidParameterValue") {
          var newformat = (function() {
            return (originalFormat === "UPC") ? "EAN" : "UPC"
          })();
          console.log("newFormat: "+ newformat);
          var resultAgain = getAmazonPriceSearchSynchronously(barcode, newformat);
          if (resultAgain.html && (resultAgain.html.body[0].b[0] === "Http/1.1 Service Unavailable")) {
            throw new Meteor.Error("Error from Amazon - Service Unavailable");
          } else {
            return amazonResultProcessing(resultAgain);  
          }
          
        } else {
          console.log(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
          throw new Meteor.Error(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
        }
        
      }
    }
  },
  requestOwner: function(requestor, productId) {
    console.log(requestor, productId);
    var connection = {
      requestor: requestor,
      state: 'WAITING',
      requestDate: new Date(),
      borrowedDate: null,
      bookData: Products.findOne(productId),
      chat: [  ]
    };
    Meteor._sleepForMs(1000);
    return Connections.insert(connection);
  },
  'ownerAccept': function(connectionId) {
    Connections.update({_id: connectionId}, {$set: {state: "PAYMENT"}});
  },
  'payNow': function(payer) {
    console.log(payer);
    Meteor._sleepForMs(1000);
    Connections.update({_id: payer}, {$set: {state: "IN USE"}});
    return "yes, payment done"
  }
})

var amazonResultProcessing = function(result) {
  console.log(JSON.stringify(result));
  
  if (result.ItemLookupResponse.Items[0].Item){
    if (result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].ISBN !== undefined) {
          // try {
            var necessaryFields = {
              price : (function() {return result.ItemLookupResponse.Items[0].Item[0].Offers[0].Offer ? result.ItemLookupResponse.Items[0].Item[0].Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
              title : result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Title[0],
              category : result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].ProductGroup[0],
              publisher : result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Publisher[0],
              image: result.ItemLookupResponse.Items[0].Item[0].MediumImage[0].URL[0],
              pageUrl: result.ItemLookupResponse.Items[0].Item[0].DetailPageURL[0],
              publicationDate: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].PublicationDate[0],
              pages: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].NumberOfPages[0],
              ean: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].EAN[0],
              binding: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Binding[0],
              authors: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author[0]
            }
          // } catch(e) {console.log(e)}
          return necessaryFields;
        } else {
          // try {
            var necessaryFields = {
              price : (function() {return result.ItemLookupResponse.Items[0].Item[0].Offers[0].Offer ? result.ItemLookupResponse.Items[0].Item[0].Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
              title : result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Title[0],
              category : result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].ProductGroup[0],
              manufacturer : result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Manufacturer[0],
              brand : (function() {return result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Brand ? result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Brand[0] : "--"})(),
              image: result.ItemLookupResponse.Items[0].Item[0].MediumImage[0].URL[0],
              asin: result.ItemLookupResponse.Items[0].Item[0].ASIN[0],
              pageUrl: result.ItemLookupResponse.Items[0].Item[0].DetailPageURL[0],
              model: (function() {return result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Model ? result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Model[0] : "--"})()
            }
          // } catch(e) {console.log(e)}
          return necessaryFields;
        }
  } else {
    console.log(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
    throw new Meteor.Error(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Message[0]);
  }
}

amazonPriceSearch = function(barcode, format, callback) {
  OperationHelper = apac.OperationHelper;

  var opHelper = new OperationHelper({
    awsId:     'AKIAJ5R6HKU33B4DAF3A',
    awsSecret: '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',
    assocId:   'codefynecom06-20'
  });

  opHelper.execute('ItemLookup', {
    'SearchIndex': 'All',
    'Operation': 'ItemLookup',
    'ItemId': barcode,
    'IdType': format,
    'ResponseGroup': ['ItemAttributes', 'Images', 'OfferListings'],
    'IncludeReviewsSummary': false,
    'VariationPage': 1
  }, callback )
}






