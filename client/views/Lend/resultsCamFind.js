
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
  getCategoryIcon: function() {
    return Categories.getCategoryIconByText(this.category);     
  },
  waitingForPrice: function() {
    return Session.get('userPrice') ? "": "disabled";
  },
  userPrice: function() {
    console.log('price rendered: ' + Session.get('userPrice'));
    return Session.get('userPrice');
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
//          console.log('RentingFinalPrice: ' + Lend.RentingFinalPrice);

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
//          console.log('RentingFinalPrice ONE_WEEK: ' + Lend.RentingFinalPrice);

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
//          console.log('RentingFinalPrice ONE_MONTH: ' + Lend.RentingFinalPrice);

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

  calculatedPrice4Months: function() {

    var scanResult = Session.get('scanResult');

    if (scanResult) {
      if (scanResult.price === "--") {
        Session.set('userPrice', false);
        return false;
      }
      else
      {
          var priceValue4Months = (scanResult.price).split("$")[1];
          Lend.GetRentingPercentages('FOUR_MONTHS', priceValue4Months);
//          console.log('RentingFinalPrice: ' + Lend.RentingFinalPrice);

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
        var manual = $('.search-share-header-input').val();
        $('.search-share-header-input').val(Lend.latestProduct);
        $('.submit-search').click();
        $('.search-share-header-input').val(manual);
    },

    // hide/show products by category
    'click .menu-category': function(e, template) {
        var category = $('.' + $(this)[0].category.replace(/\s/g,"").replace(/\&/g,""));
        var categoryId = $('.' + $(this)[0].category.replace(/\s/g,"").replace(/\&/g,"") + '-menu');
        
        console.log(category);
        console.log(categoryId);

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
