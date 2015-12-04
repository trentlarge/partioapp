Meteor.methods({
	"markAllNotificationsRead": function() {
		Notifications.update({ toId: this.userId, read: false }, { $set: { read: true } }, { multi: true });
	},
	"markNotificationRead": function(notificationId) {
		Notifications.update({ _id: notificationId, toId: this.userId }, { $set: { read: true } });
	}
});
