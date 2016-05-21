(function() {

	var d = {
		a: 1,
		b: 2,
		c: 3
	}

	$('.btn').click(function() {
		alert('click me1111?');
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
		url: '/rest/login',
		type: 'post',
		data: {
			'account': 'zjzhome1',
			'password': '123456'
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