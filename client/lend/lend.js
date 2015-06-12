Template.lend.events({
  'click #viewfinder': function() {
    console.log('something\'s happenin');

    if (Meteor.isCordova) {
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          Session.set('scanResult', {
            "result": result.text,
            "format": result.format, 
            "cancelled": result.cancelled
          })
        }, 
        function (error) {
          alert("Scanning failed: " + error);
        }
        );
    }  
  }
});

Template.lend.helpers({
  scanResult: function() {
    return Session.get('scanResult');
  }
})