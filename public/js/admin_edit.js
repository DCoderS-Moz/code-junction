function updateEditEventSection(id){
	$.get('/admin/event/get/' + id, {
		'id': id
	} ,function(data, status){
		if(status == 'success'){
			$('#name').val(data.name);
			$('#language').val(data.language);
			$('#duration').val(data.duration);
			$('#question_buttons').html('<label>Questions</label><br>');
			for(var i = 1; i<=data.number_of_questions; i++){
				$('#question_buttons').append('<a href="/admin/event/get/' + data._id + '/' + i + '" target="_blank" class="btn btn-primary">Question ' + i + '</a> ');
			}
		}
	});
}

function deleteEvent(id){
	if(confirm("This change cannot be reverted.") == true){
		$.post('/admin/event/delete', {
			'id': id
		} ,function(data, status){
			if(data == 'success'){
				alert('Event has been deleted.');
				window.location = '/admin';
			}
		});
	}
}

$('#save').click(function(){
	$.post('/admin/event/update', {
		'id': $('#event_id').html(),
		'name': $('#name').val(),
		'language': $('#language').val(),
		'duration': $('#duration').val()
	} ,function(data, status){
		if(data == 'success'){
			updateEditEventSection($('#event_id').html());
			alert('Event has been updated.');
		}
	});
});

$(document).ready(function(){
	updateEditEventSection($('#event_id').html());
});