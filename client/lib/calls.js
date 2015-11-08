/*
 * This is the partio call manager.
 * Here we maintain a global object that will hold the SinchClient and receive
 * all events regarding incoming/outgoing calls and messages.
 *
 * If this blows up or causes death or destruction, contact Jimmy.
 */

PartioCaller = {
  call: function(userId, callbacks) {

    console.log('CALLS '+userId);

    if (userId == Meteor.userId()) throw new Error("You cannot call yourself!");
    this.currentCall = this.callClient.callUser(userId);

		this.currentCall.addEventListener(callbacks);
  },
  endCall: function() {
    this.currentCall.hangup();
  }
};

/*
 * Wire all of our calling goodness up to the Meteor framework so we have
 * an entry point.
*/

Meteor.startup(function() {

});

Tracker.autorun(function(){
  if(Meteor.userId()){
    console.log("[PartioCaller] Handling login sequence...");
    console.log("[PartioCaller] Starting Sinch Client...");
    PartioCaller.client = new SinchClient({
    	applicationKey: '8e10bb06-6bbb-4682-993d-c5e30a719882',
    	capabilities: {calling: true},
    	startActiveConnection: true, // This puts us ONLINE to receive calls/msgs
    	onLogMessage: function(message) {
    		console.log(message);
    	},
    });

    PartioCaller.callClient = PartioCaller.client.getCallClient();
    PartioCaller.callClient.initStream().then(function() { // Directly init streams, in order to force user to accept use of media sources at a time we choose
      console.log("[PartioCaller] Sinch call streams initialized.");
    });

    var callListeners = {
			onCallProgressing: function(call) {
				$('audio#ringback').prop("currentTime", 0);
				$('audio#ringback').trigger("play");
		    console.log("[PartioCaller] ringing...");
			},
			onCallEstablished: function(call) {
				$('audio#incoming').attr('src', call.incomingStreamURL);
				$('audio#ringback').trigger("pause");
				$('audio#ringtone').trigger("pause");

		    console.log("[PartioCaller] Call answered...");

				//Report call stats
				var callDetails = call.getDetails();
				console.log(callDetails);
			},
			onCallEnded: function(call) {
				$('audio#ringback').trigger("pause");
				$('audio#ringtone').trigger("pause");
				$('audio#incoming').attr('src', '');

				$("#btnCallUser").prop("disabled",false);

		    console.log(call);
		    console.log(call.getEndCause());

		    console.log("[PartioCaller] Call ended...");
				if(call.error || call.getEndCause() === "FAILURE") {
					console.error("[PartioCaller] Call error");
					console.error(call.error.message);

					IonPopup.show({
						title: 'Call Error',
						template: 	'<div class="center dark">'+call.error.message+'</div>',
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
		};

    PartioCaller.callClient.addEventListener({
      onIncomingCall: function(incomingCall) {
        //Disable outgoing calls...
        $("#btnCallUser").prop("disabled",true);

      	//Play some groovy tunes
      	$('audio#ringtone').prop("currentTime", 0);
      	$('audio#ringtone').trigger("play");

      	//Print statistics
      	$('div#callLog').append('<div id="title">Incoming call from ' + incomingCall.fromId + '</div>');
      	$('div#callLog').append('<div id="stats">Ringing...</div>');

      	//Manage the call object
        call = incomingCall;
        call.addEventListener(callListeners);

        var incomingCaller = Meteor.users.findOne({_id: incomingCall.fromId});
        if (!incomingCaller) incomingCaller = incomingCall.fromId;
        else incomingCaller = incomingCaller.profile.name;

        Session.set("_currentCaller", incomingCaller);

        var confirmPopup = IonPopup.confirm({
          cancelText: 'No',
          okText: 'Yes',
          title: 'Call from ' + incomingCaller,
          template: 'Do you wish to answer?',
          onCancel: function() {
            call.hangup();
    			},
    			onOk: function() {
            call.answer();
    				IonPopup.close();
    			}
        });
      }
    });


    Meteor.call("generateSinchTicket", function(err,res) {
      if (err) {
        console.error("[PartioCaller] Could not connect to partio voice network");
        console.error(err);
      } else {
        // We got our signed ticket, now log on
        PartioCaller.client.start(res).then(function() {
      		console.log("[PartioCaller] Online and ready for connections.");
      	}).fail(function(e) {
          console.error("[PartioCaller] An error occurred when calling SinchClient::start:");
          console.error(e);
        });
      }
    })
  }
});
