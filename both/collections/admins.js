Admins = new Meteor.Collection('admins');

Admins.userCanInsert = function(userId, doc) {
	return true;
};

Admins.userCanUpdate = function(userId, doc, fieldNames, modifier) {
	return true;
};

Admins.userCanRemove = function(userId, doc) {
	return true;
};

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Admins.find().count() === 0) {
          var admins = [
            {
                'email': 'talles.souza@duke.edu',
                'admin': true,
                'permissions': {
                    'view': true,
                    'update': true,
                    'delete': true
                }
            },
            {
                'email': 'talles@gmail.com',
                'admin': true,
                'permissions': {
                    'view': true,
                    'update': true,
                    'delete': true
                }
            },
            {
                'email': 'trentonlarge@gmail.com',
                'admin': true,
                'permissions': {
                    'view': true,
                    'update': true,
                    'delete': true
                }
            },
            {
                'email': 'trenton.large@duke.edu',
                'admin': true,
                'permissions': {
                    'view': true,
                    'update': true,
                    'delete': true
                }
            },
            {
                'email': 'lucasbr.dafonseca@gmail.com',
                'admin': true,
                'permissions': {
                    'view': true,
                    'update': true,
                    'delete': true
                }
            },
            {
                'email': 'flashblade123@gmail.com',
                'admin': true,
                'permissions': {
                    'view': true,
                    'update': true,
                    'delete': true
                }
            },
            {
                'email': 'petar.korponaic@gmail.com',
                'admin': true,
                'permissions': {
                    'view': true,
                    'update': true,
                    'delete': true
                }
            },
            {
                'email': 'korponaic@gmail.com',
                'admin': true,
                'permissions': {
                    'view': true,
                    'update': true,
                    'delete': true
                }
            },
            {
                'email': 'claytonmarinho@gmail.com',
                'admin': true,
                'permissions': {
                    'view': true,
                    'update': true,
                    'delete': true
                }
            },
            {
                'email': 'breno.wd@gmail.com',
                'admin': true,
                'permissions': {
                    'view': true,
                    'update': true,
                    'delete': true
                }
            }
          ];

          for (var i = 0; i < admins.length; i++) {
              Admins.insert(admins[i]);
          }
    }  
  });
}