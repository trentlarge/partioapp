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
  priceFromAmazon: function(barcode) {
    // var originalFormat = format;
    var originalBarcode = barcode;
    console.log("originalBarcode: "+ originalBarcode);
    var getAmazonPriceSearchSynchronously =  Meteor.wrapAsync(amazonPriceSearch);
    var result = getAmazonPriceSearchSynchronously(barcode);

    if (result.html && (result.html.body[0].b[0] === "Http/1.1 Service Unavailable")) {
      console.log(result.html.body[0].b[0]);
      throw new Meteor.Error("Error from Amazon - Service Unavailable");
    } else {
        if (result.ItemLookupResponse.Items[0].Item && (result.ItemLookupResponse.Items[0].Request[0].IsValid[0] === "True")) {
          return amazonResultProcessing(result);
        } else {
          console.log(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
          throw new Meteor.Error(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
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
          throw new Meteor.Error("No match for this item. Are you sure you're scanning a Book?")
        }
  } else {
    console.log(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
    throw new Meteor.Error(result.ItemLookupResponse.Items[0].Request[0].Errors[0].Error[0].Message[0]);
  }
}

amazonPriceSearch = function(barcode, callback) {
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
    'IdType': 'ISBN',
    'ResponseGroup': ['ItemAttributes', 'Images', 'OfferListings'],
    'IncludeReviewsSummary': false,
    'VariationPage': 1
  }, callback )
}


amazonInitialTestData = function(callback) {
  OperationHelper = apac.OperationHelper;

  var opHelper = new OperationHelper({
    awsId:     'AKIAJ5R6HKU33B4DAF3A',
    awsSecret: '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',
    assocId:   'codefynecom06-20'
  });

  opHelper.execute('ItemSearch', {
    'SearchIndex': 'Blended',
    'Operation': 'ItemSearch',
    'Keywords': 'tesla',
    'ResponseGroup': ['ItemAttributes', 'Images', 'OfferListings']
  }, callback )
}

// var productGroup = [];
// Products.find().map(function(eachProduct) {
//   productGroup.push(eachProduct.category);
// })

// photograph
// university
// college
// football

// Meteor.startup(function() {
//   Meteor.setTimeout(function() {
//     console.log('data dump attempt...');
//     var getInitialData =  Meteor.wrapAsync(amazonInitialTestData);
//     var result = getInitialData();
//     console.log(JSON.stringify(result));

//     var dump1 = result.ItemSearchResponse.Items[0].Item;
//     // console.log(dump1);

//     dump1.forEach(function(itemSet) {
//       console.log(itemSet);
//       if (itemSet.ItemAttributes && itemSet.MediumImage && itemSet.Offers) {
//           if (itemSet.ItemAttributes[0].ISBN !== undefined) {
//             var necessaryFields = {
//               price : (function() {return itemSet.Offers[0].Offer ? itemSet.Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
//               title : itemSet.ItemAttributes[0].Title[0],
//               category : itemSet.ItemAttributes[0].ProductGroup[0],
//               publisher : itemSet.ItemAttributes[0].Publisher[0],
//               image: itemSet.MediumImage[0].URL[0],
//               pageUrl: itemSet.DetailPageURL[0],
//               publicationDate: itemSet.ItemAttributes[0].PublicationDate[0],
//               pages: (function() {return itemSet.ItemAttributes[0].NumberOfPages ? itemSet.ItemAttributes[0].NumberOfPages[0] : "--"})(),
//               ean: itemSet.ItemAttributes[0].EAN[0],
//               binding: itemSet.ItemAttributes[0].Binding[0],
//               authors: (function() {return itemSet.ItemAttributes[0].Authors ? itemSet.ItemAttributes[0].Authors[0] : "--"})()
//             }
//             console.log(necessaryFields);
//             var customPrice = necessaryFields.price.split("$")[1];
//             var insertData = _.extend(necessaryFields, {
//               "ownerId": "DbRr7gwsFk5gPcPvq",
//               "customPrice": (Number(customPrice)/5).toFixed(2)
//             });
//             Products.insert(insertData);

//           } else {
//             var necessaryFields = {
//               price : (function() {return itemSet.Offers[0].Offer ? itemSet.Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
//               title : itemSet.ItemAttributes[0].Title[0],
//               category : itemSet.ItemAttributes[0].ProductGroup[0],
//               manufacturer : (function() {return itemSet.ItemAttributes[0].Manufacturer ? itemSet.ItemAttributes[0].Manufacturer[0] : "--"})(),
//               brand : (function() {return itemSet.ItemAttributes[0].Brand ? itemSet.ItemAttributes[0].Brand[0] : "--"})(),
//               image: itemSet.MediumImage[0].URL[0],
//               asin: itemSet.ASIN[0],
//               pageUrl: itemSet.DetailPageURL[0],
//               model: (function() {return itemSet.ItemAttributes[0].Model ? itemSet.ItemAttributes[0].Model[0] : "--"})()
//             }
//             console.log(necessaryFields);
//             var customPrice = necessaryFields.price.split("$")[1];
//             var insertData = _.extend(necessaryFields, {
//               "ownerId": "DbRr7gwsFk5gPcPvq",
//               "customPrice": (Number(customPrice)/5).toFixed(2)
//             });
//             Products.insert(insertData);
//           }
//       } else {
//         return;
//       }
//     })


//   }, 5000)
// })


