/**
 *  @author gilboagl
 */



/**
 * @param {String} intervalStopField - setup an interval that will check if a field is visible on the screen
 * 										once he is match all the parameters to the fields.
 * @access public
 */
function urlToFields(intervalStopField) {
	
	var _self = this;
	
	if(intervalStopField) {
		_self.interval = setInterval(function(){
			if(document.getElementsByName(intervalStopField).length > 0) {
				init();
				clearInterval(_self.interval);
			}
		}, 1000);
	}
	else
		init();
	
	/** @access private */
	function init() {
		var splittedLocation = window.location.href.split("?");
		
		if(splittedLocation.length > 1)
		{
			var keyValuePair = splittedLocation[1].split("&");
			var values = null;
			var selector = null;
			for(var i = 0 ; i < keyValuePair.length ; i++) {
				values = keyValuePair[i].split("=");
				selector = document.getElementsByName(values[0]);
				
				// make sure there is only one selector with that name 
				// on the screen
				if(selector.length > 0) 
					selector[0].value = values[1];
			}
		}
	}
}