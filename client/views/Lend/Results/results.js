
// RENDERED

Template.results.rendered = function() {
//    Session.set('orderByRanking', true);  
    Lend.currentCategory = '';
}

// HELPERS

Template.results.helpers({
  'orderByRanking': function() {
    return Session.get('orderByRanking');  
  },
  'isTabRankingActive': function() {
      if(Session.get('orderByRanking')) {
         return 'active'; 
      }
      return '';
  },
  'isTabCategoriesActive': function() {
      if(!Session.get('orderByRanking')) {
         return 'active'; 
      }
      return '';
  },
  allResults: function(){
    return Session.get('allResults');
  },
  allResultsByCategory: function(){
    var results = Session.get('allResults');
    var amazonCategory = this.amazonCategory;
    return results.filter(function(result) {
        return result.amazonCategory === amazonCategory;
    });
  },
  isDifferentCategory: function() {
      if(Lend.currentCategory !== this.amazonCategory) {
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

    // hide/show products by category
    'click .menu-category': function(e, template) {
        var category = $('.' + $(this)[0].amazonCategory.replace(/\s/g,"").replace(/\&/g,""));
        var categoryMenu = $('.' + $(this)[0].amazonCategory.replace(/\s/g,"").replace(/\&/g,"") + '-menu');

        if(!category.is(':visible')){
            category.slideDown('fast');
            categoryMenu.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
        }
        else {
            category.slideUp('fast');
            categoryMenu.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
        }

    },

    'click .product': function(e, template) {
        //Session.set('allResults', );
        Session.set('scanResult', this);
        Router.go('/lend/details');
        //Session.set('lendTab', 'resultDetails');
    },
});




// DESTROYED
//
//Template.resultsCamFind.destroyed = function() {
//     Session.set('scanResult', null);
//     Session.set('allResults', null);
//}
