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

getWeekNumber = function(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
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