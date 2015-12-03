Products.join(Meteor.users, "ownerId", "ownerData", ['profile.name', 'profile.avatar','profile.mobile']);
Connections.join(Meteor.users, "requestor", "requestorData", ['profile.name', 'profile.avatar', 'profile.transactionsId', 'profile.mobile']);
