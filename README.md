# marketo-wrapper

Libraray that wrappes the marketo API and simplfies the use of the Marketo form2 API functunality.
The API Exposes methods for validating and submitting your local form into marketo.

	
## How to start

	1) Create your form with the same ID's that the marketo form uses.
	2) Include the dist folder (includes the library, form2.js and jquery).
	3) Create the options object:
	   var options = {
  			marketoAPIUrl: "http://app-ab18.marketo.com",
  			munchkinId: "<your munchkin Id>",
  			formid: <your form Id>,
  			fields: [ // replace with your form fields
  				{id: "petName", type: "input"},
  				{id: "petTypes", type: "select"},
  			],
  			onSuccess: function() {
  				console.log("yey");
  			}
  		}	
	4) Call the marketo wrapper API: new RubiconMarketo(options);
	   This will create the form.
	5) Create a button for submit and validate if needed and associate them to the marketo wrapper API submit and validate:
	   function validate() {
  			var isValid = window.marketo.validate();
  		}
  		
  		function submit() {
  			window.marketo.submit();
  		} 
  		
### That's it your good to go.
	   