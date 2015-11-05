Template.camfind.events({
  'click #cam-find': function(event, template) {
    IonActionSheet.show({
      buttons: [
      { text: 'Take Photo' },
      { text: 'Choose from Library' },
      ],
      cancelText: 'Cancel',

      cancel: function() {
        console.log('Cancelled!');
      },

      buttonClicked: function(index) {
        switch (index) {
          // library
          case 1:
            var options = {
              width: 577,
              height: 1024,
              quality: 75,
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            }
            break;
          //
          default:
            var options = {
              width: 577,
              height: 1024,
              quality: 75,
            }
        }

        MeteorCamera.getPicture(options, function(err, data) {
          if (data) {
            IonLoading.show();

            attachImageAndWaitCamFind(data);

            // start uploading
            Meteor.call('amazons3upload', data, function(error, result){
              console.log("----amazons3upload----");

              // get first contact with camfind
              Meteor.call('camfindGetToken', result, function(error, result) {
                if (!error && result.statusCode == 200) {
                  console.log("----camfindGetToken----");

                  // get image response
                  Meteor.call('camfindGetResponse', result.data.token, function(error, result) {
                    console.log("----camfindGetResponse----");
                    console.log(result);
                    if(result) {
                      $('#manualInputCamFind').val(result.data.name);
                      $('#manualSubmitCamFind').trigger('click');
                    }
                  })
                }
              });
            })
          }
        });
        return true;
      } // end buttonClicked
    });
  }
});

// Template.camfind.helpers({
//   imageurl: function(){
//     return Session.get('camfindphoto');
//   }
// })

Template.camfindinput.events({
  'click #manualSubmitCamFind': function(e, template) {
    IonLoading.show();

    //get keywords
    var keys = template.find('#manualInputCamFind').value;

    Session.set("lastSearchCamFind", keys)

    console.log(keys);

    Meteor.call('AllItemsFromAmazon', keys, function(error, result) {

      if(error && !result) {
        IonLoading.hide();
        resetImageCamFind();

        IonPopup.show({
          title: 'Ops...',
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

      } else {

        // sort results by category
        result.sort(function(a, b) {
            return (a.category > b.category) ? 1 : -1;
        });
          
        $.each(result, function(index, r) {
            result[index].index = index;
        });

        Session.set('allResults', result);
        Session.set('lendTab', 'resultsCamFind');
        IonLoading.hide();
        $(".modal").css("background-image", "");

      }
    });
  },
})

Template.camfindinput.helpers({
  lastSearchCamFind: function(){
    return Session.get('lastSearchCamFind');
  },
});


function attachImageAndWaitCamFind(url){
  $(".modal").css("background-image", "url("+url+")");
  $(".modal").css("background-size", "cover");
  $(".modal").css("background-position", "center");
  $("#cam-find").fadeOut();
  $(".item-input-inset").slideUp();
}

function resetImageCamFind(){
  $(".modal").css("background-image", "");
  $("#cam-find").show();
  $(".item-input-inset").slideDown();
}
