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
  } else {
      Session.set('manualTitle', null);
      Session.set('dayPrice', null);
      Session.set('weekPrice', null);
      Session.set('monthPrice', null);
      Session.set('semesterPrice', null);
      Session.set('sellingPrice', null);
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
  },
  sellingPrice: function() {
    return Session.get('sellingPrice');  
  },
})

Template.manual.events({
 
  'click .close': function(e, template) {
      Session.set("photoTaken", null);
      $('#browser-file-upload').val('');
  },
    
  'change #browser-file-upload': function(input) {
    var FR = new FileReader();
    FR.onload = function(e) {
        var newImage = e.target.result;
        Session.set("photoTaken", newImage);
    };
    FR.readAsDataURL(input.target.files[0]);
  },

  'click .toggle': function(e, template) {
      if($('.enablePurchasing').text() === 'OFF') {
          $('.enablePurchasing').text('ON');
      }
      else {
          $('.enablePurchasing').text('OFF');
      }
  },
    
  'change .userPrice': function(e, template) {
    var rentPrice = {
      "day": template.find('.dayPrice').value,
      "week": template.find('.weekPrice').value,
      "month": template.find('.monthPrice').value,
      "semester": template.find('.semesterPrice').value,
    }

    var sellingPrice = template.find('.sellingPrice').value;
    
    Session.set('dayPrice', rentPrice.day);
    Session.set('weekPrice', rentPrice.week);
    Session.set('monthPrice', rentPrice.month);
    Session.set('semesterPrice', rentPrice.semester);    
      
    Session.set('sellingPrice', sellingPrice);
  },

  'click .scanResult-thumbnail2': function(event, template) {
    IonActionSheet.show({
      buttons: [
        { text: 'Take Photo' },
        { text: 'Choose from Library' },
      ],
      cancelText: 'Cancel',

      cancel: function() {
//        IonActionSheet.close();
      },
      buttonClicked: function(index) {
        var options = {
          width: 577,
          height: 1024,
          quality: 75,
          sourceType: 1
        };

        if(Meteor.isCordova || index == 0) {
            if(Meteor.isCordova) {
                if(index == 1) {
                    options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                } else {
                    options.sourceType = Camera.PictureSourceType.CAMERA;
                }
            }

            MeteorCamera.getPicture(options, function(err, data) {
              if(err) {
                IonPopup.show({
                      title: 'Get picture',
                      template: '<div class="center dark">Sorry, canot get picture.</div>',
                      buttons:
                      [{
                          text: 'OK',
                          type: 'button-energized',
                          onTap: function() {
                              IonPopup.close();
                          }
                      }]
                });
                return false;
              }
              Session.set("photoTaken", data);
            });
        } else {
          $('#browser-file-upload').click();
        }

        return true;
      }
    });
  }
});
