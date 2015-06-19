Template.lend.events({
  'click .viewfinder': function() {

    if (Meteor.isCordova) {
      cordova.plugins.barcodeScanner.scan(
        function (result) {
         
          if (result.cancelled === 0) {
            IonLoading.show();
            HTTP.get("https://www.googleapis.com/books/v1/volumes?q=isbn:"+ result.text, {timeout: 15000},
              function(error,result) {
              if (!error) {
                if (result.data.totalItems === 0) {
                  IonLoading.hide();
                  IonPopup.show({
                    title: 'No match found :( ',
                    template: '<div class="center">You can manually check-in your book</div>',
                    buttons: 
                    [{
                      text: 'OK',
                      type: 'button-assertive',
                      onTap: function() {
                        IonPopup.close();
                      }
                    }]
                  });
                } else {
                  var scanData = {
                    "price": (_.random(20, 50)).toFixed(2),
                    "thumbnail":  result.data.items[0].volumeInfo.imageLinks.smallThumbnail,
                    "title":  result.data.items[0].volumeInfo.title,
                    "subtitle": result.data.items[0].volumeInfo.subtitle,
                    "isbn10": result.data.items[0].volumeInfo.industryIdentifiers[1].identifier,
                    "publisher": result.data.items[0].volumeInfo.publisher,
                    "language": result.data.items[0].volumeInfo.language,
                    "author": result.data.items[0].volumeInfo.authors[0],
                    "pageCount": result.data.items[0].volumeInfo.pageCount
                  }
                  IonLoading.hide();
                  Session.set('scanResult', scanData);
                }
              } else {console.log(error)}
            });
            Meteor.setTimeout(function(){IonLoading.hide()},15000)
          } else {
            IonLoading.hide();
          }
        }, 
        function (error) {
          alert("Scanning failed: " + error);
        }
        );
    }
  }
});

Template.lend.events({
  'click #submitProduct': function(e, template) {
    IonLoading.show();
    Meteor.setTimeout(function() {
      if (Session.get('scanResult')) {
        var submitProduct = Session.get('scanResult');
        var lendingPeriod = (function() {
          return (template.find('#lendingPeriod').value) ? template.find('#lendingPeriod').value : 2; 
        }) ();

        var insertData = _.extend(submitProduct, {
          "lendingPeriod": lendingPeriod,
          "userId": Meteor.userId(),
          "customPrice": (submitProduct.price / 5).toFixed(2)
        })
        Products.insert(insertData);
        IonLoading.hide();
        IonPopup.show({
          title: 'Your Product sucessfully submitted',
          template: '<div class="center">You can find this shared book under "My Books" in the left menu</div>',
          buttons: 
          [{
            text: 'OK',
            type: 'button-assertive',
            onTap: function() {
              IonPopup.close();
              Router.go('/mybooks');
              IonModal.close();
            }
          }]
        });
      } else {
        IonLoading.hide();
        IonPopup.show({
          title: 'Nothing to add!',
          template: '<div class="center">Scan or add a book to make it available on parti-O for others to find</div>',
          buttons: 
          [{
            text: 'OK',
            type: 'button-assertive',
            onTap: function() {
              IonPopup.close();
            }
          }]
        });
      }
    }, 500)  
  }
})

Template.lend.helpers({
  scanResult: function() {
    return Session.get('scanResult');
  },
  calculatedPrice: function() {
    if (Session.get('scanResult')) {
      return "Share this book at $" + (Session.get('scanResult').price / 5).toFixed(2) + " per week"
    } else {
      return "Scan to get price suggestion"
    }
  }
});

Template.lend.destroyed = function() {
  Session.set('scanResult', null)
}


Template.mybooks.helpers({
  myBooks: function() {
    return Products.find({"userId": Meteor.userId()})
  }
})