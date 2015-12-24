Template.manual.rendered = function() {
    
    var itemNotFound = Session.get('itemNotFound');
    if(itemNotFound) {
        Session.set('photoTaken', itemNotFound.image);
        Session.set('manualTitle', itemNotFound.title);
        Session.set('selectedCategory', itemNotFound.category);
        Session.set('dayPrice', itemNotFound.price.day);
        Session.set('weekPrice', itemNotFound.price.week);
        Session.set('monthPrice', itemNotFound.price.month);
        Session.set('semesterPrice', itemNotFound.price.semester);
    }
    else {
        Session.set('manualTitle', null);
        Session.set('dayPrice', null);
        Session.set('weekPrice', null);
        Session.set('monthPrice', null);
        Session.set('semesterPrice', null);
        Session.set('photoTaken', null);
    }
    
    //check card back
    var manualProduct = Session.get('cardManualEntry');
    if(manualProduct) {
        Session.set('photoTaken', manualProduct.image);
        Session.set('manualTitle', manualProduct.title);
        Session.set('selectedCategory', manualProduct.category);
        Session.set('selectedCondition', manualProduct.conditionId);
        Session.set('dayPrice', manualProduct.rentPrice.day);
        Session.set('weekPrice', manualProduct.rentPrice.week);
        Session.set('monthPrice', manualProduct.rentPrice.month);
        Session.set('semesterPrice', manualProduct.rentPrice.semester);
    }
    

    Session.set('scanResult', null);
    Session.set('allResults', null);

    $('.darken-element').css({'opacity': '1'});
    $('.view').css({'background': '#eceff1'});

    $('.search-share-header-input').removeClass('has-text');
//    $('.search-share-header-input').focus();
}

Template.manual.destroyed = function() {
    Session.set('itemNotFound', null);
    Session.set('photoTaken', null);
    Session.set('camfindImage', null);
    Session.set('selectedCategory', null);
    Session.set('selectedCondition', null);
}

Template.manual.helpers({
  photoTaken: function() {
    return Session.get('photoTaken');
  },
  getCategories: function() {
    return Categories.getCategories();
  },
  selectedCategory: function(category) {
      return (category === Session.get('selectedCategory')) ? 'selected' : '';
  },
  selectedCondition: function(index) {
      return (index == Session.get('selectedCondition')) ? 'selected' : '';
  },
  getConditions: function() {
    return Rating.getConditions();
  },
  waitingForPrices: function() {
      return Lend.validatePrices() ? "": "disabled";
  },
  validatePrices: function(){
      return Lend.validatePrices();
  },
  manualTitle: function() {
      return Session.get('manualTitle');
  },
  dayPrice: function(){
      return Session.get('dayPrice');
  },
  weekPrice: function(){
      return Session.get('weekPrice');
  },
  monthPrice: function(){
      return Session.get('monthPrice');
  },
  semesterPrice: function(){
      return Session.get('semesterPrice');
  }
})

Template.manual.events({
    
//  'focus input': function(e, template) {  
//    $('.manual-entry').css({ 'padding-bottom': '250px' });
//  },
//
//  'focusout input': function(e, template) {
//    //$('.content').scrollTop( $(e.target)[0].scrollHeight );    
//    $('.manual-entry').css({ 'padding-bottom': '50px' });
//  },

  'change .userPrice': function(e, template) {

      var rentPrice = {
        "day": template.find('.dayPrice').value,
        "week": template.find('.weekPrice').value,
        "month": template.find('.monthPrice').value,
        "semester": template.find('.semesterPrice').value,
     }

      Session.set('dayPrice', rentPrice.day);
      Session.set('weekPrice', rentPrice.week);
      Session.set('monthPrice', rentPrice.month);
      Session.set('semesterPrice', rentPrice.semester);

  },
  'click .scanResult-thumbnail2': function(event, template) {
    IonActionSheet.show({
      buttons: [
        { text: 'Take Photo' },
        { text: 'Choose from Library' },
      ],
      cancelText: 'Cancel',

      cancel: function() {
        IonActionSheet.close();
      },
      buttonClicked: function(index) {
        switch (index) {
          // library
          case 1:
            var options = {
              width: 577,
              height: 1024,
              quality: 75,
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            }
            break;
          //
          default:
            var options = {
              width: 577,
              height: 1024,
              quality: 75
            }
        }

        MeteorCamera.getPicture(options, function(err, data) {
          IonActionSheet.close();

          if(err) {
            ShowNotificationMessage(err.reason);
            return false;

          } else {
            Session.set("photoTaken", data);
            return true;
          }
        })
      },


        // if (index === 1) {
        //   navigator.camera.getPicture(onSuccess2, onFail2, {
        //     targetWidth: 200,
        //     targetHeight: 200,
        //     quality: 50,
        //     destinationType: Camera.DestinationType.DATA_URL,
        //     sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        //   });
        //
        //   function onSuccess2(imageData) {
        //     Session.set("photoTaken", "data:image/jpeg;base64," + imageData);
        //     return false;
        //   }
        //
        //   function onFail2(message) {
        //     IonPopup.alert({
        //       title: 'Camera Operation',
        //       template: message,
        //       okText: 'Got It.'
        //     });
        //   }
        // }
        // return true;
      //}
    });
  }
});
