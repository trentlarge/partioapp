Template.productDetail.events({
  'click .features': function(e, template) {
    var features = $('.features');
    var featureDetails = $('.features-details');

    if(featureDetails.hasClass('hidden')){
      featureDetails.removeClass('hidden');
      features.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
    } else {
      featureDetails.addClass('hidden');
      features.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
    }
  }
});

Template.productDetail.rendered = function() {
  console.log("product detail rendered");
  Template.productDetail.helpers({
    getCategoryIcon: function(cat) {
      console.log(cat);
      return Categories.getCategoryIconByText(cat);
    }
  })
}
