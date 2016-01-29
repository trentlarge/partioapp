areaFinder = function(done){
	checkUserLocation(function(result){
		if(!result) {
			return;
		}

		var miles = 5;
		var max_distance = 1.60934*miles; //need to be in km

		var duke_lat = 41.919769;
		var duke_lng = -91.649501;

		var yale_lat = 14.627310;
		var yale_lng = 121.053896;

		var duke_distance = nearByLocation.getDistance({
	        latA: result.lat,
	        latB: duke_lat,
	        lngA: result.long,
	        lngB: duke_lng
	    })

	    //console.log('duke distance >>>', duke_distance);

	    var _area = 0;

		//duke
		if(duke_distance <= max_distance) {
			_area = 1;
		}

	    var yale_distance = nearByLocation.getDistance({
	        latA: result.lat,
	        latB: yale_lat,
	        lngA: result.long,
	        lngB: yale_lng
	    })

	   // console.log('yale distance >>>', yale_distance);

	    //yake
	    if(yale_distance <= max_distance) {
			_area = 2;
		}

		done(_area);
	})	
}


