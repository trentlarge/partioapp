Template.intro.events({
  'onSlideChanged': function(event, template) {
    //if(event.index === 2) {
      $('.ion-slide-box').slick('slickSetOption', 'swipe', false, false);
      //$('.slider-pager').fadeOut();

      // setTimeout(function(){
      //   $('.slide-11').fadeOut(function(){
      //     Router.go('/register');
      //   });
      // }, 1500);
    //};
  }
});


Template.intro.rendered = function() {
  $(".bar-header").hide();
}
