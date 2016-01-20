Template.appLayout.events({
	'click #editCurrent': function() {
    var ConnectionObj = Connections.findOne({'productData._id': this.product._id});
    if(ConnectionObj){
      var ConnectionStatus = ConnectionObj.state;
      if(ConnectionStatus != "RETURNED"){
        IonPopup.show({
            title: 'Item Borrowed',
            template: 'It is not possible edit a borrowed item.',
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

        return false;
      }
    }

		Session.set('editMode', true);
	},
});

Template.inventoryDetail.onCreated(function () {
  Meteor.subscribe("singleProduct", Router.current().params._id)
});

Template.inventoryDetail.events({
	'focus input': function() {
		$('.inventory-details').css({
			'padding-bottom': '250px'
		});
	},

	'focusout input': function() {
		$('.inventory-details').css({
			'padding-bottom': '0'
		});
	},

  'click .features': function(e, template) {
    var features = $('.features');
    var featureDetails = $('.features-details');

    if(!featureDetails.is(':visible')){
        featureDetails.slideDown('fast');
        features.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
    } else {
        featureDetails.slideUp('fast');
        features.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
    }
  },

  'click #editSave': function(e, template) {
    var dayPrice = parseFloat(template.find('.dayPrice').value, 10),
        weekPrice = parseFloat(template.find('.weekPrice').value, 10),
        monthPrice = parseFloat(template.find('.monthPrice').value, 10),
        semesterPrice = parseFloat(template.find('.semesterPrice').value, 10);

    if(dayPrice < 0.5 || weekPrice < 0.5 || monthPrice < 0.5 || semesterPrice < 0.5){
      showInvalidPopUp('Invalid Inputs', 'Please enter a valid price.');
      return false;
    }

    if(dayPrice > 100000 || weekPrice > 100000 || monthPrice > 100000|| semesterPrice > 100000){
      showInvalidPopUp('Invalid Inputs', 'Please enter a Price less than 100000.');
      return false;
    }

    var conditionId = template.find('.condition').value;
    var title = template.find('.title').value;

    if(title.length == 0) {
      showInvalidPopUp('Invalid Inputs', 'Please enter a Title');
      return false;
    }

    if(conditionId == 0) {
    	showInvalidPopUp('Invalid Inputs', 'Please enter a Condition');
      return false;
    }

    var editedPrices = {
      "day": Number(dayPrice).toFixed(2),
      "week": Number(weekPrice).toFixed(2),
      "month": Number(monthPrice).toFixed(2),
      "semester": Number(semesterPrice).toFixed(2),
    }

    template.find('.dayPrice').value = editedPrices.day;
    template.find('.weekPrice').value = editedPrices.week;
    template.find('.monthPrice').value = editedPrices.month;
    template.find('.semesterPrice').value = editedPrices.semester;

    var image = template.find('.product-image').src;
      
    Meteor.call("updateProductData", this.product._id, title, conditionId, editedPrices, image, function(err, res) {
      if(err) {
        var errorMessage = err.reason || err.message;
        if(err.details) {
          errorMessage = errorMessage + "\nDetails:\n" + err.details;
        }
        sAlert.error(errorMessage);
        return;
      }
    });

    Session.set('editMode', false);
  },

  'click #editRemove': function(e, template) {
			var productId = this.product._id;

      IonPopup.show({
			title: 'Remove product?',
			template: 'Remove product from your invetory?',
        buttons:
        [
            {
              text: 'Cancel',
              type: 'button-default',
              onTap: function()
              {
                IonPopup.close();
              }
            },
            {
              text: 'Remove',
              type: 'button-assertive',
              onTap: function()
              {
                Products.remove({_id: productId});
                IonPopup.close();
                Session.set('editMode', false);
                Router.go('/inventory');
              }
            },
       ]
		});
  },
    
  'click .close': function(e, template) {
      $('#browser-file-upload').val('');
      template.find('.product-image').src = '/image-not-available.png';
  },
    
  'change #browser-file-upload': function(input, template) {
    var FR = new FileReader();
    FR.onload = function(e) {
        var newImage = e.target.result;
        template.find('.product-image').src = newImage;
    };
    FR.readAsDataURL(input.target.files[0]);
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
              template.find('.product-image').src = data;
            });
        } else {
          $('#browser-file-upload').click();
        }

        return true;
      }
    });
  }
    
});

function showInvalidPopUp(strTitle, strMessage){
  IonPopup.show({
    title: strTitle,
    template: strMessage,
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
