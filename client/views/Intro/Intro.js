Template.intro.events({
  'onSlideChanged': function(event, template) {
    //if(event.index === 2) {

      console.log(event.index);

      $('.ion-slide-box').slick('slickSetOption', 'swipe', false, false);
      //$('.slider-pager').fadeOut();

      // setTimeout(function(){
      //   $('.slide-11').fadeOut(function(){
      //     Router.go('/register');
      //   });
      // }, 1500);
    //};
  },
  'click #jump-tutorial': function() {
      Router.go('/home');


      console.log('go home')
  }




});


Template.intro.rendered = function() {
  $(".bar-header").hide();
}
