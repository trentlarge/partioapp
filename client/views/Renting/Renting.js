
Template.renting.events({

    
  'click .waiting': function() {
      var waiting = $('.waiting');
      var waitingItem = $('.waiting-item');

      if(!waitingItem.is(':visible')){
          waitingItem.slideDown('fast');
          waiting.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
      }
      else {
          waitingItem.slideUp('fast');
          waiting.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
      }
  },
  'click .payment': function() {
      var payment = $('.payment');
      var paymentItem = $('.payment-item');

      if(!paymentItem.is(':visible')){
          paymentItem.slideDown('fast');
          payment.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
      }
      else {
          paymentItem.slideUp('fast');
          payment.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
      }
  },
  'click .borrowed': function() {
      var borrowed = $('.borrowed');
      var borrowedItem = $('.borrowed-item');

      if(!borrowedItem.is(':visible')){
          borrowedItem.slideDown('fast');
          borrowed.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
      }
      else {
          borrowedItem.slideUp('fast');
          borrowed.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
      }
  },
  'click .returned': function() {
      var returned = $('.returned');
      var returnedItem = $('.returned-item');

      if(!returnedItem.is(':visible')){
          returnedItem.slideDown('fast');
          returned.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
      }
      else {
          returnedItem.slideUp('fast');
          returned.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
      }
  },
});
