$(function(){

	$('#submit').click(function(){
		//alert($(':input#name').val());
		var errors = 0;
		$(':input').each(function(){
			if($(this).val().length==0){
				$(this).css('border', '3px dashed red');
				errors = 1;
			}
		});
		if(errors){
		return false;
		} else {
		//submit the form
		var data = 'name='+ $(':input#name').val() + '&email=' + $(':input#email').val() + '&message=' +$(':input#message').val();
		$.ajax({
			type: "POST",
			url: 'contact.php',
			data: data,
			success: function() {
				$('#contact-form').html("<div id='response'></div>");
				$("#response").html("<h2>Thank You!</h2><p>I'll be in touch shortly. :)</p>")
			}
		});
		return false;
		
		}
	});
	
	$(':input').focus(function(){
		$(this).css('border', '1px solid grey');
	});
	
	$(':input').blur(function(){
			if($(this).val().length==0){
				$(this).css('border', '3px dashed red');
			}
		
	});
	
	
});

