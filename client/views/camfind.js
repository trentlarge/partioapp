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

// var camFindHelper = {
//   callApi : function(imageData){
//     console.log('camFindHelper >>>>>>>>>>>>>>>>>>> callAPI');
//     console.log(imageData);
//
//

    // Meteor.call('camFindCall', imageData, function(error, result) {
    //   console.log(error);
    //   console.log(result);
    // });
//   }
// }



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

          navigator.camera.getPicture(onSuccess1, onFail1, {
            targetWidth: 200,
            targetHeight: 200,
            quality: 50,
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL,
          });


      		function onSuccess1(imageData) {
      			console.log('capture done as base64');

      			var imageBlob = b64toBlob("data:image/jpeg;base64," + imageData);
      			console.log(imageBlob);

      			var uploader = new Slingshot.Upload("myFileUploads");
      			uploader.send(imageBlob, function (error, downloadUrl) {
      				if (error) {
      					console.error('Error uploading', uploader.xhr.response);
      					alert (error);
      				}
      				else {
      					console.log(downloadUrl);
      					initiateCamfind(downloadUrl, function(response) {
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

        // PHOTO LIBRARY --------------------
        if (index === 1) {


          var imageBlob = b64toBlob("data:image/jpeg;base64," + imageData);
          console.log(imageBlob);

          var uploader = new Slingshot.Upload("myFileUploads");
          uploader.send(imageBlob, function (error, downloadUrl) {
          	if (error) {
          		console.error('Error uploading', uploader.xhr.response);
          		alert (error);
          	}
          	else {
          		console.log(downloadUrl);
          		initiateCamfind(downloadUrl, function(response) {
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
         return true;
      }
     //}
    });
  //}
  // else
  // {
  //   console.log('file upload click');
  //   $('#myFile3').click();
  // }
}
