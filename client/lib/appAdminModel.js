app = app || {};

app.model.Admin = (function () {
   'use strict';

   var Admin = function() {
   
       this.permitedUsers;
       
   };

   Admin = {

        //initialize vars
        init : function() {
            
            /*
                PERMISSIONS:
                    'v': view,
                    'u': update,
                    'd': delete
            */
            
            this.permitedUsers = {
                "talles.souza@duke.edu": ['v', 'u', 'd'],
                "talles@gmail.com": ['v', 'u', 'd'],
                "trentonlarge@gmail.com": ['v', 'u', 'd'],
                "trenton.large@duke.edu": ['v', 'u', 'd'],
                "petar.korponaic@gmail.com": ['v', 'u', 'd'],
                "korponaic@gmail.com": ['v', 'u', 'd'],
                "claytonmarinho@gmail.com": ['v', 'u', 'd'],
                "breno.wd@gmail.com": ['v', 'u', 'd'],
                "lucasbr.dafonseca@gmail.com": ['v', 'u', 'd'],
                "flashblade123@gmail.com": ['v', 'u', 'd'],
                "cw249@duke.edu": ['v'],
                "whitney.hazard@duke.edu": ['v'],
                "michael.x.li@duke.edu": ['v'],
                "mxl3@duke.edu": ['v']
            };
            
        },
       
        getPermitedUsers: function() {
            
            var permitedUsers = [];
            $.each(this.permitedUsers, function(index, permitedUser) {
                permitedUsers.push(index);
            });
            
            return permitedUsers;
        }

   };

   return Admin;
});

Admin = new app.model.Admin();
Admin.init();
