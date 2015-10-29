Template.camfind.events({
  'click #cam-find': function(event, template) {
      callCamFind();
  },

  'click #manualSubmitCamFind': function(e, template) {
    IonLoading.show();

    //get keywords
    var keys = template.find('#manualInputCamFind').value;

    console.log(keys);
    console.log('0x0x0x0x0x0x0x0x');

    Meteor.call('AllItemsFromAmazon', keys, function(error, result) {
      console.log(result);

      if (result && !error) {
          Session.set('allResults', result);
          Session.set('lendTab', 'resultsCamFind');
          IonLoading.hide();
      } else {
          IonLoading.hide();
          IonPopup.show({
            title: 'Please try again :( ',
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
      }
    });
  },
});

Template.camfind.helpers({
  imageurl: function(){
    return Session.get('camfindphoto');
  }
})

var initiateCamfind = function(url, callback) {
  Meteor.call('camfindCall', url, function(error, result) {
    if (!error) {
      console.log("----got some data from server Camfind----");
      console.log(result)

      // if (result.status == "completed") {
      //   IonLoading.hide();
      //   //callback(result.name);
      //   console.log(result.name);
      //   return result.name;
      // } else {
      //
      //   console.log('nao completadooooooooooooooo aindaaaa');
      //   console.log(result)
      //
      //   initiateCamfind(result);
      // }
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



function callCamFind()
{
  // if (Meteor.isCordova)
  // {

    IonLoading.show();
    
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
              Meteor.call('base64tos3', data, function(error, result){
                console.log(result);
                console.log('please');

                initiateCamfind(result, function(response) {
                  console.log('etapa final ==========');
                  console.log(response);

                  console.log('respoosta initiatecamfind:  '+response);
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
              })
            }
          });
        }


      // PHOTO LIBRARY --------------------
        // if (index === 1) {
        //
        //   var options = {
        //     width: 1024,
        //     height: 768,
        //     quality: 75,
        //     sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        //   }
        //
        //   MeteorCamera.getPicture(options, function(err, data) {
        //     if (data) {
        //       Meteor.call('base64tos3', data, function(result){
        //         console.log('calbackkkkkkkkkk')
        //         Session.set('camfindphoto', result);
        //       });
        //
        //       if(Session.get('camfindphoto')){
        //         initiateCamfind(function(response) {
        //           console.log('respoosta initiatecamfind:  '+response);
        //           IonPopup.show({
        //             title: response,
        //               template: '',
        //               buttons:
        //               [{
        //                 text: 'OK',
        //                 type: 'button-assertive',
        //                 onTap: function() {
        //                   IonPopup.close();
        //                 }
        //               }]
        //             });
        //         })
        //       }
        //       }
        //   });
        // }
      return true;
     }
  });
}
