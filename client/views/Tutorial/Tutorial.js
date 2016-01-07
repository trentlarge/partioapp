// Template.tutorial.events({
//   'onSlideChanged': function(event, template) {
//   }
// });

Template.tutorial.rendered = function() {
  $('.ion-slide-box').slick({
    rtl: true
  });
}
