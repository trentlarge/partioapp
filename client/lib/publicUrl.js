publicUrl = function(file) {
if (Meteor.isCordova) {

  return CordovaFileServer.httpUrl+'/'+file;
} else {
  return Meteor.absoluteUrl(file);
}

};
