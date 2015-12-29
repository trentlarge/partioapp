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

Template.inventoryDetail.events({
    
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

    Meteor.call("updateProductData", this.product._id, title, conditionId, editedPrices, function(err, res) {
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
