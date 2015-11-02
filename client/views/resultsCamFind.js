var RentingTimeSpan; //ONE_DAY, ONE_WEEK, ONE_MONTH, FOUR_MONTHS
var RentingOneDayPercentage;
var RentingOneWeekPercentage;
var RentingOneMonthPercentage;
var RentingFourMonthsPercentage;
var RentingPartioSharePercentage;
var RentingStripeFeePercent;
var RentingStripeAdditionalFee;
var RentingAmazonPrice;
var RentingAmazonRentalPrice;
var RentingFinalPrice;

// RENDERED

Template.resultsCamFind.rendered = function() {
    Session.set('allResults', true);
    Session.set('scanResult', false);
}

// HELPERS
currentCategory = '';

Template.resultsCamFind.helpers({
  allResults: function(){
    return Session.get('allResults');
  },
  scanResult: function() {
    return Session.get('scanResult');
  },
  isDifferentCategory: function() {
      if(currentCategory !== this.category) {
          currentCategory = this.category;
          return true;
      }
      return false;
  },
  splitCategory: function() {
      return this.category.replace(/\s/g,"");
  },
  userPrice: function() {
    console.log('price rendered: ' + Session.get('userPrice'));
    return Session.get('userPrice');
  },
  calculatedPrice: function() {
    if (Session.get('scanResult')) {
      if (Session.get('scanResult').price === "--") {
        return false;
      } 
      else 
      {
        if(RentingFinalPrice == null ||
          RentingFinalPrice == 0)
        {
          var priceValue = (Session.get('scanResult').price).split("$")[1];
          console.log('priceValue: ' + priceValue);
          Session.set('priceValue', priceValue);

          Session.set('userPrice', (Number(priceValue)/5).toFixed(2));

          GetRentingPercentages('ONE_WEEK');
          Session.set('userPrice', RentingFinalPrice);
          
          // return (Number(priceValue)/5).toFixed(2);        
          return RentingFinalPrice;
        }

        return RentingFinalPrice;
      }
    }
  },
});

// EVENTS

Template.resultsCamFind.events({
    
    // hide/show products by category
    'click .menu-category': function(e, template) {
        var category = $('.' + $(this)[0].category.replace(/\s/g,""));
        
        if(category.hasClass('hidden')){
            category.removeClass('hidden');
        }
        else {
            category.addClass('hidden');
        }
    },
    
    // This method get the ASIN code of product and get it features from amazon. 
    // So, the results is setted in scanResult field in the HTML file.
    'click .product': function(e, template) {

          IonLoading.show();
        
          //get ASIN code
          var asin = $(this)[0].asin;

          Meteor.call('itemFromAmazon', asin, function(error, result) { 

            if (result && !error) 
            {            
                Session.set('allResults', false);
                Session.set('scanResult', result);
                
                IonLoading.hide();
            } else {
                IonLoading.hide();
                IonPopup.show({
                  title: 'Please try again :( ',
                    template: '<div class="center">'+ error.message + '</div>',
                    buttons: 
                    [{
                      text: 'OK',
                      type: 'button-energized',
                      onTap: function() {
                        IonPopup.close();
                      }
                    }]
              });
            }
        });
        
    },
});

// DESTROYED

Template.resultsCamFind.destroyed = function() {
  Session.set('scanResult', null);
  Session.set('allResults', null);
}


function CalculateRentingCharges()
{
  if(RentingTimeSpan == 'ONE_DAY')
  {
    RentingFinalPrice = parseFloat((RentingOneDayPercentage/100) * RentingAmazonPrice);
  }
  else if(RentingTimeSpan == 'ONE_WEEK')
  {
    RentingFinalPrice = parseFloat((RentingOneWeekPercentage/100) * RentingAmazonPrice);
    console.log('RentingOneWeekPercentage: ' + RentingFinalPrice);

    RentingFinalPrice = parseFloat(RentingFinalPrice * 7);    
    console.log('Pricex7: ' + RentingFinalPrice);
  }
  else if(RentingTimeSpan == 'ONE_MONTH')
  {
    RentingFinalPrice = parseFloat((RentingOneMonthPercentage/100) * RentingAmazonPrice);
    RentingFinalPrice = parseFloat(RentingFinalPrice * 30);    
  }
  else if(RentingTimeSpan == 'FOUR_MONTHS')
  {
    RentingFinalPrice = parseFloat((RentingFourMonthsPercentage/100) * RentingAmazonPrice);    
    RentingFinalPrice = parseFloat(RentingFinalPrice * 30 * 4);    
  }

  console.log('RentingTimeSpan: ' + RentingTimeSpan);
  console.log('RentingAmazonPrice: ' + RentingAmazonPrice);
  console.log('RentingAmazonRentalPrice: ' + RentingAmazonRentalPrice);

  RentingFinalPrice += parseFloat((RentingStripeFeePercent/100) * RentingFinalPrice);
  console.log('RentingStripeFeePercent: ' + RentingFinalPrice);
  RentingFinalPrice += parseFloat(RentingStripeAdditionalFee);
  console.log('RentingStripeAdditionalFee: ' + RentingFinalPrice);

  RentingFinalPrice += parseFloat((RentingPartioSharePercentage/100) * RentingFinalPrice);
  console.log('RentingPartioSharePercentage: ' + RentingFinalPrice);

  if(RentingFinalPrice > RentingAmazonRentalPrice)
  {
    RentingFinalPrice =  parseFloat(RentingAmazonRentalPrice - (RentingAmazonRentalPrice * 0.1));
  }

  RentingFinalPrice = Math.round(Number((RentingFinalPrice).toFixed(1))).toFixed(2);
  console.log('RentingFinalPrice: ' + Math.round(RentingFinalPrice));

  
}

function GetRentingPercentages(strRentingTimeSpan)
{
  RentingAmazonPrice = parseFloat(Session.get('priceValue'));
  RentingTimeSpan = strRentingTimeSpan;
  RentingOneDayPercentage = 2;
  RentingOneWeekPercentage = 1;
  RentingOneMonthPercentage = 0.5;
  RentingFourMonthsPercentage = 0.25;

  RentingPartioSharePercentage = 10;

  RentingStripeFeePercent = 2.9;
  RentingStripeAdditionalFee = 0.3;

  //test value
  RentingAmazonRentalPrice = 100.0;

  CalculateRentingCharges();
}

function ClearRentingValue()
{
  RentingFinalPrice = 0.0; 
}

function ClearData()
{
  console.log('ClearData');
  RentingFinalPrice = null;
  Session.set('scanResult', null);
  Session.set('allResults', null);
  Session.set('priceValue', null);
  Session.set('userPrice', null);
  Session.set('priceValue', null);
}