$(document).ready(function(){
	$('#url').on('change',function(e){
		var reg = /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
		if (reg.test($('#url').val())) { 
    		$('#valid').html('<font color="green">Looks good!</font>');
    		$('#url').css('border','1.3px solid green');
    		$('#button').removeAttr('disabled');
			return true;
		}
		else if(!reg.test($('#url').val()))
		{
			$('#valid').html('<font color="red">Enter valid URL!</font>');
			$('#url').css('border','1.3px solid red');
			$('#button').attr('disabled','disabled');
			return false;
		}
	});

	$('#key').on('keyup', function(e){
		var k = $(this).val();
		if(k.length == 0)
			$('#check').html('');
		else{
			$.ajax({
				type: "POST",
				url: "/check",
				data: {key: k},
				success: function(data)
				{
					if(data == "available"){
							$('#check').html('<font color="red">Not Available</font>');
							$('#key').css('border','1.3px solid red');
							$('#button').attr('disabled','disabled');
					}
					else{
						$('#check').html('<font color="green">Available</font>');
						$('#key').css('border','1.3px solid green');
						$('#button').removeAttr('disabled');
					}
				},
				error: function(data)
				{
					console.log("App not functioning properly!");
				}
			});	
		}
	});

	$('#short-url-form').submit(function(e){
		e.preventDefault();
		var u = $('#url').val();
		var k = $('#key').val();

		if(u == "")
		{
			$('#valid').html('<font color="red">Enter a valid url!</font>');
			$('#url').css('border','1.3px solid red');
			return;
		}
		else
			$('#valid').html('');
			
			$.ajax({
				type: "POST",
				url: "/short",
				data: { url: u,key: k},
				success: function(data)
				{
					console.log('key: '+data);
					if(data){
						$('#result').html('<div class="alert alert-Success" role="alert">You have successfully created your short url, Here is your short url:<br><div class="input-group"><div class="input-group-prepend"><div class="input-group-text"><i class="fas fa-link"></i></div></div><input type="text" class="form-control" value=https://dockurl.herokuapp.com/'+data+' readonly></div></div>');
					}
					else{
						$('#result').html('<div class="alert alert-danger" role="alert">Some error Occured !</div>');
					}
				},
				error: function(data)
				{
					console.log('Custom URL Generate Request Failed!');				
				}
			});
	});
});