(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var apac;

(function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/alexsmr_apac/packages/alexsmr_apac.js                          //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
(function () {                                                             // 1
                                                                           // 2
///////////////////////////////////////////////////////////////////////    // 3
//                                                                   //    // 4
// packages/alexsmr:apac/server/lib/meteor-apac.js                   //    // 5
//                                                                   //    // 6
///////////////////////////////////////////////////////////////////////    // 7
                                                                     //    // 8
apac=Npm.require("apac");                                            // 1  // 9
                                                                     // 2  // 10
function makeSyncMethod(method){                                     // 3  // 11
	var wrapped=Meteor.wrapAsync(method);                               // 4  // 12
	var syncMethod=function(){                                          // 5  // 13
		return wrapped.apply(this,arguments);                              // 6  // 14
	};                                                                  // 7  // 15
	return syncMethod;                                                  // 8  // 16
}                                                                    // 9  // 17
                                                                     // 10
_.extend(apac.OperationHelper.prototype, {                           // 11
	executeSync: makeSyncMethod(apac.OperationHelper.prototype.execute) // 12
});                                                                  // 13
///////////////////////////////////////////////////////////////////////    // 22
                                                                           // 23
}).call(this);                                                             // 24
                                                                           // 25
/////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['alexsmr:apac'] = {
  apac: apac
};

})();

//# sourceMappingURL=alexsmr_apac.js.map
