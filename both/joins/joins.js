Products.join(Meteor.users, "ownerId", "ownerData", ['profile.name', 'profile.avatar']);
Connections.join(Meteor.users, "requestor", "requestorData", ['profile.name', 'profile.avatar', 'profile.stripeAccount.id', 'profile.transactionsId','profile.payoutCard.id']);
