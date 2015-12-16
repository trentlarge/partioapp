/*
PARTIOCALL TWILIO API
*/
app = app || {};

app.model.PartioCall = (function () {
  'use strict';

  var PartioCall = {
    init: function(connection) {
      console.log(connection);

      var requestor = connection.requestor;
      var owner = connection.owner;

      if(!requestor || !owner) {
        console.log('Expecting requestor and owner IDS'); return false;
      }

      PartioLoad.show();

  		//CHECK NUMBER ON TWILIO API
  		Meteor.call('twilioVerification', function(error, result) {
  			if(error) {
          if(error.error == 'no_number') {
            PartioLoad.hide();

    				IonPopup.show({
    					title: 'Ops...',
    					template: '<div class="center dark">'+error.reason+'</div>',
    					buttons:
    					[{
    						text: 'OK',
    						type: 'button-energized',
    						onTap: function() {
    							IonPopup.close();
                  Router.go('/profile')
    						}
    					}]
    				});

    				return false;

          } else {
    				PartioLoad.hide();
            ShowNotificationMessage(error.reason)
    				return false;
          }
  			}

  			// TWILIO IS WORKING
  			if(result){
          //REGISTERING FIRST TIME
  				if(result.statusCode == 200) {
            PartioLoad.hide();

  					console.log('Twilio >>>>>>> registering phone')

  					IonPopup.show({
  						title: 'Phone activation',
  						template: '<div class="center dark">Please, answer call and digit your activation number: "'+result.data.validation_code+'". Press OK when done and try to call again. Thank you.</div>',
  						buttons:
  						[{
  							text: 'OK',
  							type: 'button-energized',
  							onTap: function() {
                  IonPopup.close();
                  //PartioLoad.show();
                  //PartioCall.makeCall(_from, _to);
  							}
  						}]
  					});

  				//ALREADY REGISTRED
  				} else if(result.statusCode == 400) {

            var currentUser = Meteor.user();

            var _from = currentUser._id;
            var _to = false;

            if(_from == requestor){
              var _to = owner;

            } else if(_from == owner) {
              var _to = requestor;
            }

  					console.log('Twilio >>>>>>> phone already registered')
            PartioLoad.show();
            PartioCall.makeCall(_from, _to);
  				}
  			}
  		});
    },

    makeCall: function(_from, _to) {
      Meteor.call('callTwilio', _from, _to, function(error, result){
        console.log('Twilio >>>> call callTwilio method >>>');

        PartioLoad.hide();

        if(error){
          ShowNotificationMessage(error.reason)
          console.log(error);
          return false;
        }

        if(result) {
          // NOT REGISTERED YET
          if(result.data.code == '21210') {
            IonPopup.show({
              title: 'Ops...',
              template: '<div class="center dark">You haven\'t verified your phone number yet.</div>',
              buttons:
              [{
                text: 'OK',
                type: 'button-energized',
                onTap: function() {
                  IonPopup.close();
                }
              }]
            });

          // INVALID NUMBER
          } else if(result.data.code == '21211') {
              ShowNotificationMessage(result.data.message);
              return false;

          // EVERYTHING NORMAL
          } else {
            IonPopup.show({
              title: 'Calling...',
              template: '<div class="center dark">Please, wait just few seconds and answer the phone call.</div>',
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
        }
      });
    }
  };
  return PartioCall;
})

PartioCall = new app.model.PartioCall();
