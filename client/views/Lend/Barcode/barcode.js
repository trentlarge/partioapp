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

    console.log('aciona barcode');

    // Cordova
    if (Meteor.isCordova) {

      var params = {
        text_title: "Scan barcode",
        text_instructions: "Barcode wordt automatisch gescand",
        camera: "back",
        flash: "auto",
        drawSight: false
      }
      cloudSky.zBar.scan(params, function (result) {
        console.log("We got a barcode");
        console.log(result);
        //alert(result);
        Session.set("text", result);
        $('.search-share-header-input').val(result);
        $('.search-share-header-input').trigger({type: 'keypress', charCode: 13});
      }, function (error) {
        console.log("We got an error");
        console.log(error);
        //alert("Scanning failed: " + error);
        Session.set("error", error)
      });



    } else {
      $('.search-share-header-input').val(9780439708180);
      console.log('else');
      //$('.search-share-header-input').trigger({type: 'keypress', charCode: 13});
    }



  }
})
