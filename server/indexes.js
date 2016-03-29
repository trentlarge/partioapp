Meteor.startup(function() {
  Notifications._ensureIndex({ timestamp: -1 });
  Notifications._ensureIndex({ "toId": 1,  });
  //Notifications._ensureIndex({ "fromId": 1 });

  Connections._ensureIndex({ "owner": 1 });
  Connections._ensureIndex({ "requestor": 1 });

  Transactions._ensureIndex({ "userId": 1 });

  Talk._ensureIndex({ "fromId": 1 });
  Talk._ensureIndex({ "toId": 1 });

  Products._ensureIndex({ "ownerId": 1 });
  //Products._ensureIndex({ "ownerArea": 1 });

  Users._ensureIndex({ "private.promotions.friendShare.parent": 1 });
});
