areaName = function(id) {
	var _id = id.toString();

	if(!_id) {
		return false;
	}

	switch(_id) {
	  case '1':
	    var label = 'Duke University';       
	    break;
	  case '2':
	    var label = 'Yale University';
	    break;
	  default:
	    var label = 'Other';
	}

	return label;
}