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

Template.manual.helpers({
  photoTaken: function() {
    return Session.get('photoTaken');
  },
  waitingForPrice: function() {
    return Session.get('userPrice') ? "": "disabled";
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
})

Template.manual.events({
  'click .scanResult-thumbnail2': function(event, template) {
    IonActionSheet.show({
      buttons: [
        { text: 'Take Photo' },
        { text: 'Choose from Library' },
      ],
      cancelText: 'Cancel',

      cancel: function() {
        console.log('Cancelled!');
      },
      buttonClicked: function(index) {
        if (index === 0) {
          navigator.camera.getPicture(onSuccess1, onFail1, {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA
          });

          function onSuccess1(imageData) {
            console.log('camera working!');
            Session.set("photoTaken", "data:image/jpeg;base64," + imageData);
            return false;
          }

          function onFail1(message) {
            IonPopup.alert({
              title: 'Camera Operation',
              template: message,
              okText: 'Got It.'
            });
          }
        }
        if (index === 1) {
          navigator.camera.getPicture(onSuccess2, onFail2, {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
          });

          function onSuccess2(imageData) {
            console.log('photo library working!');
            Session.set("photoTaken", "data:image/jpeg;base64," + imageData);
            return false;
          }

          function onFail2(message) {
            IonPopup.alert({
              title: 'Camera Operation',
              template: message,
              okText: 'Got It.'
            });
          }
        }
        return true;
      }
    });
  }
});

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