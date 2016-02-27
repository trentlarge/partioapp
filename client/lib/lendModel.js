app = app || {};

app.model.Lend = (function () {
  'use strict';

  var Lend = function() {

    //camdfind vars
    this.allResultsCache;
    this.currentCategory;
    this.latestProduct;

    this.RentingTimeSpan; //ONE_DAY, ONE_WEEK, ONE_MONTH, FOUR_MONTHS
    this.RentingOneDayPercentage;
    this.RentingOneWeekPercentage;
    this.RentingOneMonthPercentage;
    this.RentingFourMonthsPercentage;
    this.RentingPartioSharePercentage;
    this.RentingStripeFeePercent;
    this.RentingStripeAdditionalFee;
    this.RentingAmazonPrice;
    this.RentingAmazonRentalPrice;
    this.RentingFinalPrice;

  };

  function onlyNumber(string){
    var number = Number(string.replace(/[^0-9\.-]+/g,""));
    return number;
  }

  function format1(n) {
    return n.toFixed(2).replace(/./g, function(c, i, a) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
  }

  Lend = {

    //initialize vars
    init : function() {
      this.allResultsCache = {};
    },

    validatePrices : function() {

      if(!Session.get('dayPrice') || !Session.get('weekPrice') || !Session.get('monthPrice') || !Session.get('semesterPrice')) {
          return false;
      }

      var lowerValue = 1,
          highestValue = 100000;

      var dayPrice = parseFloat(Session.get('dayPrice'), 10),
          weekPrice = parseFloat(Session.get('weekPrice'), 10),
          monthPrice = parseFloat(Session.get('monthPrice'), 10),
          semesterPrice = parseFloat(Session.get('semesterPrice'), 10);

      if(dayPrice < lowerValue || weekPrice < lowerValue || monthPrice < lowerValue || semesterPrice < lowerValue) {
        return false;
      }

      if(dayPrice > highestValue || weekPrice > highestValue || monthPrice > highestValue || semesterPrice > highestValue) {
        return false;
      }
      return true;
    },
       
    calculatePrice : function(timeSpan, amazonPrice) {
      return this.calculateRentingCharges(timeSpan, amazonPrice);
    },

    calculateRentingCharges : function(timeSpan, amazonPrice) {

      //set percentages
      var renting = {  
        amazonPrice: onlyNumber(amazonPrice),
        timeSpan: timeSpan,
        percentage: {
          day: 4,
          week: 2,
          month: 1,
          semester: 0.5,
          partioShare: 10,
          stripeFee: 2.9,
          stripeAdditionalFee: 0.3
        }
      }
          
      var rentingFinalPrice = 0.0;
      
      if(renting.timeSpan == 'ONE_DAY')
      {
        rentingFinalPrice = parseFloat((renting.percentage.day/100) * renting.amazonPrice);
      }
      else if(renting.timeSpan == 'ONE_WEEK')
      {
        rentingFinalPrice = parseFloat((renting.percentage.week/100) * renting.amazonPrice);
        rentingFinalPrice = parseFloat(rentingFinalPrice * 7);
      }
      else if(renting.timeSpan == 'ONE_MONTH')
      {
        rentingFinalPrice = parseFloat((renting.percentage.month/100) * renting.amazonPrice);
        rentingFinalPrice = parseFloat(rentingFinalPrice * 30);
      }
      else if(renting.timeSpan == 'FOUR_MONTHS')
      {
        rentingFinalPrice = parseFloat((renting.percentage.semester/100) * renting.amazonPrice);
        rentingFinalPrice = parseFloat(rentingFinalPrice * 30 * 4);
      }

      rentingFinalPrice += parseFloat((renting.percentage.stripeFee/100) * rentingFinalPrice);
      rentingFinalPrice += parseFloat(renting.percentage.stripeAdditionalFee);
      rentingFinalPrice += parseFloat((renting.percentage.partioShare/100) * rentingFinalPrice);
      rentingFinalPrice = Math.round(Number((rentingFinalPrice).toFixed(1))).toFixed(2);
      
      return rentingFinalPrice;
    },

    addProductToInventory : function(product) {
      var self = this;

      Meteor.call("insertProduct", product, function(err, res) {
        PartioLoad.hide();
        if(err) {
          var errorMessage = err.reason || err.message;
          if(err.details) {
              errorMessage = errorMessage + "\nDetails:\n" + err.details;
          }
          sAlert.error(errorMessage);
          return;
        }

        // ADD SHOUT
          
        product._id = res;
          
        var shout = {
            message: 'shared "' + product.title + '"',
            sharedProducts: []
        }
        
        shout.sharedProducts.push(product);
          
        Meteor.call('insertShoutOut', Meteor.userId(), shout.message, 'share', shout.sharedProducts, function(err, res) {
          if(err) {
            var errorMessage = err.reason || err.message;
            if(err.details) {
              errorMessage = errorMessage + "\nDetails:\n" + err.details;
            }
            sAlert.error(errorMessage);
          }  
        });
          
        self.clearPrices();

        IonPopup.show({
          title: 'Your product is successfully submitted',
          template: 'And saved to your Inventory.',
          buttons:
            [{
              text: 'OK',
              type: 'button-energized',
              onTap: function() {
                $('#closeLend').click();
                IonPopup.close();
                //IonModal.close();
                Router.go('/items');
              }
            }]
        });
      });
    },

    clearPrices() {
      Session.set('dayPrice', null);
      Session.set('weekPrice', null);
      Session.set('monthPrice', null);
      Session.set('semesterPrice', null);
    }
  };
  return Lend;
});

Lend = new app.model.Lend();
Lend.init();
