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
              quality: 75
            }
        }

        MeteorCamera.getPicture(options, function(err, data) {
          if (data) {
            PartioLoad.show('We\'re identifying your image. This process could take few seconds...');

            attachImageAndWaitCamFind(data);
              Meteor.call('camfindGetTokenBase64', data, function(error, result) {
                console.log(error, result);
                if (!error && result.statusCode == 200) {
                  console.log("----camfindGetToken----");

                  // get image response
                  Meteor.call('camfindGetResponse', result.data.token, function(error, result) {
                    console.log("----camfindGetResponse----");

                    PartioLoad.hide();

                    //some error -------
                    if(error){
                      console.log(error);
                      IonPopup.show({
            						title: 'Phone activation',
            						template: '<div class="center dark">Sorry, this service isn\'t available at this moment.</div>',
            						buttons:
            						[{
            							text: 'OK',
            							type: 'button-energized',
            							onTap: function() {
                            IonPopup.close();
                            resetImageCamFind();
            							}
            						}]
            					});
                      return false;
                    }

                    //skiped -------
                    if(result.data.status == 'skipped') {
                      IonPopup.show({
            						title: 'Ops...',
            						template: '<div class="center dark">It\'s looks like anything. Please try another one. ;)</div>',
            						buttons:
            						[{
            							text: 'OK',
            							type: 'button-energized',
            							onTap: function() {
                            IonPopup.close();
                            resetImageCamFind();
            							}
            						}]
            					});
                      return false;

                    //completed -------
                    } else if(result.data.status == 'completed') {
                      $('.search-share-header-input').val(result.data.name);
                      $('.search-share-header-input').trigger({type: 'keypress', charCode: 13});

                    } else {
                      console.log(result.data.status);
                      console.log('miss to handle');
                      return false;
                    }
                  })
                }
              });
          }
        });
        return true;
      } // end buttonClicked
    });
  }
});

Template.camfind.helpers({
  uploadProgress: function () {
    return Session.get("progressUploadS3");
  }
})

//Template.camfindinput.events({
//
//})
//
//Template.camfindinput.helpers({
//  lastSearchCamFind: function(){
//    return Session.get('lastSearchCamFind');
//  },
//});


function attachImageAndWaitCamFind(url){
  $("#cam-find").hide();
  $(".item-input-inset").slideUp();
  $(".modal").css("background-image", "url("+url+")");
  $(".modal").css("background-size", "cover");
  $(".modal").css("background-position", "center");

}

function resetImageCamFind(){
  $("#cam-find").show();
  $(".item-input-inset").slideDown();
  $(".modal").css("background-image", "");

}
