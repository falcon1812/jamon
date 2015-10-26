var data = getElement('datatable');
if (data) {
	for (var i = 0; i < data.length; i++) {
		var TablaId = data[i].id;
		$(document).ready(function() {
			var LaTabla = $('#'+TablaId).DataTable({
				ajax: thismethod('listado'),
				"drawCallback": function (Settings) {
					Crud(); // Crud JamonJs
					$('button').on('click', function() {
						LaTabla.ajax.reload();
					});
				},
				"language": {
					"search": "Buscar: ",
					"lengthMenu": "Mostrar _MENU_ por pagina",
					"zeroRecords": "No se encontro ninguna coincidencia.",
					"info": "Mostrando pagina _PAGE_ de _PAGES_",
					"infoEmpty": "No hay registros disponibles",
					"infoFiltered": "(Filtrado por un total de _MAX_ registros)",
					"loadingRecords": "Cargando...",
    				"processing":     "Procesando...",
					"paginate": {
						"first":      "Primero",
						"last":       "Ultimo",
						"next":       "Siguiente",
						"previous":   "Anterior"
					},
				}
			});
		});
	}
}
