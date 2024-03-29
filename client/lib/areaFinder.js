areaFinder = function(done){
	checkUserLocation(function(result){
		if(!result) {
			done(false);
		}

		var miles = 10;
		var max_distance = 1.60934*miles; //need to be in km

	    var _area = 0;

	    //duke test ----------------------------------------------------------
	    var duke_lat = 36.0014301;
		var duke_lng = -78.9404226;

		var duke = nearByLocation.getDistance({
	        latA: result.lat,
	        latB: duke_lat,
	        lngA: result.long,
	        lngB: duke_lng
	    })

	    //console.log('duke distance >>>', duke.distance);

		if(duke.distance <= max_distance) {
			_area = 1;
		}
	   
	    //yale test ------------------------------------------------------------
		var yale_lat = 41.3163284;
		var yale_lng = -72.9245371;

	    var yale = nearByLocation.getDistance({
	        latA: result.lat,
	        latB: yale_lat,
	        lngA: result.long,
	        lngB: yale_lng
	    })

	  	//console.log('yale distance >>>', yale.distance);

	    if(yale.distance <= max_distance) {
			_area = 2;
		}


		//test -----------------------------------------------------------------
		// var test_lat = -18.912852;
		// var test_lng = -48.277467;

		// var test = nearByLocation.getDistance({
	 //        latA: result.lat,
	 //        latB: test_lat,
	 //        lngA: result.long,
	 //        lngB: test_lng
	 //    })

	 //   	console.log('test distance >>>', test.distance);

	 //    if(test.distance <= max_distance) {
		// 	_area = 3;
		// }

		// console.log(_area);

		done(_area);
	})	
}


