
// RENDERED

//Template.resultsCamFind.rendered = function() {
//    Session.set('allResults', true);
//    Session.set('scanResult', false);
//    console.log(Session.get('allResults'));
//}

// HELPERS

Template.resultsCamFind.helpers({
  allResults: function(){
    return Session.get('allResults');
  },
  scanResult: function() {
    return Session.get('scanResult');
  },
  isDifferentCategory: function() {
      if(this.index === 0 || Lend.currentCategory !== this.category) {
          Lend.currentCategory = this.category;
          return true;
      }
      return false;
  },
  splitCategory: function() {
    if(this.category){ 
      return this.category.replace(/\s/g,"").replace(/\&/g,"");
    }
    return false;
  },
  waitingForPrice: function() {
    return Session.get('userPrice') ? "": "disabled";
  },
  userPrice: function() {
    console.log('price rendered: ' + Session.get('userPrice'));
    return Session.get('userPrice');
  },
  calculatedPrice: function() {
      
    var scanResult = Session.get('scanResult');
      
    if (scanResult) {
      if (scanResult.price === "--") {
        Session.set('userPrice', false);  
        return false;
      }
      else
      {
          var priceValue = (scanResult.price).split("$")[1];
          Lend.GetRentingPercentages('ONE_WEEK', priceValue);
          console.log('RentingFinalPrice: ' + Lend.RentingFinalPrice);
          
          if(Lend.RentingFinalPrice > 0) {
              Session.set('userPrice', Lend.RentingFinalPrice);
              return Lend.RentingFinalPrice;
          }
          else {
              Session.set('userPrice', false);
          }
      }
    }
      
  },
});

// EVENTS

Template.resultsCamFind.events({

    'click .back': function(e, template) {
        
        //temporary solution
        var manual = $('#manualInputCamFind').val();
        $('#manualInputCamFind').val(Lend.latestProduct);
        $('#manualSubmitCamFind').click();
        $('#manualInputCamFind').val(manual);
    },
    
    // hide/show products by category
    'click .menu-category': function(e, template) {
        var category = $('.' + $(this)[0].category.replace(/\s/g,"").replace(/\&/g,""));
        var categoryId = $('#' + $(this)[0].category.replace(/\s/g,"").replace(/\&/g,""));
        
        if(category.hasClass('hidden')){
            category.removeClass('hidden');
            categoryId.find('i').addClass('ion-chevron-down');
            categoryId.find('i').removeClass('ion-chevron-right');
        }
        else {
            category.addClass('hidden');
            categoryId.find('i').removeClass('ion-chevron-down');
            categoryId.find('i').addClass('ion-chevron-right');
        }
    },

    // This method get the ASIN code of product and get it features from amazon.
    // So, the results is setted in scanResult field in the HTML file.
    'click .product': function(e, template) {
        
          Session.set('allResults', false);
          Session.set('scanResult', this);

//          //get ASIN code
//          var asin = $(this)[0].asin;
//        
//          //check if exist in results cache
//          if(Lend.resultsCache[asin]) {
//            Session.set('allResults', false);
//            Session.set('scanResult', Lend.resultsCache[asin]);
//            IonLoading.hide();
//          }
//          else {
//            Meteor.call('itemFromAmazon', asin, function(error, result) {
//
//                console.log(JSON.stringify(result))
//
//                if (result && !error)
//                {
//                    Session.set('allResults', false);
//                    Session.set('scanResult', result);
//
//                    //add in cache
//                    Lend.resultsCache[asin] = result;
//                    
//                    IonLoading.hide();
//                } else {
//                    IonLoading.hide();
//                    IonPopup.show({
//                      title: 'Please try again :( ',
//                        template: '<div class="center">'+ error.message + '</div>',
//                        buttons:
//                        [{
//                          text: 'OK',
//                          type: 'button-energized',
//                          onTap: function() {
//                            IonPopup.close();
//                          }
//                        }]
//                  });
//                }
//            });
//          }     

    },
});

// DESTROYED
//
//Template.resultsCamFind.destroyed = function() {
//     Session.set('scanResult', null);
//     Session.set('allResults', null);
//}

