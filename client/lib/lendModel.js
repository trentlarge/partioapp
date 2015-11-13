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

        CalculateRentingCharges : function() {

            if(this.RentingTimeSpan == 'ONE_DAY')
            {
                this.RentingFinalPrice = parseFloat((this.RentingOneDayPercentage/100) * this.RentingAmazonPrice);

                if(this.RentingFinalPrice < 3.00)
                    this.RentingFinalPrice = 3.00;
            }
            else if(this.RentingTimeSpan == 'ONE_WEEK')
            {
                this.RentingFinalPrice = parseFloat((this.RentingOneWeekPercentage/100) * this.RentingAmazonPrice);
//                console.log('RentingOneWeekPercentage: ' + this.RentingFinalPrice);

                this.RentingFinalPrice = parseFloat(this.RentingFinalPrice * 7);
//                console.log('Pricex7: ' + this.RentingFinalPrice);

                if(this.RentingFinalPrice < 7.00) //$1.00 per day
                    this.RentingFinalPrice = 7.00;
            }
            else if(this.RentingTimeSpan == 'ONE_MONTH')
            {
                this.RentingFinalPrice = parseFloat((this.RentingOneMonthPercentage/100) * this.RentingAmazonPrice);
                this.RentingFinalPrice = parseFloat(this.RentingFinalPrice * 30);

                if(this.RentingFinalPrice < 15.00) //$0.50 per day
                    this.RentingFinalPrice = 15.00;
            }
            else if(this.RentingTimeSpan == 'FOUR_MONTHS')
            {
                this.RentingFinalPrice = parseFloat((this.RentingFourMonthsPercentage/100) * this.RentingAmazonPrice);
                this.RentingFinalPrice = parseFloat(this.RentingFinalPrice * 30 * 4);

                if(this.RentingFinalPrice < 30.00) //$0.25 per day
                    this.RentingFinalPrice = 30.00;
            }

            console.log('RentingTimeSpan: ' + this.RentingTimeSpan);
            console.log('RentingAmazonPrice: ' + this.RentingAmazonPrice);
            console.log('RentingAmazonRentalPrice: ' + this.RentingAmazonRentalPrice);

            this.RentingFinalPrice += parseFloat((this.RentingStripeFeePercent/100) * this.RentingFinalPrice);
            console.log('RentingStripeFeePercent: ' + this.RentingFinalPrice);
            this.RentingFinalPrice += parseFloat(this.RentingStripeAdditionalFee);
            console.log('RentingStripeAdditionalFee: ' + this.RentingFinalPrice);

            this.RentingFinalPrice += parseFloat((this.RentingPartioSharePercentage/100) * this.RentingFinalPrice);
            console.log('RentingPartioSharePercentage: ' + this.RentingFinalPrice);


            this.RentingFinalPrice = Math.round(Number((this.RentingFinalPrice).toFixed(1))).toFixed(2);
            console.log('RentingFinalPrice: ' + Math.round(this.RentingFinalPrice));
        },

        GetRentingPercentages : function(strRentingTimeSpan, priceValue)
        {
            this.RentingAmazonPrice = parseFloat(priceValue);
            this.RentingTimeSpan = strRentingTimeSpan;
            this.RentingOneDayPercentage = 2;
            this.RentingOneWeekPercentage = 1;
            this.RentingOneMonthPercentage = 0.5;
            this.RentingFourMonthsPercentage = 0.25;

            this.RentingPartioSharePercentage = 10;

            this.RentingStripeFeePercent = 2.9;
            this.RentingStripeAdditionalFee = 0.3;

            this.CalculateRentingCharges();
        },

        ClearRentingValue : function()
        {
            this.RentingFinalPrice = 0.0;
        },
       
        addProductToInventoryManually : function(manualProduct) {
    
            Products.insert(manualProduct);
            this.clearPrices();

            PartioLoad.hide();
            IonPopup.show({
            title: 'Your Product sucessfully submitted',
            template: '<div class="center">You can find this shared item in your Repository</div>',
            buttons:
            [{
              text: 'OK',
              type: 'button-energized',
              onTap: function() {
                $('#closeLend').click();
                IonPopup.close();
                Router.go('/inventory');
                IonModal.close();
              }
            }]
            });
        },

        addProductToInventory : function(product) {
            
            Products.insert(product);
            this.clearPrices();
            
            PartioLoad.hide();

            IonPopup.show({
            title: 'Your Product sucessfully submitted',
            template: '<div class="center">And saved to your Inventory</div>',
            buttons:
            [{
              text: 'OK',
              type: 'button-energized',
              onTap: function() {
                $('#closeLend').click();
                IonPopup.close();
                Router.go('/inventory');
              }
            }]
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
