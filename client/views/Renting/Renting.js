Template.renting.rendered = function() {
    Session.set('isTapping', false);
}

Template.renting.helpers({

});

Template.renting.events({
	'click .borrowedBookDetail': function() {
		Router.go('/listing/'+this.data.product._id);
	},
  'click .waiting': function() {
      var waiting = $('.waiting');
      var waitingItem = $('.waiting-item');

      if(waitingItem.hasClass('hidden')){
          waitingItem.removeClass('hidden');
          waiting.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
      }
      else {
          waitingItem.addClass('hidden');
          waiting.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
      }
  },
  'click .payment': function() {
      var payment = $('.payment');
      var paymentItem = $('.payment-item');

      if(paymentItem.hasClass('hidden')){
          paymentItem.removeClass('hidden');
          payment.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
      }
      else {
          paymentItem.addClass('hidden');
          payment.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
      }
  },
  'click .borrowed': function() {
      var borrowed = $('.borrowed');
      var borrowedItem = $('.borrowed-item');

      if(borrowedItem.hasClass('hidden')){
          borrowedItem.removeClass('hidden');
          borrowed.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
      }
      else {
          borrowedItem.addClass('hidden');
          borrowed.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
      }
  },
  'click .returned': function() {
      var returned = $('.returned');
      var returnedItem = $('.returned-item');

      if(returnedItem.hasClass('hidden')){
          returnedItem.removeClass('hidden');
          returned.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
      }
      else {
          returnedItem.addClass('hidden');
          returned.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
      }
  },
});
