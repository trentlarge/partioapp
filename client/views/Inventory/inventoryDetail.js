Template.inventoryDetail.events({
  'click .features': function(e, template) {

      var features = $('.features');
      var featureDetails = $('.features-details');

        if(featureDetails.hasClass('hidden')){
            featureDetails.removeClass('hidden');
            features.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
        }
        else {
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

    if(dayPrice < 0.5 || weekPrice < 0.5 || monthPrice < 0.5 || semesterPrice < 0.5)
    {
      showInvalidPopUp('Invalid Inputs', 'Please enter a valid price.');
      return false;
    }

    if(dayPrice > 100000 || weekPrice > 100000 || monthPrice > 100000|| semesterPrice > 100000)
    {
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
    var description = template.find('.fieldDescriptionLend').value;
    var title = template.find('.title').value;
    var last_title = template.find('.last_title').value;

    Products.update({_id: this._id}, {$set: {title: title, customPrice: edited, rentPrice: editedPrices, description: description}});
    Session.set('editMode', false);

    if(title != last_title) {
      var last_title = template.find('.last_title').value;
      var _search = Search.findOne({title:last_title});
      if(_search){
          Meteor.call('updateAuthors', _search._id);
      }
    }
  }
});

Template.inventoryDetail.helpers({
  getCategoryIcon: function() {
      return Categories.getCategoryIconByText(this.category);
  },
  editMode: function() {

    var ConnectionObj = Connections.findOne({'productData._id': this._id});

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
})
