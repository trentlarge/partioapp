(function(){Meteor.startup(function() {
	Push.Configure({
	"apn": {
		"keyData": Assets.getText('PushChatKey.pem'),
		"certData": Assets.getText('PushChatCert.pem'),
		"passphrase": "partio2021"
	},
	"production": true,
	"sound": true,
	"badge": true,
	"alert": true,
	"vibrate": true
});
});
}).call(this);

//# sourceMappingURL=push.config.os.js.map
