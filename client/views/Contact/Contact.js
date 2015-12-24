Template.appLayout.onRendered(function() {

    if(!Meteor.user()){

      //Router.go('/register')

    }

 });

Template.contact.events({
  'click #send-message': function() {
    var subject = $('#subject').val();
    var message = $('#message').val();


    if (subject != '' & message != '') {


      PartioLoad.show();


      Meteor.call('sendEmail',subject,message, function(err, res) {

        //console.log(err);

        if(err) {
            var errorMessage = err.reason || err.message;
            if(err.details) {
              errorMessage = errorMessage + "\nDetails:\n" + err.details;
            }
            sAlert.error(errorMessage);
            return;
        } else {

          PartioLoad.hide();
          IonPopup.alert({
            okText: 'Enter',
            title: 'Succesfully',
            template: '<div class="center">We received your message, Thank you :-)</div>',
            onOk: function() {

              $('#subject').val('');
              $('#message').val('');

            }
          });

        }

      });

    } else {
      IonPopup.alert({
        okText: 'Enter',
        title: 'Error',
        template: '<div class="center">You need to write something :-)</div>',
        onOk: function() {
          IonPopup.close();
          //$('#subject').focus();

        }
      });
    }
  }
});
