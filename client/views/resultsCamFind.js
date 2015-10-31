// RENDERED

Template.resultsCamFind.rendered = function() {
    Session.set('allResults', true);
    Session.set('selectedProduct', false);
}

// HELPERS
currentCategory = '';

Template.resultsCamFind.helpers({
  allResults: function(){
    return Session.get('allResults');
  },
  selectedProduct: function() {
    return Session.get('selectedProduct');
  },
  isDifferentCategory: function() {
      if(currentCategory !== this.category) {
          currentCategory = this.category;
          return true;
      }
      return false;
  },
  splitCategory: function() {
      return this.category.replace(/\s/g,"");
  }
});

// EVENTS

Template.resultsCamFind.events({
    
    'click .menu-category': function(e, template) {
        //console.log($(this)[0].val());
        var category = $('.' + $(this)[0].category.replace(/\s/g,""));
        
        if(category.hasClass('hidden')){
            category.removeClass('hidden');
        }
        else {
            category.addClass('hidden');
        }
        
//        if(category.is(':visible')){
//            category.hide();    
//        }
//        else {
//            category.show();
//        }
    },
    
    
    // This method get the ASIN code of product and get it features from amazon. 
    // So, the results is setted in selectedProduct field in the HTML file.
    'click .product': function(e, template) {

          IonLoading.show();
        
          //get ASIN code
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