formatDate = function(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = month + "-" + day + "-" + year;
    return date;
}

ShowNotificationMessage = function(strMessage){
	IonPopup.show({
		title: 'Alert',
		template: strMessage,
		buttons:
		[{
			text: 'OK',
			type: 'button-energized',
			onTap: function() {
				IonPopup.close();
			}
		}]
	});
}

jQuery.slowEach = function(array, interval, callback) {
    if(!array.length) return;
    var i = 0;
    next();
  
    function next() {
        if(callback.call(array[i], i, array[i]) !== false)
            if(++i < array.length)
                setTimeout(next, interval);
    }
      
    return array;
};
  
jQuery.fn.slowEach = function(interval, callback) {
    return jQuery.slowEach(this, interval, callback);
};