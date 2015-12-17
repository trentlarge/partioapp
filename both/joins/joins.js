Products.join(Meteor.users, "ownerId", "ownerData", ['profile.name', 'profile.avatar']);
Connections.join(Meteor.users, "requestor", "requestorData", ['profile.name', 'profile.avatar']);

Talk.join(Meteor.users, "fromId", "fromUser", ["profile.name", "profile.avatar"]);
Talk.join(Meteor.users, "toId", "toUser", ["profile.name", "profile.avatar"]);
