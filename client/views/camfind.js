Template.camfind.events({
  'click #cam-find': function(event, template) {
      testCamFindMethod();
  }
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


      Meteor.setInterval(function(){
        Meteor.call('camfindResponse', result.data.token, function(error, result){
          console.log('entrou aquiiii');
            console.log(result);
            console.log('-x-x-x-x-x-x-x-x-x-x-x-xx-')
        });
        console.log('interval <><><><>')
      }, 6000);




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
              Meteor.call('base64tos3', data, function(error, result){
                console.log(result);
                console.log('please');

                initiateCamfind(result, function(response) {
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
