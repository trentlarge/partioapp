Template.camfind.events({
  'click #cam-find': function(event, template) {
      testCamFindMethod();
  }
});

var initiateCamfind = function(downloadUrl, callback) {
  console.log("------INITIATING CAMFIND------")
  Meteor.call('camfindCall', downloadUrl, function(error, result) {
    if (!error) {
      console.log("----got some data from server Camfind----");
      console.log(result);

      if (result.status == "completed") {
        IonLoading.hide();
        callback(result.name);
        return result.name;
      } else {
        initiateCamfind(downloadUrl);
      }
    }
  });
}

var b64toBlob = function(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/jpeg' });
}



function testCamFindMethod()
{
  // if (Meteor.isCordova)
  // {
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

      // NEW PHOTO  --------------------
        if (index === 0) {
          var options = {
            width: 1024,
            height: 768,
            quality: 75
          }
          MeteorCamera.getPicture(options, function(err, data) {
            if (data) {
              Meteor.call('base64tos3', data, function(result){
                console.log('calbackkkkkkkkkk')


                if(result){
                  console.log('calback result'+ result);

                  initiateCamfind(result, function(response) {
                    IonPopup.show({
                      title: response,
                        template: '',
                        buttons:
                        [{
                          text: 'OK',
                          type: 'button-assertive',
                          onTap: function() {
                            IonPopup.close();
                          }
                        }]
                      });
                  })
                }
        			});
            }
          });
        }


      // PHOTO LIBRARY --------------------
        if (index === 1) {

          var options = {
            width: 1024,
            height: 768,
            quality: 75,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
          }

          MeteorCamera.getPicture(options, function(err, data) {
            if (data) {
              Meteor.call('base64tos3', data, function(result){
                initiateCamfind(result, function(response) {
                    IonPopup.show({
                      title: response,
                        template: '',
                        buttons:
                        [{
                          text: 'OK',
                          type: 'button-assertive',
                          onTap: function() {
                            IonPopup.close();
                          }
                        }]
                      });
                    })
                });
              }
          });
        }
      return true;
     }
  });
}
