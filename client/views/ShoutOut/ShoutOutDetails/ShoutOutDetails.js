Template.shoutoutDetails.rendered = function() {
    
//    if(this.data.products) {
//        Session.set('products', this.data.products);
//    }
//    
//    if(this.data.shout) {
//        Session.set('shout', this.data.shout);
//    }
}

Template.shoutoutDetails.destroyed = function() {
    Session.set('products', null);
    Session.set('shout', null);
}

Template.shoutoutShare.helpers({
    
    getProducts: function() {
        return Session.get('products');
    },
    
    getCondition: function(conditionId) {
        return Rating.getConditionByIndex(conditionId);
    },

});

Template.shoutoutShare.events({
  
    'click .share-item': function(e, template) {
        
        var product = this;
        var shout = Session.get('shout');
        var exist = false;
        
        $.each(shout.sharedProducts, function(index, sharedProduct) {
            if(product._id === sharedProduct._id) {
                exist = true;
            }
        });
        
        if(exist) {
            IonPopup.show({
                title: 'Ops...',
                template: 'Product already shared. Please add another product.',
                buttons: [{
                    text: 'OK',
                    type: 'button-calm',
                    onTap: function() {
                        IonPopup.close();
                    }
                }]
            });
            
            return;
        }
        
        IonPopup.confirm({
            okText: 'Proceed',
            cancelText: 'Cancel',
            title: 'Share Product',
            template: 'Are you sure you want share ' + product.title + '?',
            onOk: function() {
                PartioLoad.show();
                Meteor.call('updateShoutOut', shout._id, product, function(err, res) {
                  PartioLoad.hide();
                  IonPopup.close();

                  if(err) {
                    var errorMessage = err.reason || err.message;
                    if(err.details) {
                      errorMessage = errorMessage + "\nDetails:\n" + err.details;
                    }
                    sAlert.error(errorMessage);
                    return;
                  }
                  else {
                      shout.sharedProducts.push(product);
                      Session.set('shout', shout);
                      $('.modal button').click();
                  }
                  
                });
            },

            onCancel: function() {
                return false;
            }
        });
        
    }
    
})
    