Meteor.methods({
  // AMAZONs3UPLOAD-------------------------------------------------------------------
  'amazons3upload' : function(photo){
      console.log('AmazonS3: uploading >>>');

      var response = Async.runSync(function(done) {
        AWS.config.update({
          accessKeyId: Meteor.settings.AWSAccessKeyId,
          secretAccessKey: Meteor.settings.AWSSecretAccessKey
        });

        buf = new Buffer(photo.replace(/^data:image\/\w+;base64,/, ""),'base64')
        str = +new Date + Math.floor((Math.random() * 100) + 1)+ ".jpg";

        var params = {
          Bucket: 'testepartio',
          Key: str,
          Body: buf,
          ACL:'public-read',
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg'
        };

        var s3 = new AWS.S3();

        var request = s3.putObject(params, function(err, data) {
          if (err) console.log(err)
          else {
            console.log(data);
            console.log("AmazonS3: >>>> Successfully uploaded");
            var urlParams = {Bucket: 'testepartio', Key: str};

            s3.getSignedUrl('getObject', urlParams, function(err, url){
                console.log('AmazonS3: imgURL > ' +  url);
                done(null, url);
            });
          }
        });

        request.on('httpUploadProgress', function (progress) {
          console.log("progress: " + progress);
          console.log(progress.loaded + " of " + progress.total + " bytes");
          console.log(Math.round(progress.loaded/progress.total*100)+ '% done');
        });

        request.send();

      });

      return response.result;
    },


  // SEARCH ITEMS FROM AMAZON --------------------------------------------------------
  AllItemsFromAmazon: function(keys) {
    var getAmazonItemSearchSynchronously = Meteor.wrapAsync(amazonItemSearch);
    var result = [];

    for(var i = 0; i < 1; i++) {
      result.push(getAmazonItemSearchSynchronously(keys, i+1));
      console.log(result[i]);
    }

    if (result.html && (result.html.body[0].b[0] === "Http/1.1 Service Unavailable")) {
      console.log(result.html.body[0].b[0]);
      throw new Meteor.Error("Error from Amazon - Service Unavailable");
    } else {
      if (result[0].ItemSearchResponse.Items[0].Item && (result[0].ItemSearchResponse.Items[0].Request[0].IsValid[0] === "True")) {
        console.log('AllItemsFromAmazon: OK');
        return amazonAllResultsItemSearchProcessing(result);
      } else {
        console.log('AllItemsFromAmazon: error');
        console.log(result[0].ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
        switch (result[0].ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]) {
          case 'AWS.ECommerceService.NoExactMatches':
            var text = 'You search does not match. Please try again with different words or take another photo.';
            break;
          default:
            var text = result[0].ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Code[0];
        }
        throw new Meteor.Error(text);
      }
    }
// END LISTING SEARCH ------------------------------
  },
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

});


var amazonAllResultsItemSearchProcessing = function(result) {

//  console.log(JSON.stringify(result[0].ItemSearchResponse.Items[0]));

  var necessaryFields = [];
  for(var itemPage = 0; itemPage < result.length; itemPage++) {
    var Items = result[itemPage].ItemSearchResponse.Items[0];
      if (Items.Item){
        if (Items.Item[0].ItemAttributes[0]) {
          try {
            for(var i = 0; i < Items.Item.length; i++) {
              necessaryFields.push({
                price: (function() {
                    if(Items.Item[i].ItemAttributes[0].ListPrice) {
                        return Items.Item[i].ItemAttributes[0].ListPrice[0].FormattedPrice[0];
                    }
                    else if(Items.Item[i].OfferSummary) {
                        if(Items.Item[i].OfferSummary[0].LowestNewPrice) {
                            return Items.Item[i].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];
                        }
                        else if(Items.Item[i].OfferSummary[0].LowestRefurbishedPrice) {
                            return Items.Item[i].OfferSummary[0].LowestRefurbishedPrice[0].FormattedPrice[0];
                        }
                        else if(Items.Item[i].OfferSummary[0].LowestUsedPrice) {
                            return Items.Item[i].OfferSummary[0].LowestUsedPrice[0].FormattedPrice[0];
                        }
                    }
                    return "--";
                })(),
                rank: (function() {
                    return Items.Item[i].SalesRank ? Items.Item[i].SalesRank[0] : "0";
                })(),
                //price : (function() {return Items.Item[i].Offers[0].Offer ? Items.Item[i].Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0] : "--"})(),
                title : Items.Item[i].ItemAttributes[0].Title[0],
                category : CategoriesServer.getCategory(Items.Item[i].ItemAttributes[0].ProductGroup[0]),
                amazonCategory : CategoriesServer.getAmazonCategory(Items.Item[i].ItemAttributes[0].ProductGroup[0]),
                image: (function() {
                  if(Items.Item[i].MediumImage){
                    if(Items.Item[i].MediumImage[0].URL) {
                        return Items.Item[i].MediumImage[0].URL[0];
                    }
                  } else if(Items.Item[i].LargeImage) {
                    if(Items.Item[i].LargeImage[0].URL) {
                        return Items.Item[i].LargeImage[0].URL[0];
                    }
                  } else if(Items.Item[i].SmallImage) {
                    if(Items.Item[i].SmallImage[0].URL) {
                        return Items.Item[i].SmallImage[0].URL[0];
                    }
                  } else if(Items.Item[i].ThumbnailImage) {
                    if(Items.Item[i].ThumbnailImage[0].URL) {
                        return Items.Item[i].ThumbnailImage[0].URL[0];
                    }
                  } else if(Items.Item[i].SwatchImage) {
                    if(Items.Item[i].SwatchImage[0].URL) {
                        return Items.Item[i].SwatchImage[0].URL[0];
                    }
                  } else if(Items.Item[i].TinyImage) {
                    if(Items.Item[i].TinyImage[0].URL) {
                        return Items.Item[i].TinyImage[0].URL[0];
                    }
                  } else {
                      return '/image-not-available.png';
                  }
                })(),
                asin: Items.Item[i].ASIN[0],
                attributes: (function() {
                  var attributes = [];
                  for(var property in Items.Item[i].ItemAttributes[0]) {
                    var possibleProperties = [
                      'Actor',
                      'Artist',
                      'Author',
                      'Binding',
                      'Brand',
                      'Color',
                      'Creator',
                      'Director',
                      'Edition',
                      //'Feature',
                      'Publisher'
                    ];

                    if(possibleProperties.indexOf(property) >= 0) {
                      var attrs = Items.Item[i].ItemAttributes[0][property];
                      if(attrs) {
                        if(attrs.toString().indexOf('[object Object]') < 0){
                          attributes.push({
                            key: property,
                            value: attrs.toString().replace(/,/g, ', ')
                          });
                        }
                      }
                    }
                  }
                  return attributes;
                })(),
              });
            }
        } catch(e) {console.log(e)}
      } else {
//      throw new Meteor.Error("No match for this item")
      }
    } else {
//     console.log(result.ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Code[0]);
//     throw new Meteor.Error(result.ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Message[0]);
    }
  }

  console.log('amazonAllResultsItemSearchProcessing -x-x-x-x-x-x-x-x-x-x-x-x-x');

  necessaryFields = necessaryFields.filter(function(necessaryField) {
     return (necessaryField.price !== '--') && (necessaryField.price !== '$0.00');
  });

  var amazonCategories = {};
  for(var i = 0; i < necessaryFields.length; i++) {

      if(!amazonCategories[necessaryFields[i].amazonCategory]) {
          amazonCategories[necessaryFields[i].amazonCategory] = 0;
      }
      amazonCategories[necessaryFields[i].amazonCategory] += parseInt(necessaryFields[i].rank);
  };

  console.log(JSON.stringify(amazonCategories));

//  necessaryFields.sort(function(a, b) {
//      return (a.rank < b.rank) ? 1 : -1;
//  });

  // sort results by amazon category
//  necessaryFields.sort(function(a, b) {
//      return (a.amazonCategory > b.amazonCategory) ? 1 : -1;
//  });

  necessaryFields.sort(function(a, b) {

      if(amazonCategories[a.amazonCategory] < amazonCategories[b.amazonCategory]) {
          return 1;
      }
      else if(amazonCategories[a.amazonCategory] === amazonCategories[b.amazonCategory] && a.amazonCategory > b.amazonCategory) {
          return 1;
      }
      return -1;
  });

  return necessaryFields;
}

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
              // authors: result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author[0]
              authors: (function() {
                if (result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author) {
                  return result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author[0]
                } else {
                  return result.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Creator[0]._
                }
              })()
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

var amazonPriceSearch = function(barcode, callback) {
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

var amazonItemSearch = function(keys, itemPage, callback) {
  OperationHelper = apac.OperationHelper;

  var opHelper = new OperationHelper({
    awsId:     'AKIAJ5R6HKU33B4DAF3A',
    awsSecret: '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',
    assocId:   'codefynecom06-20'
  });

  opHelper.execute('ItemSearch', {
      'SearchIndex': 'All',
      'Condition': 'New',
      'Keywords': keys,
      //'ResponseGroup': ['ItemAttributes', 'Medium', 'Offers'],
      'ResponseGroup': ['ItemAttributes', 'Medium'],
      'ItemPage': itemPage,
      'MinimumPrice': 100,
  }, callback);
}
