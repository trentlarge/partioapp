Meteor.startup(function() {

    Router.route('/claim-opened', function(req) {

        var event = req.body.data;
        var connection = Connections.findOne({ 'policy.id': event.policy.id });

        if(connection) {
            var message = 'A claim was filed for ' + connection.policy.product.name;

            sendPush(connection.owner, message);
            sendNotification(connection.owner, connection.requestor, message, "info", connection._id);

            this.response.statusCode = 200;
            this.response.end()
        }
        else {
            this.response.statusCode = 200;
            this.response.end()
        }
        
    }, { where: "server" });

});
