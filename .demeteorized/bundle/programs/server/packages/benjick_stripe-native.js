(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;

/* Package-scope variables */
var Stripe;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/benjick_stripe-native/packages/benjick_stripe-native.js                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
(function () {                                                                                                   // 1
                                                                                                                 // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 3
//                                                                                                         //    // 4
// packages/benjick:stripe-native/server/init.js                                                           //    // 5
//                                                                                                         //    // 6
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 7
                                                                                                           //    // 8
Stripe = {};                                                                                               // 1  // 9
                                                                                                           // 2  // 10
Stripe.secretKey = process.env.STRIPE_SECRET + ':null';                                                    // 3  // 11
Stripe.baseUrl = 'https://api.stripe.com/v1/';                                                             // 4  // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 13
                                                                                                                 // 14
}).call(this);                                                                                                   // 15
                                                                                                                 // 16
                                                                                                                 // 17
                                                                                                                 // 18
                                                                                                                 // 19
                                                                                                                 // 20
                                                                                                                 // 21
(function () {                                                                                                   // 22
                                                                                                                 // 23
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 24
//                                                                                                         //    // 25
// packages/benjick:stripe-native/server/methods/charges.js                                                //    // 26
//                                                                                                         //    // 27
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 28
                                                                                                           //    // 29
// https://stripe.com/docs/api/node#charges                                                                // 1  // 30
                                                                                                           // 2  // 31
Stripe.charges = {};                                                                                       // 3  // 32
                                                                                                           // 4  // 33
Stripe.charges.create = function(object) {                                                                 // 5  // 34
	var options = {                                                                                           // 6  // 35
		auth: Stripe.secretKey,                                                                                  // 7  // 36
		params: object                                                                                           // 8  // 37
	}                                                                                                         // 9  // 38
                                                                                                           // 10
	return HTTP.call('POST', Stripe.baseUrl + 'charges', options).data;                                       // 11
}                                                                                                          // 12
                                                                                                           // 13
Stripe.charges.retrieve = function(id) {                                                                   // 14
	var options = {                                                                                           // 15
		auth: Stripe.secretKey                                                                                   // 16
	}                                                                                                         // 17
                                                                                                           // 18
	return HTTP.call('GET', Stripe.baseUrl + 'charges/' + id, options).data;                                  // 19
}                                                                                                          // 20
                                                                                                           // 21
Stripe.charges.update = function(id, object) {                                                             // 22
	var options = {                                                                                           // 23
		auth: Stripe.secretKey,                                                                                  // 24
		params: object                                                                                           // 25
	}                                                                                                         // 26
                                                                                                           // 27
	return HTTP.call('POST', Stripe.baseUrl + 'charges/' + id, options).data;                                 // 28
}                                                                                                          // 29
                                                                                                           // 30
Stripe.charges.capture = function(id) {                                                                    // 31
	var options = {                                                                                           // 32
		auth: Stripe.secretKey                                                                                   // 33
	}                                                                                                         // 34
                                                                                                           // 35
	return HTTP.call('POST', Stripe.baseUrl + 'charges/' + id + '/capture', options).data;                    // 36
}                                                                                                          // 37
                                                                                                           // 38
Stripe.charges.list = function() {                                                                         // 39
	var options = {                                                                                           // 40
		auth: Stripe.secretKey                                                                                   // 41
	}                                                                                                         // 42
                                                                                                           // 43
	return HTTP.call('GET', Stripe.baseUrl + 'charges', options).data;                                        // 44
}                                                                                                          // 45
                                                                                                           // 46
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 76
                                                                                                                 // 77
}).call(this);                                                                                                   // 78
                                                                                                                 // 79
                                                                                                                 // 80
                                                                                                                 // 81
                                                                                                                 // 82
                                                                                                                 // 83
                                                                                                                 // 84
(function () {                                                                                                   // 85
                                                                                                                 // 86
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 87
//                                                                                                         //    // 88
// packages/benjick:stripe-native/server/methods/refunds.js                                                //    // 89
//                                                                                                         //    // 90
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 91
                                                                                                           //    // 92
Stripe.charges.createRefund = function(id, object) {                                                       // 1  // 93
	var object = object || null                                                                               // 2  // 94
	var options = {                                                                                           // 3  // 95
		auth: Stripe.secretKey,                                                                                  // 4  // 96
		params: object                                                                                           // 5  // 97
	}                                                                                                         // 6  // 98
                                                                                                           // 7  // 99
	return HTTP.call('POST', Stripe.baseUrl + 'charges/' + id + '/refunds', options).data;                    // 8  // 100
}                                                                                                          // 9  // 101
                                                                                                           // 10
Stripe.charges.retrieveRefund = function(id, charge) {                                                     // 11
	var options = {                                                                                           // 12
		auth: Stripe.secretKey                                                                                   // 13
	}                                                                                                         // 14
                                                                                                           // 15
	return HTTP.call('GET', Stripe.baseUrl + 'charges/' + id + '/refunds/' + charge, options).data;           // 16
}                                                                                                          // 17
                                                                                                           // 18
Stripe.charges.updateRefund = function(id, charge, object) {                                               // 19
	var options = {                                                                                           // 20
		auth: Stripe.secretKey,                                                                                  // 21
		params: object                                                                                           // 22
	}                                                                                                         // 23
                                                                                                           // 24
	return HTTP.call('POST', Stripe.baseUrl + 'charges/' + id + '/refunds/' + charge, options).data;          // 25
}                                                                                                          // 26
                                                                                                           // 27
Stripe.charges.listRefunds = function(id, object) {                                                        // 28
	var options = {                                                                                           // 29
		auth: Stripe.secretKey,                                                                                  // 30
		params: object                                                                                           // 31
	}                                                                                                         // 32
                                                                                                           // 33
	return HTTP.call('GET', Stripe.baseUrl + 'charges/' + id + '/refunds', options).data;                     // 34
}                                                                                                          // 35
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 128
                                                                                                                 // 129
}).call(this);                                                                                                   // 130
                                                                                                                 // 131
                                                                                                                 // 132
                                                                                                                 // 133
                                                                                                                 // 134
                                                                                                                 // 135
                                                                                                                 // 136
(function () {                                                                                                   // 137
                                                                                                                 // 138
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 139
//                                                                                                         //    // 140
// packages/benjick:stripe-native/server/methods/customers.js                                              //    // 141
//                                                                                                         //    // 142
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 143
                                                                                                           //    // 144
Stripe.customers = {};                                                                                     // 1  // 145
                                                                                                           // 2  // 146
Stripe.customers.create = function (object) {                                                              // 3  // 147
	var options = {                                                                                           // 4  // 148
		auth: Stripe.secretKey,                                                                                  // 5  // 149
		params: object                                                                                           // 6  // 150
	}                                                                                                         // 7  // 151
	                                                                                                          // 8  // 152
	return HTTP.call('POST', Stripe.baseUrl + 'customers', options).data;                                     // 9  // 153
}                                                                                                          // 10
                                                                                                           // 11
Stripe.customers.retrieve = function (id) {                                                                // 12
	var options = {                                                                                           // 13
		auth: Stripe.secretKey                                                                                   // 14
	}                                                                                                         // 15
                                                                                                           // 16
	return HTTP.call('GET', Stripe.baseUrl + 'customers/' + id, options).data;                                // 17
}                                                                                                          // 18
                                                                                                           // 19
Stripe.customers.update = function (id, object) {                                                          // 20
	var options = {                                                                                           // 21
		auth: Stripe.secretKey,                                                                                  // 22
		params: object                                                                                           // 23
	}                                                                                                         // 24
                                                                                                           // 25
	return HTTP.call('POST', Stripe.baseUrl + 'customers/' + id, options).data;                               // 26
                                                                                                           // 27
}                                                                                                          // 28
                                                                                                           // 29
Stripe.customers.del = function (id) {                                                                     // 30
	var options = {                                                                                           // 31
		auth: Stripe.secretKey                                                                                   // 32
	}                                                                                                         // 33
                                                                                                           // 34
	return HTTP.call('DELETE', Stripe.baseUrl + 'customers/' + id, options).data;                             // 35
                                                                                                           // 36
}                                                                                                          // 37
                                                                                                           // 38
Stripe.customers.list = function (object) {                                                                // 39
	var options = {                                                                                           // 40
		auth: Stripe.secretKey                                                                                   // 41
	}                                                                                                         // 42
                                                                                                           // 43
	return HTTP.call('GET', Stripe.baseUrl + 'customers', options).data;                                      // 44
                                                                                                           // 45
}                                                                                                          // 46
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 191
                                                                                                                 // 192
}).call(this);                                                                                                   // 193
                                                                                                                 // 194
                                                                                                                 // 195
                                                                                                                 // 196
                                                                                                                 // 197
                                                                                                                 // 198
                                                                                                                 // 199
(function () {                                                                                                   // 200
                                                                                                                 // 201
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 202
//                                                                                                         //    // 203
// packages/benjick:stripe-native/server/methods/cards.js                                                  //    // 204
//                                                                                                         //    // 205
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 206
                                                                                                           //    // 207
Stripe.customers.createSource = function(id, source) {                                                     // 1  // 208
	var options = {                                                                                           // 2  // 209
		auth: Stripe.secretKey,                                                                                  // 3  // 210
		params: {                                                                                                // 4  // 211
			source: source                                                                                          // 5  // 212
		}                                                                                                        // 6  // 213
	}                                                                                                         // 7  // 214
	                                                                                                          // 8  // 215
	return HTTP.call('POST', Stripe.baseUrl + 'customers/' + id + '/sources', options).data;                  // 9  // 216
}                                                                                                          // 10
                                                                                                           // 11
Stripe.customers.retrieveCard = function(id, cardId) {                                                     // 12
	var options = {                                                                                           // 13
		auth: Stripe.secretKey                                                                                   // 14
	}                                                                                                         // 15
	                                                                                                          // 16
	return HTTP.call('GET', Stripe.baseUrl + 'customers/' + id + '/cards/' + cardId, options).data;           // 17
}                                                                                                          // 18
                                                                                                           // 19
Stripe.customers.updateCard = function(id, cardId, object) {                                               // 20
	var options = {                                                                                           // 21
		auth: Stripe.secretKey,                                                                                  // 22
		params: object                                                                                           // 23
	}                                                                                                         // 24
	                                                                                                          // 25
	return HTTP.call('POST', Stripe.baseUrl + 'customers/' + id + '/sources/' + cardId, options).data;        // 26
}                                                                                                          // 27
                                                                                                           // 28
Stripe.customers.deleteCard = function(id, cardId) {                                                       // 29
	var options = {                                                                                           // 30
		auth: Stripe.secretKey                                                                                   // 31
	}                                                                                                         // 32
	                                                                                                          // 33
	return HTTP.call('DELETE', Stripe.baseUrl + 'customers/' + id + '/sources/' + cardId, options).data;      // 34
}                                                                                                          // 35
                                                                                                           // 36
Stripe.customers.listCards = function(id, object) {                                                        // 37
	var options = {                                                                                           // 38
		auth: Stripe.secretKey,                                                                                  // 39
		params: object                                                                                           // 40
	}                                                                                                         // 41
	                                                                                                          // 42
	return HTTP.call('GET', Stripe.baseUrl + 'customers/' + id + '/sources', options).data;                   // 43
}                                                                                                          // 44
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 252
                                                                                                                 // 253
}).call(this);                                                                                                   // 254
                                                                                                                 // 255
                                                                                                                 // 256
                                                                                                                 // 257
                                                                                                                 // 258
                                                                                                                 // 259
                                                                                                                 // 260
(function () {                                                                                                   // 261
                                                                                                                 // 262
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 263
//                                                                                                         //    // 264
// packages/benjick:stripe-native/server/methods/subscriptions.js                                          //    // 265
//                                                                                                         //    // 266
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 267
                                                                                                           //    // 268
Stripe.customers.createSubscription = function(id, object) {                                               // 1  // 269
	var options = {                                                                                           // 2  // 270
		auth: Stripe.secretKey,                                                                                  // 3  // 271
		params: object                                                                                           // 4  // 272
	}                                                                                                         // 5  // 273
	                                                                                                          // 6  // 274
	return HTTP.call('POST', Stripe.baseUrl + 'customers/' + id + '/subscriptions', options).data;            // 7  // 275
}                                                                                                          // 8  // 276
                                                                                                           // 9  // 277
Stripe.customers.retrieveSubscription = function(id, subId) {                                              // 10
	var options = {                                                                                           // 11
		auth: Stripe.secretKey                                                                                   // 12
	}                                                                                                         // 13
	                                                                                                          // 14
	return HTTP.call('GET', Stripe.baseUrl + 'customers/' + id + '/subscriptions/' + subId, options).data;    // 15
                                                                                                           // 16
}                                                                                                          // 17
                                                                                                           // 18
Stripe.customers.updateSubscription = function(id, subId, object) {                                        // 19
	var options = {                                                                                           // 20
		auth: Stripe.secretKey,                                                                                  // 21
		params: object                                                                                           // 22
	}                                                                                                         // 23
	                                                                                                          // 24
	return HTTP.call('POST', Stripe.baseUrl + 'customers/' + id + '/subscriptions/' + subId, options).data;   // 25
}                                                                                                          // 26
                                                                                                           // 27
Stripe.customers.cancelSubscription = function(id, subId) {                                                // 28
	var options = {                                                                                           // 29
		auth: Stripe.secretKey                                                                                   // 30
	}                                                                                                         // 31
	                                                                                                          // 32
	return HTTP.call('DELETE', Stripe.baseUrl + 'customers/' + id + '/subscriptions/' + subId, options).data; // 33
}                                                                                                          // 34
                                                                                                           // 35
Stripe.customers.listSubscriptions = function(id) {                                                        // 36
	var options = {                                                                                           // 37
		auth: Stripe.secretKey,                                                                                  // 38
		params: object                                                                                           // 39
	}                                                                                                         // 40
	                                                                                                          // 41
	return HTTP.call('GET', Stripe.baseUrl + 'customers/' + id + '/subscriptions', options).data;             // 42
}                                                                                                          // 43
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 312
                                                                                                                 // 313
}).call(this);                                                                                                   // 314
                                                                                                                 // 315
                                                                                                                 // 316
                                                                                                                 // 317
                                                                                                                 // 318
                                                                                                                 // 319
                                                                                                                 // 320
(function () {                                                                                                   // 321
                                                                                                                 // 322
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 323
//                                                                                                         //    // 324
// packages/benjick:stripe-native/server/methods/plans.js                                                  //    // 325
//                                                                                                         //    // 326
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 327
                                                                                                           //    // 328
Stripe.plans = {};                                                                                         // 1  // 329
                                                                                                           // 2  // 330
Stripe.plans.create = function(object) {                                                                   // 3  // 331
	var options = {                                                                                           // 4  // 332
		auth: Stripe.secretKey,                                                                                  // 5  // 333
		params: object                                                                                           // 6  // 334
	}                                                                                                         // 7  // 335
	                                                                                                          // 8  // 336
	return HTTP.call('POST', Stripe.baseUrl + 'plans', options).data;                                         // 9  // 337
}                                                                                                          // 10
                                                                                                           // 11
Stripe.plans.retrieve = function(id) {                                                                     // 12
	var options = {                                                                                           // 13
		auth: Stripe.secretKey                                                                                   // 14
	}                                                                                                         // 15
	                                                                                                          // 16
	return HTTP.call('GET', Stripe.baseUrl + 'plans/' + id, options).data;                                    // 17
}                                                                                                          // 18
                                                                                                           // 19
Stripe.plans.update = function(id, object) {                                                               // 20
	var options = {                                                                                           // 21
		auth: Stripe.secretKey,                                                                                  // 22
		params: object                                                                                           // 23
	}                                                                                                         // 24
	                                                                                                          // 25
	return HTTP.call('POST', Stripe.baseUrl + 'plans/' + id, options).data;                                   // 26
}                                                                                                          // 27
                                                                                                           // 28
Stripe.plans.del = function(id) {                                                                          // 29
	var options = {                                                                                           // 30
		auth: Stripe.secretKey                                                                                   // 31
	}                                                                                                         // 32
	                                                                                                          // 33
	return HTTP.call('DELETE', Stripe.baseUrl + 'plans/' + id, options).data;                                 // 34
}                                                                                                          // 35
                                                                                                           // 36
Stripe.plans.list = function(object) {                                                                     // 37
	var options = {                                                                                           // 38
		auth: Stripe.secretKey,                                                                                  // 39
		params: object                                                                                           // 40
	}                                                                                                         // 41
	                                                                                                          // 42
	return HTTP.call('GET', Stripe.baseUrl + 'plans', options).data;                                          // 43
}                                                                                                          // 44
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 373
                                                                                                                 // 374
}).call(this);                                                                                                   // 375
                                                                                                                 // 376
                                                                                                                 // 377
                                                                                                                 // 378
                                                                                                                 // 379
                                                                                                                 // 380
                                                                                                                 // 381
(function () {                                                                                                   // 382
                                                                                                                 // 383
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 384
//                                                                                                         //    // 385
// packages/benjick:stripe-native/server/methods/coupons.js                                                //    // 386
//                                                                                                         //    // 387
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 388
                                                                                                           //    // 389
Stripe.coupons = {};                                                                                       // 1  // 390
                                                                                                           // 2  // 391
Stripe.coupons.create = function(object) {                                                                 // 3  // 392
	var options = {                                                                                           // 4  // 393
		auth: Stripe.secretKey,                                                                                  // 5  // 394
		params: object                                                                                           // 6  // 395
	}                                                                                                         // 7  // 396
	                                                                                                          // 8  // 397
	return HTTP.call('POST', Stripe.baseUrl + 'coupons', options).data;                                       // 9  // 398
}                                                                                                          // 10
                                                                                                           // 11
Stripe.coupons.retrieve = function(id) {                                                                   // 12
	var options = {                                                                                           // 13
		auth: Stripe.secretKey                                                                                   // 14
	}                                                                                                         // 15
	                                                                                                          // 16
	return HTTP.call('GET', Stripe.baseUrl + 'coupons/' + id, options).data;                                  // 17
}                                                                                                          // 18
                                                                                                           // 19
Stripe.coupons.update = function(id, object) {                                                             // 20
	var options = {                                                                                           // 21
		auth: Stripe.secretKey,                                                                                  // 22
		params: object                                                                                           // 23
	}                                                                                                         // 24
	                                                                                                          // 25
	return HTTP.call('POST', Stripe.baseUrl + 'coupons/' + id, options).data;                                 // 26
}                                                                                                          // 27
                                                                                                           // 28
Stripe.coupons.del = function(id) {                                                                        // 29
	var options = {                                                                                           // 30
		auth: Stripe.secretKey                                                                                   // 31
	}                                                                                                         // 32
	                                                                                                          // 33
	return HTTP.call('DELETE', Stripe.baseUrl + 'coupons/' + id, options).data;                               // 34
}                                                                                                          // 35
                                                                                                           // 36
Stripe.coupons.list = function() {                                                                         // 37
	var options = {                                                                                           // 38
		auth: Stripe.secretKey                                                                                   // 39
	}                                                                                                         // 40
	                                                                                                          // 41
	return HTTP.call('GET', Stripe.baseUrl + 'coupons', options).data;                                        // 42
}                                                                                                          // 43
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 433
                                                                                                                 // 434
}).call(this);                                                                                                   // 435
                                                                                                                 // 436
                                                                                                                 // 437
                                                                                                                 // 438
                                                                                                                 // 439
                                                                                                                 // 440
                                                                                                                 // 441
(function () {                                                                                                   // 442
                                                                                                                 // 443
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 444
//                                                                                                         //    // 445
// packages/benjick:stripe-native/server/methods/discounts.js                                              //    // 446
//                                                                                                         //    // 447
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 448
                                                                                                           //    // 449
Stripe.customers.deleteDiscount = function(id) {                                                           // 1  // 450
	var options = {                                                                                           // 2  // 451
		auth: Stripe.secretKey                                                                                   // 3  // 452
	}                                                                                                         // 4  // 453
	                                                                                                          // 5  // 454
	return HTTP.call('DELETE', Stripe.baseUrl + 'customers/' + id + '/discount', options).data;               // 6  // 455
}                                                                                                          // 7  // 456
                                                                                                           // 8  // 457
Stripe.customers.deleteSubscriptionDiscount = function(id, subId) {                                        // 9  // 458
	var options = {                                                                                           // 10
		auth: Stripe.secretKey                                                                                   // 11
	}                                                                                                         // 12
	                                                                                                          // 13
	return HTTP.call('DELETE', Stripe.baseUrl + 'customers/' + id + '/subscriptions/' + subId + '/discount', options).data;
}                                                                                                          // 15
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 465
                                                                                                                 // 466
}).call(this);                                                                                                   // 467
                                                                                                                 // 468
                                                                                                                 // 469
                                                                                                                 // 470
                                                                                                                 // 471
                                                                                                                 // 472
                                                                                                                 // 473
(function () {                                                                                                   // 474
                                                                                                                 // 475
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 476
//                                                                                                         //    // 477
// packages/benjick:stripe-native/server/methods/invoices.js                                               //    // 478
//                                                                                                         //    // 479
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 480
                                                                                                           //    // 481
Stripe.invoices = {};                                                                                      // 1  // 482
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 483
                                                                                                                 // 484
}).call(this);                                                                                                   // 485
                                                                                                                 // 486
                                                                                                                 // 487
                                                                                                                 // 488
                                                                                                                 // 489
                                                                                                                 // 490
                                                                                                                 // 491
(function () {                                                                                                   // 492
                                                                                                                 // 493
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 494
//                                                                                                         //    // 495
// packages/benjick:stripe-native/server/methods/invoiceItems.js                                           //    // 496
//                                                                                                         //    // 497
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 498
                                                                                                           //    // 499
Stripe.invoiceItems = {};                                                                                  // 1  // 500
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 501
                                                                                                                 // 502
}).call(this);                                                                                                   // 503
                                                                                                                 // 504
                                                                                                                 // 505
                                                                                                                 // 506
                                                                                                                 // 507
                                                                                                                 // 508
                                                                                                                 // 509
(function () {                                                                                                   // 510
                                                                                                                 // 511
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 512
//                                                                                                         //    // 513
// packages/benjick:stripe-native/server/methods/disputes.js                                               //    // 514
//                                                                                                         //    // 515
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 516
                                                                                                           //    // 517
                                                                                                           // 1  // 518
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 519
                                                                                                                 // 520
}).call(this);                                                                                                   // 521
                                                                                                                 // 522
                                                                                                                 // 523
                                                                                                                 // 524
                                                                                                                 // 525
                                                                                                                 // 526
                                                                                                                 // 527
(function () {                                                                                                   // 528
                                                                                                                 // 529
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 530
//                                                                                                         //    // 531
// packages/benjick:stripe-native/server/methods/transferReversals.js                                      //    // 532
//                                                                                                         //    // 533
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 534
                                                                                                           //    // 535
                                                                                                           // 1  // 536
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 537
                                                                                                                 // 538
}).call(this);                                                                                                   // 539
                                                                                                                 // 540
                                                                                                                 // 541
                                                                                                                 // 542
                                                                                                                 // 543
                                                                                                                 // 544
                                                                                                                 // 545
(function () {                                                                                                   // 546
                                                                                                                 // 547
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 548
//                                                                                                         //    // 549
// packages/benjick:stripe-native/server/methods/recipients.js                                             //    // 550
//                                                                                                         //    // 551
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 552
                                                                                                           //    // 553
Stripe.recipients = {};                                                                                    // 1  // 554
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 555
                                                                                                                 // 556
}).call(this);                                                                                                   // 557
                                                                                                                 // 558
                                                                                                                 // 559
                                                                                                                 // 560
                                                                                                                 // 561
                                                                                                                 // 562
                                                                                                                 // 563
(function () {                                                                                                   // 564
                                                                                                                 // 565
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 566
//                                                                                                         //    // 567
// packages/benjick:stripe-native/server/methods/applicationFees.js                                        //    // 568
//                                                                                                         //    // 569
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 570
                                                                                                           //    // 571
Stripe.applicationFees = {};                                                                               // 1  // 572
                                                                                                           // 2  // 573
Stripe.applicationFees.retrieve = function(id) {                                                           // 3  // 574
	var options = {                                                                                           // 4  // 575
		auth: Stripe.secretKey                                                                                   // 5  // 576
	}                                                                                                         // 6  // 577
                                                                                                           // 7  // 578
	return HTTP.call('GET', Stripe.baseUrl + 'application_fees/' + id, options).data;                         // 8  // 579
}                                                                                                          // 9  // 580
                                                                                                           // 10
Stripe.applicationFees.list = function(object) {                                                           // 11
	var options = {                                                                                           // 12
		auth: Stripe.secretKey,                                                                                  // 13
		params: object                                                                                           // 14
	}                                                                                                         // 15
                                                                                                           // 16
	return HTTP.call('GET', Stripe.baseUrl + 'application_fees', options).data;                               // 17
}                                                                                                          // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 590
                                                                                                                 // 591
}).call(this);                                                                                                   // 592
                                                                                                                 // 593
                                                                                                                 // 594
                                                                                                                 // 595
                                                                                                                 // 596
                                                                                                                 // 597
                                                                                                                 // 598
(function () {                                                                                                   // 599
                                                                                                                 // 600
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 601
//                                                                                                         //    // 602
// packages/benjick:stripe-native/server/methods/applicationFeeRefunds.js                                  //    // 603
//                                                                                                         //    // 604
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 605
                                                                                                           //    // 606
                                                                                                           // 1  // 607
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 608
                                                                                                                 // 609
}).call(this);                                                                                                   // 610
                                                                                                                 // 611
                                                                                                                 // 612
                                                                                                                 // 613
                                                                                                                 // 614
                                                                                                                 // 615
                                                                                                                 // 616
(function () {                                                                                                   // 617
                                                                                                                 // 618
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 619
//                                                                                                         //    // 620
// packages/benjick:stripe-native/server/methods/accounts.js                                               //    // 621
//                                                                                                         //    // 622
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 623
                                                                                                           //    // 624
Stripe.accounts = {};                                                                                      // 1  // 625
Stripe.account = {};                                                                                       // 2  // 626
                                                                                                           // 3  // 627
Stripe.accounts.create = function(object) {                                                                // 4  // 628
	var options = {                                                                                           // 5  // 629
		auth: Stripe.secretKey,                                                                                  // 6  // 630
		params: object                                                                                           // 7  // 631
	}                                                                                                         // 8  // 632
	                                                                                                          // 9  // 633
	return HTTP.call('POST', Stripe.baseUrl + 'accounts', options).data;                                      // 10
}                                                                                                          // 11
                                                                                                           // 12
Stripe.account.retrieve = function(id) {                                                                   // 13
	var options = {                                                                                           // 14
		auth: Stripe.secretKey                                                                                   // 15
	}                                                                                                         // 16
	                                                                                                          // 17
	if(typeof(id) === 'undefined') {                                                                          // 18
		return HTTP.call('GET', Stripe.baseUrl + 'account', options).data;                                       // 19
	}                                                                                                         // 20
	else {                                                                                                    // 21
		return HTTP.call('GET', Stripe.baseUrl + 'accounts/' + id, options).data;                                // 22
	}                                                                                                         // 23
}                                                                                                          // 24
                                                                                                           // 25
Stripe.accounts.update = function(id, object) {                                                            // 26
	var options = {                                                                                           // 27
		auth: Stripe.secretKey,                                                                                  // 28
		params: object                                                                                           // 29
	}                                                                                                         // 30
	                                                                                                          // 31
	return HTTP.call('POST', Stripe.baseUrl + 'accounts/' + id, options).data;                                // 32
}                                                                                                          // 33
                                                                                                           // 34
Stripe.accounts.list = function(object) {                                                                  // 35
	var options = {                                                                                           // 36
		auth: Stripe.secretKey                                                                                   // 37
	}                                                                                                         // 38
	                                                                                                          // 39
	return HTTP.call('GET', Stripe.baseUrl + 'accounts', options).data;                                       // 40
}                                                                                                          // 41
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 666
                                                                                                                 // 667
}).call(this);                                                                                                   // 668
                                                                                                                 // 669
                                                                                                                 // 670
                                                                                                                 // 671
                                                                                                                 // 672
                                                                                                                 // 673
                                                                                                                 // 674
(function () {                                                                                                   // 675
                                                                                                                 // 676
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 677
//                                                                                                         //    // 678
// packages/benjick:stripe-native/server/methods/balance.js                                                //    // 679
//                                                                                                         //    // 680
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 681
                                                                                                           //    // 682
Stripe.balance = {};                                                                                       // 1  // 683
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 684
                                                                                                                 // 685
}).call(this);                                                                                                   // 686
                                                                                                                 // 687
                                                                                                                 // 688
                                                                                                                 // 689
                                                                                                                 // 690
                                                                                                                 // 691
                                                                                                                 // 692
(function () {                                                                                                   // 693
                                                                                                                 // 694
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 695
//                                                                                                         //    // 696
// packages/benjick:stripe-native/server/methods/events.js                                                 //    // 697
//                                                                                                         //    // 698
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 699
                                                                                                           //    // 700
Stripe.events = {};                                                                                        // 1  // 701
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 702
                                                                                                                 // 703
}).call(this);                                                                                                   // 704
                                                                                                                 // 705
                                                                                                                 // 706
                                                                                                                 // 707
                                                                                                                 // 708
                                                                                                                 // 709
                                                                                                                 // 710
(function () {                                                                                                   // 711
                                                                                                                 // 712
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 713
//                                                                                                         //    // 714
// packages/benjick:stripe-native/server/methods/tokens.js                                                 //    // 715
//                                                                                                         //    // 716
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 717
                                                                                                           //    // 718
Stripe.tokens = {};                                                                                        // 1  // 719
                                                                                                           // 2  // 720
Stripe.tokens.create = function (object) {                                                                 // 3  // 721
	var options = {                                                                                           // 4  // 722
		auth: Stripe.secretKey,                                                                                  // 5  // 723
		params: object                                                                                           // 6  // 724
	}                                                                                                         // 7  // 725
                                                                                                           // 8  // 726
	return HTTP.call('POST', Stripe.baseUrl + 'tokens', options).data;                                        // 9  // 727
}                                                                                                          // 10
                                                                                                           // 11
Stripe.tokens.retrieve = function (id) {                                                                   // 12
	var options = {                                                                                           // 13
		auth: Stripe.secretKey                                                                                   // 14
	}                                                                                                         // 15
                                                                                                           // 16
	return HTTP.call('GET', Stripe.baseUrl + 'tokens/' + id, options).data;                                   // 17
                                                                                                           // 18
}                                                                                                          // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 738
                                                                                                                 // 739
}).call(this);                                                                                                   // 740
                                                                                                                 // 741
                                                                                                                 // 742
                                                                                                                 // 743
                                                                                                                 // 744
                                                                                                                 // 745
                                                                                                                 // 746
(function () {                                                                                                   // 747
                                                                                                                 // 748
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 749
//                                                                                                         //    // 750
// packages/benjick:stripe-native/server/methods/bitcoinReceivers.js                                       //    // 751
//                                                                                                         //    // 752
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 753
                                                                                                           //    // 754
Stripe.bitcoinReceivers = {};                                                                              // 1  // 755
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 756
                                                                                                                 // 757
}).call(this);                                                                                                   // 758
                                                                                                                 // 759
                                                                                                                 // 760
                                                                                                                 // 761
                                                                                                                 // 762
                                                                                                                 // 763
                                                                                                                 // 764
(function () {                                                                                                   // 765
                                                                                                                 // 766
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 767
//                                                                                                         //    // 768
// packages/benjick:stripe-native/server/methods/fileUploads.js                                            //    // 769
//                                                                                                         //    // 770
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 771
                                                                                                           //    // 772
Stripe.fileUploads = {};                                                                                   // 1  // 773
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 774
                                                                                                                 // 775
}).call(this);                                                                                                   // 776
                                                                                                                 // 777
                                                                                                                 // 778
                                                                                                                 // 779
                                                                                                                 // 780
                                                                                                                 // 781
                                                                                                                 // 782
(function () {                                                                                                   // 783
                                                                                                                 // 784
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 785
//                                                                                                         //    // 786
// packages/benjick:stripe-native/server/methods/discounts.js                                              //    // 787
//                                                                                                         //    // 788
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 789
                                                                                                           //    // 790
Stripe.customers.deleteDiscount = function(id) {                                                           // 1  // 791
	var options = {                                                                                           // 2  // 792
		auth: Stripe.secretKey                                                                                   // 3  // 793
	}                                                                                                         // 4  // 794
	                                                                                                          // 5  // 795
	return HTTP.call('DELETE', Stripe.baseUrl + 'customers/' + id + '/discount', options).data;               // 6  // 796
}                                                                                                          // 7  // 797
                                                                                                           // 8  // 798
Stripe.customers.deleteSubscriptionDiscount = function(id, subId) {                                        // 9  // 799
	var options = {                                                                                           // 10
		auth: Stripe.secretKey                                                                                   // 11
	}                                                                                                         // 12
	                                                                                                          // 13
	return HTTP.call('DELETE', Stripe.baseUrl + 'customers/' + id + '/subscriptions/' + subId + '/discount', options).data;
}                                                                                                          // 15
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 806
                                                                                                                 // 807
}).call(this);                                                                                                   // 808
                                                                                                                 // 809
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['benjick:stripe-native'] = {
  Stripe: Stripe
};

})();

//# sourceMappingURL=benjick_stripe-native.js.map
