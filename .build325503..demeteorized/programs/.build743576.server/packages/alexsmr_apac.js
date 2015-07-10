(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var apac;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/alexsmr:apac/server/lib/meteor-apac.js                   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
apac=Npm.require("apac");                                            // 1
                                                                     // 2
function makeSyncMethod(method){                                     // 3
	var wrapped=Meteor.wrapAsync(method);                               // 4
	var syncMethod=function(){                                          // 5
		return wrapped.apply(this,arguments);                              // 6
	};                                                                  // 7
	return syncMethod;                                                  // 8
}                                                                    // 9
                                                                     // 10
_.extend(apac.OperationHelper.prototype, {                           // 11
	executeSync: makeSyncMethod(apac.OperationHelper.prototype.execute) // 12
});                                                                  // 13
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['alexsmr:apac'] = {
  apac: apac
};

})();

//# sourceMappingURL=alexsmr_apac.js.map
