function updateQA(){
	var id = $('#event_id').html();
	var question_number = $('#question_number').html();
	$.get('/admin/event/question/' + id + '/' + question_number, function(data, status){
		$('#question').val(data);
	});
	$.get('/admin/event/answer/' + id + '/' + question_number, function(data, status){
		$('#input').val(data);
	});
}
			
$('#save').click(function(){
	$.post('/admin/event/update/' + $('#event_id').html() + '/' + $('#question_number').html(), {
		question: $('#question').val(),
		answer: $('#input').val()
	}, function(data,status){
		alert(data);
		updateQA();
	});
});

$(document).ready(function(){
	updateQA();
});