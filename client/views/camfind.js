Template.camfind.events({
  'click #cam-find': function(event, template) {
    //IonLoading.show();
    
      //alert('clicou');
      testCamFindMethod();
        // var cameraOptions = {
        //     width: 800,
        //     height: 600
        // };
        // MeteorCamera.getPicture(cameraOptions, function (error, data) {
        //    if (!error) {
        //     console.log(data);
        //     alert(data);
        //        template.$('.photo').attr('src', data); 
        //    }
        // });
        // event.preventDefault();

    // function onSuccess1(imageData) {
    //   console.log('capture done as base64');

    //   var imageBlob = b64toBlob("data:image/jpeg;base64," + imageData);
    //   console.log(imageBlob);

    //   //var uploader = new Slingshot.Upload("myFileUploads");

    //   uploader.send(imageBlob, function (error, downloadUrl) {
    //     if (error) {
    //       console.error('Error uploading', uploader.xhr.response);
    //       alert (error);
    //     }
    //     else {
    //       console.log(downloadUrl);
    //       initiateCamfind(downloadUrl, function(response) {
    //         IonPopup.show({
    //           title: response,
    //             template: '',
    //             buttons:
    //             [{
    //               text: 'OK',
    //               type: 'button-assertive',
    //               onTap: function() {
    //                 IonPopup.close();
    //               }
    //             }]
    //           });
    //       })
      
    //     }
    //   });

    //   return false;
    // }

    // function onFail1(message) {
    //   IonPopup.alert({
    //     title: 'Camera Operation',
    //     template: message,
    //     okText: 'Got It.'
    //   });
    // }
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
  if (Meteor.isCordova)
  {
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


        if (index === 0) {
          navigator.camera.getPicture(onSuccess1, onFail1, {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: true 
          });

          function onSuccess1(imageData) {

            new Date();

            alert('camera working! '+Date.now());
            alert('RETORNO DA FOTO '+imageData);
            //template.$('.photo-take-now').attr('src', imageData); 
            //template.imageData.set(imageData);
            console.log(imageData);
            alert('start CAMFIND');

            document.getElementById('photo-take-now').src = imageData;



            var imageBlob = b64toBlob("data:image/jpeg;base64," + imageData);

            window.resolveLocalFileSystemURL(imagePath, function(fileEntry) {

                fileEntry.file(function(file) {

                  var reader = new FileReader();
                  reader.onloadend = function (evt) {
                    console.log("read success");
                    console.log(evt.target.result);

                    //Test Code
                    Meteor.call('camFindCall', evt.target.result, function(error, result) {
                      console.log(error);
                      console.log(result);
                    });
                  };
                  reader.readAsBinaryString(file);

                })

              }, function(errorMessage)
              {
                console.log(errorMessage);
              });




            return false;
          }

          function onFail1(message) {
            IonPopup.alert({
              title: 'Camera Operation',
              template: message,
              okText: 'Got It.'
            });
          }
        }
        if (index === 1) {
          navigator.camera.getPicture(onSuccess2, onFail2, {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
          });

          function onSuccess2(imageData)
          {
            console.log('photo library working!');

            Meteor.call('camFindCall', imageData, function(error, result) {
              console.log(error);
              console.log(result);
            });

            // var imageBlob = b64toBlob("data:image/jpeg;base64," + imageData);

            // window.resolveLocalFileSystemURL(imagePath, function(fileEntry) {

            //     fileEntry.file(function(file) {

            //       var reader = new FileReader();
            //       reader.onloadend = function (evt) {
            //         console.log("read success");
            //         console.log(evt.target.result);

            //         //Test Code
            //         Meteor.call('camFindCall', evt.target.result, function(error, result) {
            //           console.log(error);
            //           console.log(result);
            //         });
            //       };
            //       reader.readAsBinaryString(file);

            //     })

            //   }, function(errorMessage)
            //   {
            //     console.log(errorMessage);
            //   });

            //template.imageData.set(imageData);



            return false;
          }

          function onFail2(message) {
            IonPopup.alert({
              title: 'Camera Operation',
              template: message,
              okText: 'Got It.'
            });
          }
        }
        return true;
      }
    });
  }
  else
  {
    console.log('file upload click');
    $('#myFile3').click();
  }
}
