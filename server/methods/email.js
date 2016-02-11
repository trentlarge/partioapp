sendEmail = function(from, to, subject, text) {
	from = from || "support@partioapp.com";
	Email.send({
		to: to,
		from: from,
		subject: subject,
		text: text
	});
};
