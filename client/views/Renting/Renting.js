
Template.renting.events({
  'click .waiting': function() {
      Animations.accordion($('.waiting'), $('.waiting-item'));
  },
  'click .payment': function() {
      Animations.accordion($('.payment'), $('.payment-item'));
  },
  'click .borrowed': function() {
      Animations.accordion($('.borrowed'), $('.borrowed-item'));
  },
  'click .returned': function() {
      Animations.accordion($('.returned'), $('.returned-item'));
  },
});
