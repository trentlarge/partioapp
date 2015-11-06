app = app || {};

app.model.Lend = (function () {
   'use strict';

   var Lend = function() {

        this.currentCategory;

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

        CalculateRentingCharges : function() {

            if(this.RentingTimeSpan == 'ONE_DAY')
            {
                this.RentingFinalPrice = parseFloat((this.RentingOneDayPercentage/100) * this.RentingAmazonPrice);
            }
            else if(this.RentingTimeSpan == 'ONE_WEEK')
            {
                this.RentingFinalPrice = parseFloat((this.RentingOneWeekPercentage/100) * this.RentingAmazonPrice);
                console.log('RentingOneWeekPercentage: ' + this.RentingFinalPrice);

                this.RentingFinalPrice = parseFloat(this.RentingFinalPrice * 7);
                console.log('Pricex7: ' + this.RentingFinalPrice);
            }
            else if(RentingTimeSpan == 'ONE_MONTH')
            {
                this.RentingFinalPrice = parseFloat((this.RentingOneMonthPercentage/100) * this.RentingAmazonPrice);
                this.RentingFinalPrice = parseFloat(this.RentingFinalPrice * 30);
            }
            else if(this.RentingTimeSpan == 'FOUR_MONTHS')
            {
                this.RentingFinalPrice = parseFloat((this.RentingFourMonthsPercentage/100) * this.RentingAmazonPrice);
                this.RentingFinalPrice = parseFloat(this.RentingFinalPrice * 30 * 4);
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

            if(this.RentingFinalPrice > this.RentingAmazonRentalPrice)
            {
                this.RentingFinalPrice =  parseFloat(this.RentingAmazonRentalPrice - (this.RentingAmazonRentalPrice * 0.1));
            }

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

            //test value
            this.RentingAmazonRentalPrice = 100.0;

            this.CalculateRentingCharges();
        },

        ClearRentingValue : function()
        {
            this.RentingFinalPrice = 0.0;
        }

   };

   return Lend;
});

Lend = new app.model.Lend();