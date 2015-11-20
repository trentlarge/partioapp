Template.inventoryDetail.events({
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
  },

  'click #editSave': function(e, template) {
    console.log("saving");

    var dayPrice = parseInt(template.find('.dayPrice').value, 10),
      weekPrice = parseInt(template.find('.weekPrice').value, 10),
      monthPrice = parseInt(template.find('.monthPrice').value, 10),
      semesterPrice = parseInt(template.find('.semesterPrice').value, 10);

    if(dayPrice < 0.5 || weekPrice < 0.5 || monthPrice < 0.5 || semesterPrice < 0.5){
      showInvalidPopUp('Invalid Inputs', 'Please enter a valid price.');
      return false;
    }

    if(dayPrice > 100000 || weekPrice > 100000 || monthPrice > 100000|| semesterPrice > 100000){
      showInvalidPopUp('Invalid Inputs', 'Please enter a Price less than 100000.');
      return false;
    }

    var editedPrices = {
      "day": template.find('.dayPrice').value,
      "week": template.find('.weekPrice').value,
      "month": template.find('.monthPrice').value,
      "semester": template.find('.semesterPrice').value,
    }

    var edited = template.find('.semesterPrice').value;
    var title = template.find('.title').value;

    Products.update({_id: this.product._id}, {$set: {title: title, customPrice: edited, rentPrice: editedPrices}});
    Session.set('editMode', false);
  }
});

function showInvalidPopUp(strTitle, strMessage){
  IonPopup.show({
    title: strTitle,
    template: '<div class="center">'+strMessage+'</div>',
    buttons:
    [{
      text: 'OK',
      type: 'button-assertive',
      onTap: function()
      {
        IonPopup.close();
      }
    }]
  });
}
