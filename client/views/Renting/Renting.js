Template.renting.onCreated(function () {
  this.subscribe("myConnections");
});


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
  'click .requests-purchasing': function() {
    Animations.accordion($('.requests-purchasing'), $('.requests-purchasing-item'));
  },
  'click #start-borrowing': function() {
        Router.go('/listing')
    },
});

Template.renting.helpers({
  'iconRandom': function() {
        return Random.choice(['ion-ios-book', 
                              'ion-ios-game-controller-b', 
                              'ion-headphone',
                              'ion-android-restaurant',
                              'ion-ios-americanfootball',
                              'ion-cube']);
  }
});
