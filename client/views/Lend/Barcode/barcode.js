Template.barcode.rendered = function(){
  Session.set('placeholder', "Enter barcode number...");

  Session.set('scanResult', null);
  Session.set('allResults', null);

  $('.darken-element').css({'opacity': '1'});
  $('.view').css({'background': '#eceff1'});

  $('.search-share-header-input').removeClass('has-text');
};

Template.barcode.destroyed = function(){
  Session.set('placeholder', "Search product...");
};

Template.barcode.events({

  // BARCODE
  'click #barcode': function() {
    // Cordova
    if (Meteor.isCordova) {
      cloudSky.zBar.scan({},
        function(result) {
            var barcode = result;

            $('.search-share-header-input').val(barcode);
            $('.search-share-header-input').trigger({type: 'keypress', charCode: 13});
        },
        function(error) {
          alert("Scanning failed: " + error);
        });
    // not cordova
    } else {
      $('.search-share-header-input').val(9780439708180);
//      console.log('else');
      //$('.search-share-header-input').trigger({type: 'keypress', charCode: 13});
    }
  }
})
