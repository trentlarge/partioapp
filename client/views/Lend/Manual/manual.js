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

  'focus input': function() {
    $('.manual-entry').css({
        'padding-bottom': '200px'
    });
  },
    
  'focusout input': function() {
    $('.manual-entry').css({
        'padding-bottom': '50px'
    });
  },
                       
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
//        console.log('Cancelled!');
      },
      buttonClicked: function(index) {
        if (index === 0) {
          navigator.camera.getPicture(onSuccess1, onFail1, {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA
          });

          function onSuccess1(imageData) {
            Session.set("photoTaken", "data:image/jpeg;base64," + imageData);
            return false;
          }

          function onFail1(message) {
            IonPopup.alert({
              title: 'Camera Operation',
              template: message,
              okText: 'Got It.'
            });
          }
        }
        if (index === 1) {
          navigator.camera.getPicture(onSuccess2, onFail2, {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
          });

          function onSuccess2(imageData) {
            Session.set("photoTaken", "data:image/jpeg;base64," + imageData);
            return false;
          }

          function onFail2(message) {
            IonPopup.alert({
              title: 'Camera Operation',
              template: message,
              okText: 'Got It.'
            });
          }
        }
        return true;
      }
    });
  }
});
