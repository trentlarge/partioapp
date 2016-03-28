checkUserLocation = function(callback){
 	navigator.geolocation.getCurrentPosition(function(position){
		var result = { lat: position.coords.latitude, lng: position.coords.longitude }
		callback(result);
	}, function(error){
		callback(false);
	});
}
