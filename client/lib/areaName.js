areaName = function(id) {
	if(!id) {
		return false;
	}

	switch(id) {
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