(function() {

	var d = {
		a: 1,
		b: 2,
		c: 3
	}

	$('.btn').click(function() {
		alert('click me1?');
	});

	$.ajax({
		url: '/rest/hh/121',
		type: 'get',
		dataType: 'json',
		success: function(result) {
			console.log(result);
		}
	});

	$.ajax({
		url: '/rest/other',
		type: 'get',
		data: {
			id: 232322
		},
		dataType: 'json',
		success: function(result) {
			console.log(result);
		}
	});

	$.ajax({
		url: '/rest/user',
		type: 'post',
		data: {
			'username': 'zjzhome',
			'password': 'abcdefg'
		},
		dataType: 'json',
		success: function(result) {
			console.log(result)
		}
	})

	$.ajax({
		url: '/rest/com',
		type: 'get',
		dataType: 'json',
		success: function(result) {
			console.log(result)
		}
	})

})();