Template.productDetail.events({
  'click .features': function(e, template) {
    var features = $('.features'),
        featureDetails = $('.features-details');

    if(!featureDetails.is(':visible')){
      featureDetails.slideDown('fast');
      features.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
    } else {
      featureDetails.slideUp('fast');
      features.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
    }
  }
});

Template.productDetail.helpers({
  getCategoryIcon: function() {
      return Categories.getCategoryIconByText(this.category);
  },
})
