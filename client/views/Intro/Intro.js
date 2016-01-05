Template.intro.events({
  'onSlideChanged': function(event, template) {
  },
  'click #jump-tutorial': function() {
      Router.go('/home');
  }
});


Template.intro.rendered = function() {
  $(".bar-header").hide();
  $('.ion-slide-box').slick({
    rtl: true
  });
}
