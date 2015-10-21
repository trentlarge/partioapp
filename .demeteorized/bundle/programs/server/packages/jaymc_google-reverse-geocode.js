(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;

/* Package-scope variables */
var reverseGeocode;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/jaymc_google-reverse-geocode/packages/jaymc_google-reverse-geocode.js         //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
(function () {                                                                            // 1
                                                                                          // 2
//////////////////////////////////////////////////////////////////////////////////////    // 3
//                                                                                  //    // 4
// packages/jaymc:google-reverse-geocode/google-reverse-geocode.js                  //    // 5
//                                                                                  //    // 6
//////////////////////////////////////////////////////////////////////////////////////    // 7
                                                                                    //    // 8
reverseGeocode = {                                                                  // 1  // 9
	getLocation: function(lat, lng, callback){                                         // 2  // 10
		var self = this;                                                                  // 3  // 11
		var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng; // 4  // 12
		HTTP.call('GET', url, {timeout: 5000}, function(err, result){                     // 5  // 13
                                                                                    // 6  // 14
			if(err){                                                                         // 7  // 15
				callback(err);                                                                  // 8  // 16
			}                                                                                // 9  // 17
                                                                                    // 10
			if(result.statusCode === 200){                                                   // 11
				self.data = JSON.parse(result.content);                                         // 12
				callback(self.data);                                                            // 13
			}                                                                                // 14
                                                                                    // 15
		});                                                                               // 16
		                                                                                  // 17
                                                                                    // 18
	},                                                                                 // 19
	data: {                                                                            // 20
                                                                                    // 21
	},                                                                                 // 22
	getAddrObj: function(){                                                            // 23
		return this.data.results[0].address_components.map(function(comp){                // 24
			// console.log(comp.types[0])                                                    // 25
			return {                                                                         // 26
				'longName': comp.long_name,                                                     // 27
				'shortName': comp.short_name,                                                   // 28
				'type': comp.types[0]                                                           // 29
			}                                                                                // 30
		})                                                                                // 31
	},                                                                                 // 32
	getAddrStr: function(){                                                            // 33
		return this.data.results[0].formatted_address;                                    // 34
	}                                                                                  // 35
                                                                                    // 36
};                                                                                  // 37
//////////////////////////////////////////////////////////////////////////////////////    // 46
                                                                                          // 47
}).call(this);                                                                            // 48
                                                                                          // 49
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jaymc:google-reverse-geocode'] = {};

})();

//# sourceMappingURL=jaymc_google-reverse-geocode.js.map
