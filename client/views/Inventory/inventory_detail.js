Template.inventoryDetail.events({
  'click #editSave': function(e, template) {
    console.log("saving");

    var xPrice = parseInt(template.find('#editPrice').value, 10);
    console.log('Edit xPrice ' + xPrice);

    if(xPrice < 0.5)
    {
      showInvalidPopUp('Invalid Inputs', 'Please enter a valid price.');
      return false;
    }

    if(xPrice > 1000)
    {
      showInvalidPopUp('Invalid Inputs', 'Please enter a Price < 1000.');
      return false;
    }

    var edited = template.find('#editPrice').value;
    var description = template.find('.fieldDescriptionLend').value;
    Products.update({_id: this._id}, {$set: {customPrice: edited, description: description}});
    Session.set('editMode', false);
  }
});

function showInvalidPopUp(strTitle, strMessage)
{
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

var bookID;
Template.inventoryDetail.helpers({
  editMode: function() {

    var ConnectionObj = Connections.findOne({'bookData._id': this._id});

    if(ConnectionObj)
    {
      var ConnectionStatus = ConnectionObj.state;

      if(ConnectionStatus != "DONE")
      {
        //Check if book is in RENTING mode and disable edit option
        return false;
      }
    }

    return Session.get('editMode') ? true : false;
  },
  manualEntry: function() {
    return (this.manualEntry) ? true : false;
  }
});
