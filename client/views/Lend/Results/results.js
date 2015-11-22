
// RENDERED

//Template.results.rendered = function() {
//
//}

// HELPERS

Template.results.helpers({
  allResults: function(){
    return Session.get('allResults');
  },
  scanResult: function() {
    return Session.get('scanResult');
  },
  isDifferentCategory: function() {
      if(this.index === 0 || Lend.currentCategory !== this.amazonCategory) {
          Lend.currentCategory = this.amazonCategory;
          return true;
      }
      return false;
  },
  splitCategory: function() {
    if(this.amazonCategory){
      return this.amazonCategory.replace(/\s/g,"").replace(/\&/g,"");
    }
    return false;
  },
  getCategoryIcon: function() {
    return Categories.getCategoryIconByText(this.category);
  },
  getConditions: function() {
    return Rating.getConditions();
  },
  isOnlyOneCategory: function() {

    if(Session.get('isOnlyOneCategory'))  {
        return Session.get('isOnlyOneCategory');
    }
    else {
        var result = Session.get('allResults');

        var currentCategory = '';
        var nCategory = 0;

        $.each(result, function(index, r) {
            if(r.amazonCategory !== currentCategory) {
                currentCategory = r.amazonCategory;
                nCategory++;
            }
        });

        if(nCategory == 1) {
            Session.set('isOnlyOneCatgory', true);
            return true;
        }
        else {
            Session.set('isOnlyOneCatgory', false);
            return false;
        }
    }

  },
  waitingForPrices: function() {
      return Lend.validatePrices() ? "": "disabled";
  },
  validatePrices: function(){
      return Lend.validatePrices();
  },
  calculatedPriceDay: function() {

    var scanResult = Session.get('scanResult');

    if (scanResult) {
      if (scanResult.price !== "--") {
          
          var priceValueDay = (scanResult.price).split("$")[1];
          var price = Lend.calculatePrice('ONE_DAY', priceValueDay);
          
          if(price > 0) {
              Session.set('dayPrice', price);
              return price;
          }
      }
    }

  },


  calculatedPriceWeek: function() {

    var scanResult = Session.get('scanResult');

    if (scanResult) {
      if (scanResult.price !== "--") {
          var priceValueWeek = (scanResult.price).split("$")[1];
          var price = Lend.calculatePrice('ONE_WEEK', priceValueWeek);
          
          if(price > 0) {
              Session.set('weekPrice', price);
              return price;
          }    
      }
    }

  },

  calculatedPriceMonth: function() {

    var scanResult = Session.get('scanResult');

    if (scanResult) {
      if (scanResult.price !== "--") {

          var priceValueMonth = (scanResult.price).split("$")[1];
          var price = Lend.calculatePrice('ONE_MONTH', priceValueMonth);
          
          if(price > 0) {
              Session.set('monthPrice', price);
              return price;
          }
      }
    }

  },

  calculatedPrice4Months: function() {

    var scanResult = Session.get('scanResult');

    if (scanResult) {
      if (scanResult.price !== "--") {
          var priceValue4Months = (scanResult.price).split("$")[1];
          var price = Lend.calculatePrice('FOUR_MONTHS', priceValue4Months);

          if(price > 0) {
              Session.set('semesterPrice', price);
              return price;
          }
      }
    }

  },
});

// EVENTS

Template.results.events({
    
    'click .notFound': function(e, template) {
      
        var results = Session.get('allResults');
        var resultsLenght = 0;
        var averagePrice = 0.0;
        
        var categories = [
            {
               text: 'Textbooks',
               occurrences: 0,
            },
            {
               text: 'Technology',
               occurrences: 0,
            },
            {
               text: 'Music',
               occurrences: 0,
            },
            {
               text: 'Home',
               occurrences: 0,
            },
            {
               text: 'Sports',
               occurrences: 0,
            },
            {
               text: 'Miscellaneous',
               occurrences: 0,
            }
        ]
        
        $.each(results, function(index, result) {
            
            $.each(categories, function(key, category) {
                if(result.category === category.text) {
                    category.occurrences++;
                }
            });
            
            if(result.price !== '--') { 
                var price = Number(result.price.replace(/[^0-9\.-]+/g,""));

                if(price > 0) {
                    averagePrice += price;
                    resultsLenght++;
                }
            }         
        })
        
        categories.sort(function(a, b) {
            return (a.occurrences < b.occurrences) ? 1 : -1;
        });

        var averageFinalPrice = (averagePrice/resultsLenght).toFixed(2);
        
        var itemNotFound = {
            'image' : Session.get('camfindImage'),
            'title' : $('.search-share-header-input').val(),
            'category' : categories[0].text,
            'price' : {
                'averagePrice' : averageFinalPrice,
                'day' : Lend.calculatePrice('ONE_DAY', averageFinalPrice),
                'week' : Lend.calculatePrice('ONE_WEEK', averageFinalPrice),
                'month' : Lend.calculatePrice('ONE_MONTH', averageFinalPrice),
                'semester' : Lend.calculatePrice('FOUR_MONTHS', averageFinalPrice)
            }
        }
        
        Session.set('itemNotFound', itemNotFound);
        Session.set('lendTab', 'manual');
        
    },
    'click .features': function(e, template) {

      var features = $('.features');
      var featureDetails = $('.features-details');

        if(featureDetails.hasClass('hidden')){
            featureDetails.removeClass('hidden');
            features.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
        }
        else {
            featureDetails.addClass('hidden');
            features.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
        }

    },
    'change .userPrice': function(e, template){

        var rentPrice = {
            "day": template.find('.dayPrice').value,
            "week": template.find('.weekPrice').value,
            "month": template.find('.monthPrice').value,
            "semester": template.find('.semesterPrice').value,
         }

          Session.set('dayPrice', rentPrice.day);
          Session.set('weekPrice', rentPrice.week);
          Session.set('monthPrice', rentPrice.month);
          Session.set('semesterPrice', rentPrice.semester);

    },

    // hide/show products by category
    'click .menu-category': function(e, template) {
        var category = $('.' + $(this)[0].amazonCategory.replace(/\s/g,"").replace(/\&/g,""));
        var categoryId = $('.' + $(this)[0].amazonCategory.replace(/\s/g,"").replace(/\&/g,"") + '-menu');

        if(category.hasClass('hidden')){
            category.removeClass('hidden');
            categoryId.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
        }
        else {
            category.addClass('hidden');
            categoryId.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
        }
    },

    'click .product': function(e, template) {
        //Session.set('allResults', );
        Session.set('scanResult', this);
    },
});

// DESTROYED
//
//Template.resultsCamFind.destroyed = function() {
//     Session.set('scanResult', null);
//     Session.set('allResults', null);
//}
