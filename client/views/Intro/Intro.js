Template.intro.events({
  'onSlideChanged': function(event, template) {
  },
  // 'click #jump-tutorial': function() {
  //     Router.go('/home');
  // }
});


Template.intro.rendered = function() {


    var view = (Iron.Location.get().path).split("/")[1];

    if(view === true){

      console.log('view = true');

    }

    if (!Meteor.user() === null && !view === true) {

          Router.go('/home');
          console.log('logado');

    } 



  $(".bar-header").hide();
  $('.ion-slide-box').slick({
    rtl: true
  });
}
