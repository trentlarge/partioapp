Meteor.methods({
	markAllNotificationsRead: function() {
		Notifications.update({ toId: this.userId, read: false }, { $set: { read: true } }, { multi: true });
	},
	markNotificationRead: function(notificationId) {
		Notifications.update({ _id: notificationId, toId: this.userId }, { $set: { read: true } });
	}
});

sendNotification = function(toId, fromId, message, type, connectionId) {
  connectionId = connectionId || null;

  // do we already have the same, unread notification?
  var oldNotification = Notifications.findOne({
    fromId: fromId,
    toId: toId,
    connectionId: connectionId,
    type: type
  });

  if(oldNotification) {
    // the same notification already exist, update it
    Notifications.remove({ _id: oldNotification._id });
  }

  // this is new notification
  Notifications.insert({
    toId: toId,
    fromId: fromId,
    connectionId: connectionId,
    message: message,
    read: false,
    timestamp: new Date(),
    type: type
  });
}
