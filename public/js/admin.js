function editEvent(id){
	window.location = '/admin/event/edit/' + id;
}

function startEvent(id){
	$.post('/admin/event/start', {
		'id': id
	} ,function(data, status){
		if(data == 'success'){
			updateTable();
		}
	});
}

function stopEvent(id){
	$.post('/admin/event/stop', {
		'id': id
	} ,function(data, status){
		if(data == 'success'){
			updateTable();
		}
	});
}

function updateTable(){
	$.get('/admin/event/get/all', function(data, status){
		if(status == 'success'){
			var i;
			$('#eventTable tbody').html('');
			for(i=0; i<data.length; i++){
				var date = new Date(data[i].date);
				$('#eventTable tbody').append('<tr> <td>' + data[i].name + '</td> <td>' + date   + '</td> <td>' + data[i].language + '</td> <td>' + data[i].duration + '</td> <td>' + data[i].status + '</td> <td> <button class=\'btn btn-xs btn-warning\' onclick=\'editEvent("' + data[i]._id + '")\'> Edit </button> <button class=\'btn btn-xs btn-success\' onclick=\'startEvent("' + data[i]._id + '")\'> Start </button> <button class=\'btn btn-xs btn-danger\' onclick=\'stopEvent("' + data[i]._id + '")\'> Stop </button> </td> </tr>');
			}
		}	
	});
}

$(document).ready(function(){
	updateTable();
});