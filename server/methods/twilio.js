Meteor.methods({

  // TWILIO  -------------------------------------------------------------------
  twilioVerification: function(numberFrom) {
    console.log('Twilio >>>>> twilioVerification called -x-x-x-x-x-x-x-x-x-');

    var twilioAccount = (Meteor.settings.env.twilioAccount) ? Meteor.settings.env.twilioAccount : false;
    var twilioKey = (Meteor.settings.env.twilioKey) ? Meteor.settings.env.twilioKey : false;

    if(!twilioAccount || !twilioKey) {
      throw new Meteor.Error("twilio not configured. Check settings.json");
      console.log('twilio not configured. Check settings.json');
      return false;
    }

    var twilioAuth = twilioAccount+":"+twilioKey;
    var twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/"+twilioAccount+'/';

    var response = Async.runSync(function(done) {
      var result = HTTP.call("POST", twilioUrl+'OutgoingCallerIds.json', {
        "params": {
          "PhoneNumber" : numberFrom
        },
        "auth" : twilioAuth
      },function(error, result){
        console.log(error);
        console.log(result);
        done(error, result);
      });
    });

    return response.result;
  },


  callTwilio: function(numbers) {
    console.log('Twilio >>>>> callTwilio called -x-x-x-x-x-x-x-x-x-');
    console.log('###################################');
    console.log(numbers);
    console.log('###################################');

    var twilioAccount = (Meteor.settings.env.twilioAccount) ? Meteor.settings.env.twilioAccount : false;
    var twilioKey = (Meteor.settings.env.twilioKey) ? Meteor.settings.env.twilioKey : false;
    var twilioXml = (Meteor.settings.env.twilioXml) ? Meteor.settings.env.twilioXml : process.env.ROOT_URL+'twilio/';

    if(!twilioAccount || !twilioKey) {
      throw new Meteor.Error("twilio not configured. Check settings.json");
      console.log('twilio not configured. Check settings.json');
      return false;
    }

    var twilioAuth = twilioAccount+":"+twilioKey;
    var twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/"+twilioAccount+'/';

    var to = numbers.to.replace('+', '');

    var response = Async.runSync(function(done) {
      var result = HTTP.post(twilioUrl+'Calls.json', {
        "params": {
          "Url" : twilioXml+to,
          "To" : numbers.from,
          "From" : '+19192630795'
        },
        "auth" : twilioAuth
      },function(error, result){
        console.log(error);
        console.log(result);
        done(error, result);
      });
    });

    return response.result;
  },
})
