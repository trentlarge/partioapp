// ServiceConfiguration.loginServiceConfiguration.remove({
//     service: "facebook"
// });

Kadira.connect('T8vDhvWs9tGdLrd7L', '540cb7e0-b701-4538-a043-444fd8065065');

Meteor.startup(function() {
  // process.env.MAIL_URL="smtp://partio@cloudservice.io:partio1234@smtp.zoho.com:465";
  // Accounts.emailTemplates.from = 'partio@cloudservice.io';
  //Stripe = StripeSync(Meteor.settings.env.STRIPE_SECRET);
  //Stripe.secretKey = Meteor.settings.env.STRIPE_SECRET+':null';

  // Accounts.loginServiceConfiguration.remove({
  //   service: "facebook"
  // });

  // var settingsObject = Meteor.settings.oauth.facebook;
  //     settingsObject.service = "facebook";
  // add new configuration
  //Accounts.loginServiceConfiguration.insert(settingsObject);


  Stripe = StripeAPI(Meteor.settings.env.STRIPE_SECRET);

  process.env.MAIL_URL="smtp://support%40partioapp.com:partio123@smtp.zoho.com:465/";
  Accounts.emailTemplates.from = 'support@partioapp.com';
  Accounts.emailTemplates.siteName = 'partiO';

  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Welcome to partiO!';
  };

  Accounts.emailTemplates.verifyEmail.html = function(user, url) {
    console.log('new user activation url '+url);
    var body =
    '<!DOCTYPE html>\
            <html>\
                <head>\
                    <title>Partio</title>\
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
                    <style>\
                    a {\
                        color:#95cbab;\
                    }\
                    </style>\
                </head>\
                <body>\
                    <table width="750" bgcolor="#f6f6f6">\
                        <tr height="373">\
                            <td><img src="http://cloudservice.io/partio/template_cabecalho.jpg" /></td>\
                        </tr>\
                        <tr>\
                            <td>\
                                <div style="width:640px;font-family:arial; tex-align:left; margin-left:50px;color:#999">\
                                    <h1 style="color:#263238;font-size:40px">Hello there!</h1>\
                                    <p style="font-size:20px;line-height:38px;">Welcome aboard partiO!<br />\
                                    The things you own end up making money for you! Sounds familiar? Er..nevermind! To make this happen, it all starts with one link.<br />\
                                    The one below. <a href="'+url+'">Click here</a> to verify and get sharing.</p>\
                                    <p style="font-size:20px;line-height:38px;">For any queries or support, feel free to contact <a href="mailto:support@partioapp.com">support@partioapp.com</a></p>\
                                    <p style="font-size:20px;line-height:38px;">partiO team</p>\
                                </div>\
                            </td>\
                        </tr>\
                        <tr height="262">\
                            <td><img src="http://cloudservice.io/partio/template_rodape.jpg" /></td>\
                        </tr>\
                    </table>\
                </body>\
            </html>';
    return body;
  };

  Accounts.emailTemplates.resetPassword.html = function(user, url) {
    var body =
    '<!DOCTYPE html>\
            <html>\
                <head>\
                    <title>Partio</title>\
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
                    <style>\
                    a {\
                        color:#95cbab;\
                    }\
                    </style>\
                </head>\
                <body>\
                    <table width="750" bgcolor="#f6f6f6">\
                        <tr height="373">\
                            <td><img src="http://cloudservice.io/partio/template_cabecalho.jpg" /></td>\
                        </tr>\
                        <tr>\
                            <td>\
                                <div style="width:640px;font-family:arial; tex-align:left; margin-left:50px;color:#999">\
                                    <h1 style="color:#263238;font-size:40px">Hello!</h1>\
                                    <p style="font-size:20px;line-height:38px;">\
                                    To reset your password, simply <a href="'+url+'">Click here</a>.\
                                     <br />Thanks.<br />\
                                    partiO team\
                                    </p>\
                                </div>\
                            </td>\
                        </tr>\
                        <tr height="262">\
                            <td><img src="http://cloudservice.io/partio/template_rodape.jpg" /></td>\
                        </tr>\
                    </table>\
                </body>\
            </html>';
    return body;
  };
});
