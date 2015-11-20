Template.barcode.rendered = function(){
    Session.set('placeholder', "Enter barcode number...");   
};

Template.barcode.destroyed = function(){
    Session.set('placeholder', "Search product...");   
};

Template.barcode.events({

  // BARCODE
  'click #barcode': function() {
      
    console.log('the new Amazon call in progress');

    // Cordova
    if (Meteor.isCordova) {
      cordova.plugins.barcodeScanner.scan(
        function(result) {

          if (result.cancelled === 0) {
            console.log(result.text, result.format);

            var barcode = result.text;
            console.log('barcode: ' + barcode);
            $('.search-share-header-input').val(barcode);
            $('.search-share-header-input').trigger({type: 'keypress', charCode: 13});
          }
        },
        function(error) {
          alert("Scanning failed: " + error);
        });
    // not cordova
    } else {

        $('.search-share-header-input').val(9780439708180);
        $('.search-share-header-input').trigger({type: 'keypress', charCode: 13});

    }
  }
})
