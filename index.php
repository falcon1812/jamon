<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jamon</title>
    <script src="libs/routes.js"></script>
    <script type="text/html" id="home">
        <h1>Rutas principales</h1>
    </script>
    <script type="text/html" id="template1">
        <h1>Page 1: <%= greeting %></h1>
        <p><%= moreText %></p>
    </script>
    <script type="text/html" id="template2">
        <h1>Page 2: <%= heading %></h1>
        <p><%= heading %></p>
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
  route('/', 'home', function () {});
  route('/page1', 'template1', function () {
    this.greeting = 'Rutas de js, like a boss';
    this.moreText = 'Cargando...';
    // Tarda 0.5s
    setTimeout(function () {
            this.moreText = 'Christian...';
        }.bind(this), 500);
    });
  route('/page2', 'template2', function () {
        this.heading = 'Hola';
  });
  </script>
</body>
</html>
