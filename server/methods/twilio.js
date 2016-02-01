Meteor.methods({

  // TWILIO  -------------------------------------------------------------------
  twilioVerification: function() {
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

    var _user = Meteor.user();
    var _number = _user.private.mobile;

    if(!_number) {
      throw new Meteor.Error("no_number", "Add your number in the profile section to receive phone calls. Note: Your number will never be shared to other users.");
      return false;
    }

    _number = _number.replace(/\D/g,'');

    console.log(_number);

    var response = Async.runSync(function(done) {
      var result = HTTP.call("POST", twilioUrl+'OutgoingCallerIds.json', {
        "params": {
          "PhoneNumber" : "+"+_number
        },
        "auth" : twilioAuth
      },function(error, result){
        //phone already verified
        done(error, result);
      });
    });

    return response.result;
  },


  callTwilio: function(from, to) {
    console.log('Twilio >>>>> callTwilio called -x-x-x-x-x-x-x-x-x-');
    console.log('###################################');

    if(!from || !to) {
      throw new Meteor.Error("callTwilio", "missing numbers");
    }

    var userFrom = Users.findOne(from);
    var userTo = Users.findOne(to);

    var _to = userTo.private.mobile.replace(/\D/g,'');
    var _from = userFrom.private.mobile.replace(/\D/g,'');

    console.log(_to, _from);
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

    console.log(twilioXml+_to);

    var response = Async.runSync(function(done) {
      var result = HTTP.post(twilioUrl+'Calls.json', {
        "params": {
          "Url" : twilioXml+_to,
          "To" : '+'+_from,
          "From" : '+19192630795'
        },
        "auth" : twilioAuth
      },function(error, result){
        done(error, result);
      });
    });

    console.log('>>>>> response call twitio', response);

    return response.result;
  },
})
