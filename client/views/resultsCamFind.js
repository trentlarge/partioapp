Template.resultsCamFind.rendered = function() {
    Session.set('allResults', true);
    Session.set('selectedProduct', false);
}

Template.resultsCamFind.helpers({
  allResults: function(){
    return Session.get('allResults');
  },
  selectedProduct: function() {
    return Session.get('selectedProduct');
  },
});

Template.resultsCamFind.events({
    'click .product': function(e, template) {

          IonLoading.show();
          var asin = $(this)[0].asin;

          Meteor.call('itemFromAmazon', asin, function(error, result) { 

            if (result && !error) 
            {            
                Session.set('allResults', false);
                Session.set('selectedProduct', result);
                
                IonLoading.hide();
            } else {
                IonLoading.hide();
                IonPopup.show({
                  title: 'Please try again :( ',
                    template: '<div class="center">'+ error.message + '</div>',
                    buttons: 
                    [{
                      text: 'OK',
                      type: 'button-energized',
                      onTap: function() {
                        IonPopup.close();
                      }
                    }]
              });
            }
        });
        
    }
})