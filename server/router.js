Router.route('/twilio/:_number', {
	name : 'twilio',
	where: 'server',
	action: function() {
		var xmlData = "<Response>";
		xmlData += "<Say voice=\"alice\">Let’s Partio</Say>";
		xmlData += "<Dial record=\"true\">+"+this.params._number.trim()+"</Dial>";
		xmlData += "</Response>";
	    this.response.writeHead(200, {'Content-Type': 'application/xml'});
	    this.response.end(xmlData);
	}
});

Router.route('/twilio/my_twiml:number', {
	//where: 'server',
	action: function() {
		var xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		xmlData += "<Response>";
		xmlData += "<Dial record=\"true\" >"+this.param.number+"</Dial>";
		xmlData += "</Response>";

		this.response.writeHead(200, {'Content-Type': 'application/xml'});
		this.response.end(xmlData);
	}
});
