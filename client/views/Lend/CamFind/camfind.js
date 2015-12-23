function processPicture(data) {
    if (!data) {
        return;
    }

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
                    title: 'Image Search',
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

              var inputSearch = $('.search-share-header-input');

              inputSearch.val(result.data.name);
              inputSearch.trigger({type: 'keypress', charCode: 13});

            } else {
              console.log(result.data.status);
              console.log('miss to handle');
              return false;
            }
          })
        } else {
          console.log(error);
          IonPopup.show({
            title: 'Image Search',
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
    });
}

Template.camfind.rendered = function() {
    Session.set('scanResult', null);
    Session.set('allResults', null);

    $('.darken-element').css({'opacity': '1'});
    $('.view').css({'background': '#eceff1'});
    //$('.search-share-header-input').val('');
    $('.search-share-header-input').focus();
}

Template.camfind.events({
    'change #browser-file-upload': function(input) {
        var FR = new FileReader();
        FR.onload = function(e) {
            var newImage = e.target.result;
            processPicture(newImage);
        };
        FR.readAsDataURL(input.target.files[0]);
    },

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
        var options = {
          width: 577,
          height: 1024,
          quality: 75,
          sourceType: 1
        };

        if(Meteor.isCordova || index == 0) {
            if(Meteor.isCordova) {
                if(index == 1) {
                    options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                } else {
                    options.sourceType = Camera.PictureSourceType.CAMERA;
                }
            }

            MeteorCamera.getPicture(options, function(err, data) {
                if(err) {
                  console.log(err);
                  IonPopup.show({
                        title: 'Get picture',
                        template: '<div class="center dark">Sorry, canot get picture.</div>',
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
                processPicture(data);
            });
        } else {
            $('#browser-file-upload').click();
        }

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


function attachImageAndWaitCamFind(url){
    $("#cam-find").hide();
    $(".item-input-inset").slideUp();
    $(".modal").css("background-image", "url("+url+")");
    $(".modal").css("background-size", "cover");
    $(".modal").css("background-position", "center");

    Session.set('camfindImage', url);
}

function resetImageCamFind(){
    $("#cam-find").show();
    $(".item-input-inset").slideDown();
    $(".modal").css("background-image", "");
}
