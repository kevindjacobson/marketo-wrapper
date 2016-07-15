/** 
 * @author gilboagl
 * create a wrapper around marketo in order 
 * to copy the values and submit the form via 
 * the marketo API
 * @param {Object} options - initialization options
 * @param {String} options.marketoLibUrl - marketo JS library location, default: ./dist/vendor/marketo/forms2.js
 * @param {String} options.jquery - Jquery library file location if it wasn't important on the page already, default: ./dist/vendor/jquery/jquery.min.js
 * @param {String} options.marketoAPIUrl - marketo API url location, default: ""
 * @param {String} options.munchkinId - munchkinId id, default: ""
 * @param {Long} options.formid - default: ""
 * @param {String} options.fields - the fields that are going to be present in the form, should be an array of objects, example: 
 * 									[{id: column1, type: select/input}]
 * 									...
 * @param {function} options.onSuccess - submit success callback, default: console.log("form submitted sussesfully")
 * @constructor
 */
function RubiconMarketo(options) {
	"use strict";
	
	var _self = this;
	
	/** @access private */
	_self.defaultOptions = {
		marketoLibUrl: "http://app-ab18.marketo.com/js/forms2/js/forms2.min.js",
		jquery: "https://code.jquery.com/jquery-2.2.4.min.js",
		marketoAPIUrl: "",
		munchkinId: "",
		formid: "",
		fields: [], // [{id: <DOM_ID>, type: <input/select>}]
		onSuccess: function() {
			console.log("form submitted sussesfully");
		}
	};
	var isValid = validateOptions();
	if(isValid)
		return false;
	
	if(window)
	{	
		// load jquery if not loaded yet
		if(!window.jQuery) {
			loadScript(_self.defaultOptions.jquery, function(){
				loadMarketo();
			});
		}
		else
			loadMarketo();
	}
	
	/*****************************************************************
	 ********************** public functions ************************* 
	 *****************************************************************/
	
	/**
	* validate the form by filling up the fields and calling the api for validation
	* @param {Object} fields Optional - array of fields as key - value pair, example: {column1:value,...,...}, only needed if the data is 
	* 				  being sent from an internal process and there is no html representation of the fields
	* @access public
	*/
	function validateForm(fields) {
		if(!fields)
			setFieldValues();
		else
			forceSetFieldValues(fields);
		return _self.form.validate();
	}
	
	/**
	 * submit the form, this will fail if the values are not valid.
	 * @param {Object} fields Optional - array of fields as key/value pair, example: {column1:value,...,...}, only needed if the data is 
	 * 				   being sent from an internal process and there is no html representation of the fields
	 * @access public
	 */
	function submitForm(fields) {
		var response = false;
		if(!fields)
			setFieldValues();
		else
			forceSetFieldValues(fields);
		
		if(_self.form.validate()) {
			response = _self.form.submit();
		}
		
		return response;
	}
	
	/**
	 * get the field object which contains the:<br>
	 * 1) id <br>
	 * 2) type<br>
	 * 3) options - if its a select box<br>
	 * @access public
	 */
	function getFields() {
		return _self.defaultOptions.fields;
	}
	
	/**
	 * get the form DOM element
	 * @access public
	 */
	function getFormElem() {
		return _self.form.getFormElem();
	}
	
	/**
	 * get the marketo form ids
	 * @access public
	 */
	function getMarketoFormIds() {
		var idArray = [];
		
		for(var x in _self.form.getValues()) {
			idArray.push(x);
		}
		return idArray;
	}
	
	
	/*****************************************************************
	 ********************** private function ************************* 
	 *****************************************************************/
	
	/**
	 * get all the values from the fields and put them in the form
	 * 
	 */
	/** @access private */
	function setFieldValues() {
		var value = null;
		var id = null;
		var formValues = _self.form.getValues();
		for(var i = 0; i < _self.defaultOptions.fields.length ; i++) {
			id = '#' + _self.defaultOptions.fields[i].id;
			if(_self.defaultOptions.fields[i].type !== "select") {
				 value = $(id).val();
			}
			else
			{
				value = $(id + ' :selected').text();
			}
			formValues[_self.defaultOptions.fields[i].id] = value;
		}
		_self.form.setValues(formValues);
	}
	
	/**
	 * load the fields from a force object send by the user
	 */
	/** @access private */
	function forceSetFieldValues(fields) {
		var formValues = _self.form.getValues();
		for(var x in fields) {
			formValues[x] = fields[x];
		}
		_self.form.setValues(formValues);
	}
	
	
	/**
	 * copy over all of the user defined options 
	 */
	/** @access private */
	function validateOptions() {
		
		if(!options) {
			console.warning("The marketo form API could not be accessed, please provide valid access options");
		}
		
		for(var x in options) {
			_self.defaultOptions[x] = options[x];
		}
		return false;
	}
	
	/**
	 * load the marketo js api
	 */
	/** @access private */
	function loadMarketo() {
		loadScript(_self.defaultOptions.marketoLibUrl, function(){
			MktoForms2.loadForm(_self.defaultOptions.marketoAPIUrl, 
								_self.defaultOptions.munchkinId, 
								_self.defaultOptions.formid, 
								function(form) {
				// create form function
				_self.form = form;
				
				// load all the select options if needed
				for(var i = 0 ; i < _self.defaultOptions.fields.length ; i++) {
					var options = null;
					var id = '#' + _self.defaultOptions.fields[i].id;
					if(_self.defaultOptions.fields[i].type === "select") {
						options = form.getFormElem().find(id + ' option');
						
						var element = $(id);
						if(element && element.length > 0)
						{
							for(var y = 0 ; y < options.length ; y++) {
								$(options[y]).clone().appendTo(element);
							}
							$(id).val($(id + 'option:first').val());
						}
						else {
							_self.defaultOptions.fields[i].options = [];
							for(var opt = 0  ; opt < options.length ; opt++) {
								_self.defaultOptions.fields[i].options.push($(options[opt]).text());
							}
						}
							
					}
				}
				
				/**
				 * function to be triggered when a form is 
				 * successfully submitted
				 */
				_self.form.onSuccess(function(){
					_self.defaultOptions.onSuccess();
				});
			});
		});
	}
	
	/**
	 * load file
	 * @param url
	 * @param callback
	 * @returns callback return 
	 */
	/** @access private */
	function loadScript(url, callback){

		if(url === "")
		{
			callback();
			return false;
		}
		
	    var script = document.createElement("script");
	    script.type = "text/javascript";

	    if (script.readyState){  //IE
	        script.onreadystatechange = function(){
	            if (script.readyState == "loaded" ||
	                    script.readyState == "complete"){
	                script.onreadystatechange = null;
	                callback();
	            }
	        };
	    } else {  //Others
	        script.onload = function(){
	            callback();
	        };
	    }

	    script.src = url;
	    document.getElementsByTagName("head")[0].appendChild(script);
	}
	/**
	 * publicly exposed methods
	 */
	return {
		"validate": validateForm,
		"submit": submitForm,
		"getFields": getFields,
		"getFormElem": getFormElem,
		"getMarketoFormSelectorIds": getMarketoFormIds
	};
}
