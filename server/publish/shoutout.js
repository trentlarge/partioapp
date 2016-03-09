Meteor.publish("shoutout", function(user, limit) {

    var shouts = ShoutOut.find({}, { limit: limit, sort: {createdAt: -1} }).fetch(),
        usersId = [];
        
    for(var i = 0, shoutsLenght = shouts.length; i < shoutsLenght; i++) {
        usersId.push(shouts[i].userId);
    }
    
    var userArea = user.profile.area,
        users = Users.find({ _id: { $in: usersId }}, { fields: { profile: 1 }}).fetch();
    
    usersId = [];

    for(var i = 0, usersLength = users.length; i < usersLength; i++) {
        if(userArea === users[i].profile.area) {
            usersId.push(users[i]._id);
        }
    }
    
    return [
        Users.find({ _id: { $in: usersId }}, { fields: { profile: 1 }}),
        ShoutOut.find({ userId: { $in: usersId }}, { limit: limit, sort: {createdAt: -1} })
    ]
    
	//return ShoutOut.find({}, { limit: limit, sort: {createdAt: -1} });
});

Meteor.publish("myShoutout", function(userId, limit) {
	return ShoutOut.find({ 'userId': userId }, { limit: limit, sort: { createdAt: -1 }});
});

Meteor.publish("shoutoutDetails", function(shoutId) {
	return ShoutOut.find({ _id: shoutId });
});