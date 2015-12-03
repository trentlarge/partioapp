Meteor.methods({
	"markAllNotificationsRead": function() {
		Notifications.update({ toId: Meteor.userId(), read: false }, { $set: { read: true } }, { multi: true });
	}
});
