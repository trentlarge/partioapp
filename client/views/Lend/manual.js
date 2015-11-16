Template.manual.rendered = function() {
    Session.set('dayPrice', '');
    Session.set('weekPrice', '');
    Session.set('monthPrice', '');
    Session.set('semesterPrice', '');
}

Template.manual.helpers({
  photoTaken: function() {
    return Session.get('photoTaken');
  },
  getCategories: function() {
    return Categories.getCategories();  
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
        console.log('Cancelled!');
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
            console.log('camera working!');
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
            console.log('photo library working!');
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
