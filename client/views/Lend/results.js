
Template.results.helpers({
  scanResult: function() {
    return Session.get('scanResult');
  },
});

Template.item.helpers({
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
        Session.set('userPrice', false);  
        return false;
      }
      else
      {
          var priceValue = (Session.get('scanResult').price).split("$")[1];
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
})
