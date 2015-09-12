<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jamon</title>
    <script src="libs/routes.js"></script>
    <script src="libs/jquery.min.js"></script>
    <script type="text/html" id="home">
        <h1>Rutas principales</h1>
    </script>
    <script type="text/html" id="template1">
        <h1>Pagina 1: <%= encabezado %></h1>
        <p id="loading"><%= texto %></p>
    </script>
    <script type="text/html" id="template2">
        <h1>Pagina 2: <%= encabezado %></h1>
        <p><%= encabezado %></p>
    </script>
</head>
<body>
    <ul>
        <li><a href="#">Inicio</a></li>
        <li><a href="#/page1">Pagina 1</a></li>
        <li><a href="#/page2">Pagina 2</a></li>
    </ul>
<div id="view"></div>
<script>
$(document).ready(function($) {
    route('/', 'home', function () {});
    route('/page1', 'template1', function () {
        this.encabezado = 'Rutas de js, like a boss';
        this.texto = 'Cargando';
        // Tarda 0.5s
        setTimeout(function () {
            $.getJSON("data.json", function(json) {
                var data = [];
                $.each(json, function(key,value) {
                    $('#loading').remove();
                    $('#view').append('<p id="'+key+'">'+value+'</p>');
                });
            });
        }.bind(this), 500);
    });
    route('/page2', 'template2', function () {
        this.encabezado = 'Hola';
    });
});
</script>
</body>
</html>