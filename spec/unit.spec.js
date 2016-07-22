
describe('Marketo API Wrapper Tests', function(){
	
	var marketo; 
	
	var options = {
		marketoAPIUrl: window.marketoAPIUrl,
		marketoLibUrl: window.marketoLibUrl, 
		munchkinId: window.munchkinId,
		formid: window.formid,
		fields: window.fields
	}
	
	var submit = {
		onSuccess: function() {
			cosnole.log('success');
		}
	}
	
	beforeAll(function(){
		marketo = new RubiconMarketo(options);
	});
	
	it('verify API exposed functions', function(){
		expect(marketo.validate).toBeDefined();
		expect(marketo.submit).toBeDefined();
		expect(marketo.getFields).toBeDefined();
		expect(marketo.getFormElem).toBeDefined();
		expect(marketo.getMarketoFormSelectorIds).toBeDefined();
	});
	
	it('verify that we get all of the ids', function(){
		setTimeout(function() { 
			var array = marketo.getMarketoFormSelectorIds();
			expect(array).toEqual(['petName', 'petTypes', 'formid', 'munchkinId']);
		}, 2000);
	})
	
	it('verify form elements', function(done){
		setTimeout(function() { // wait until the form is created
			var form = marketo.getFormElem();
			expect(form.find(".petName")).toBeDefined();
			expect(form.find(".petTypes")).toBeDefined();
			
			var fields = marketo.getFields();
			expect(fields.length).toEqual(2);
			
			// input
			expect(fields[0].type).toEqual("input");
			expect(fields[0].id).toEqual("petName");
			
			//select
			expect(fields[1].type).toEqual("select");
			expect(fields[1].id).toEqual("petTypes");
			expect(fields[1].options.length).toEqual(3);
			expect(fields[1].options).toEqual(["Select...", "Dog", "Cat"]);
			done();
			
	    }, 2000);
	})
	
	it('verify validate Marketo API functions', function(done){
		setTimeout(function() { // wait until the form is created
			expect(marketo.validate().isValid).toEqual(false);
			
			var fields = {
					petName: "maphet",
					petTypes: ""
			}
			
			// test mandatory fields petName
			expect(marketo.validate(fields).isValid).toEqual(true);
			
			fields.petTypes = "Dog";
			fields.petName = "";
			expect(marketo.validate(fields).isValid).toEqual(false);
			
			done();
		 }, 2000);
	})
	
//	it('verify submit Marketo API functions', function(done){
//		setTimeout(function() { // wait until the form is created
//			expect(marketo.submit()).toEqual(false);
//			
//			var fields = {
//				petName: "maphet",
//				petTypes: ""
//			}
//			
//			var response = marketo.submit(fields);
//			// test mandatory fields petName
//			
//			expect(response).not.toEqual(false);
//			done();
//		 }, 2000);
//	})
})
