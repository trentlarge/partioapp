Meteor.methods({

    // CAMFIND -------------------------------------------------------------------
    // camfindGetToken: function(imageUrl){
    //   return HTTP.post('https://camfind.p.mashape.com/image_requests', {
    //     "headers": {
    //       "X-Mashape-Key" : "7W5OJWzlcsmshYSMTJW8yE4L2mJQp1cuOVKjsneO6N0wPTpaS1"
    //     },
    //     "params": {
    //       "image_request[remote_image_url]" : imageUrl,
    //       "image_request[locale]" : "en_US"
    //     }
    //   });
    // },

    camfindGetTokenBase64: function(dataURI) {
        var cloudSightApiURL = "http://api.cloudsightapi.com/";
        var cloudSightApiKey = (Meteor.settings.env.cloudSightKey) ? Meteor.settings.env.cloudSightKey : false;

        if(!cloudSightApiKey) {
            throw new Meteor.Error("cloudSightKey not configured. Check settings.json");
            console.log('cloudSightKey not configured. Check settings.json');
            return false;
        }

        // var mashapeURL = "https://camfind.p.mashape.com/image_requests";
        // var mashapeKey = "7W5OJWzlcsmshYSMTJW8yE4L2mJQp1cuOVKjsneO6N0wPTpaS1";

        // base64 encoded data to Buffer conversion
        var atob = Meteor.npmRequire('atob');
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var tmp = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            tmp[i] = byteString.charCodeAt(i);
        }
        var buffer = new Buffer(arrayBuffer.byteLength);
        var view = new Uint8Array(arrayBuffer);
        for (var i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }

        // HTTP request payload
        var formData = {
            // Pass a simple key-value pair
            "image_request[locale]": "en_US",
            "image_request[image]": {
                value: buffer,
                options: {
                    filename: "image-" + Math.random().toString().substr(2) + ".jpg",
                    contentType: mimeString
                }
            }
        };

        // HTTP request
        var request = Meteor.npmRequire("request");
        var response = Async.runSync(function(done) {
            request.post({
                url: cloudSightApiURL+'image_requests',
                //headers: { "X-Mashape-Key": cloudSightApiKey },
                headers: { "Authorization": "CloudSight "+cloudSightApiKey },
                formData: formData
            }, function(err, httpResponse, body) {
                var result = {
                    data: JSON.parse(body),
                    statusCode: httpResponse.statusCode
                };

                done(err, result);
            });
        });
        return response.result;
    },

    camfindGetResponse: function(token) {
        var cloudSightApiURL = "http://api.cloudsightapi.com/";
        var cloudSightApiKey = (Meteor.settings.env.cloudSightKey) ? Meteor.settings.env.cloudSightKey : false;

        if(!cloudSightApiKey) {
            throw new Meteor.Error("cloudSightKey not configured. Check settings.json");
            console.log('cloudSightKey not configured. Check settings.json');
            return false;
        }

        console.log('CamFind: request token >>> '+token);
        console.log('CamFind: waiting API status...');

        var response = Async.runSync(function(done) {
            var interval = Meteor.setInterval(function(){
                HTTP.get(cloudSightApiURL+'image_responses/'+token, {
                    "headers": {
                        "Authorization" : "CloudSight "+cloudSightApiKey
                    }
                }, function(error, result){
                    console.log('CamFind: ping Camfind >>> result.data.status = '+result.data.status);

                    if(error){
                        Meteor.clearInterval(interval);
                        done(error, null);
                    }

                    if(result.data.status == 'completed' || result.data.status == 'skipped'){
                        console.log('CamFind: status '+result.data.status+' *-*-*-*-*-*-*-*');
                        Meteor.clearInterval(interval);
                        done(null, result);
                    }
                })
            }, 1000);
        });

        return response.result;
    },
});
