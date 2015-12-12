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

      var currentUser = Meteor.user();

      // USER NOT CONFIGURED PHONE NUMBER
      if(!currentUser || !currentUser.profile || !currentUser.profile.mobile) {
        IonPopup.show({
          title: 'Ops...',
          template: '<div class="center dark">Your phone isn\'t configured yet. Please update your phone number.</div>',
          buttons:
          [{
            text: 'OK',
            type: 'button-energized',
            onTap: function() {
              IonPopup.close();
              Router.go('/profile');
            }
          }]
        });

        return false;
      }

      var _from = currentUser.profile.mobile;
      var _to = false;

      //calling connect owner
      if(currentUser._id == requestor){
        var _to = connection.productData.ownerData.profile.mobile;

      //calling connect requestor
      } else if(currentUser._id == owner) {
        var _to = connection.requestorData.profile.mobile;
      }

      console.log(_from, _to)

      // DESTINATION NOT CONFIGURED HIM PHONE NUMMBER
      if(!_to || _to.trim() == '') {
        IonPopup.show({
          title: 'Ops...',
          template: '<div class="center dark">Sorry. The another part isn\'t configured him phone number yet. Please try chat. Thank you.</div>',
          buttons:
          [{
            text: 'OK',
            type: 'button-energized',
            onTap: function() {
              IonPopup.close();
            }
          }]
        });

        return false;
      }

      PartioLoad.show();

  		//CHECK NUMBER ON TWILIO API
  		Meteor.call('twilioVerification', _from, function(error, result) {

  			// IF GET SOME ERROR FROM TWILIO
  			if(error) {
  				console.log('>>>> twilio error');
  				console.log(error);
  				PartioLoad.hide();

  				IonPopup.show({
  					title: 'Ops...',
  					template: '<div class="center dark">Sorry, the service is unavailable at this moment. Please try again later. Thank you. ;)</div>',
  					buttons:
  					[{
  						text: 'OK',
  						type: 'button-energized',
  						onTap: function() {
  							IonPopup.close();
  						}
  					}]
  				});

  				return false;
  			}

  			// TWILIO IS WORKING
  			if(result){

  				//REGISTERING FIRST TIME
  				if(result.statusCode == 200) {
            PartioLoad.hide();

  					console.log('Twilio >>>>>>> registering phone')

  					IonPopup.show({
  						title: 'Phone activation',
  						template: '<div class="center dark">Please, answer call and digit your activation number: "'+result.data.validation_code+'". Press OK when done. Thank you.</div>',
  						buttons:
  						[{
  							text: 'OK',
  							type: 'button-energized',
  							onTap: function() {
                  IonPopup.close();
                  PartioLoad.show();
                  PartioCall.makeCall(_from, _to);
  							}
  						}]
  					});

  				//ALREADY REGISTRED
  				} else if(result.statusCode == 400) {
  					console.log('Twilio >>>>>>> phone already registered')
            PartioCall.makeCall(_from, _to);
  				}
  			}
  		});
    },

    makeCall: function(_from, _to) {
      Meteor.call('callTwilio', { from: _from, to: _to }, function(error, result){
        console.log('Twilio >>>> call callTwilio method >>>');
        console.log(error); console.log(result);

        PartioLoad.hide();

        if(!error) {

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
        } else {
          IonPopup.show({
            title: 'Ops...',
            template: '<div class="center dark">Service API .</div>',
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
    }
  };
  return PartioCall;
})

PartioCall = new app.model.PartioCall();
