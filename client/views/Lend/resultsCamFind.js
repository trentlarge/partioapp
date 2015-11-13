
// RENDERED

//Template.resultsCamFind.rendered = function() {
//    
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
      if (scanResult.price === "--") {
        Session.set('userPrice', false);
        return false;
      }
      else
      {
          var priceValueDay = (scanResult.price).split("$")[1];
          Lend.GetRentingPercentages('ONE_DAY', priceValueDay);

          if(Lend.RentingFinalPrice > 0) {
              Session.set('dayPrice', Lend.RentingFinalPrice);
              return Lend.RentingFinalPrice;
          }
          else {
              Session.set('userPrice', false);
          }
      }
    }

  },


  calculatedPriceWeek: function() {

    var scanResult = Session.get('scanResult');

    if (scanResult) {
      if (scanResult.price === "--") {
        Session.set('userPrice', false);
        return false;
      }
      else
      {
          var priceValueWeek = (scanResult.price).split("$")[1];
          Lend.GetRentingPercentages('ONE_WEEK', priceValueWeek);

          if(Lend.RentingFinalPrice > 0) {
              Session.set('weekPrice', Lend.RentingFinalPrice);
              return Lend.RentingFinalPrice;
          }
          else {
              Session.set('userPrice', false);
          }
      }
    }

  },

  calculatedPriceMonth: function() {

    var scanResult = Session.get('scanResult');

    if (scanResult) {
      if (scanResult.price === "--") {
        Session.set('userPrice', false);
        return false;
      }
      else
      {
          Lend.RentingTimeSpan = 'ONE_MONTH';
          var priceValueMonth = (scanResult.price).split("$")[1];
          Lend.GetRentingPercentages('ONE_MONTH', priceValueMonth);

          if(Lend.RentingFinalPrice > 0) {
              Session.set('monthPrice', Lend.RentingFinalPrice);
              return Lend.RentingFinalPrice;
          }
          else {
              Session.set('userPrice', false);
          }
      }
    }

  },

  calculatedPrice4Months: function() {

    var scanResult = Session.get('scanResult');

    if (scanResult) {
      if (scanResult.price !== "--") {
          var priceValue4Months = (scanResult.price).split("$")[1];
          Lend.GetRentingPercentages('FOUR_MONTHS', priceValue4Months);

          if(Lend.RentingFinalPrice > 0) {
              Session.set('semesterPrice', Lend.RentingFinalPrice);
              return Lend.RentingFinalPrice;
          }
      }
    }

  },
});

// EVENTS

Template.resultsCamFind.events({

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

          Session.set('allResults', false);
          Session.set('scanResult', this);

    },
});

// DESTROYED
//
//Template.resultsCamFind.destroyed = function() {
//     Session.set('scanResult', null);
//     Session.set('allResults', null);
//}
