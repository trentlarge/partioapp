Meteor.methods({
  removeConnection: function(idConnection) {
    console.log('removing connection '+idConnection)
    Connections.remove({_id: idConnection});
  }
});
